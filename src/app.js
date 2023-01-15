"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const config = require("config");
const packageJson = require("../package.json");
const Sentry = require("@sentry/node");
const { stderrStream, stdoutStream } = require("./utils/logger/morgan");

require("dotenv").config();

const {
    errorDecorator,
    finalErrorHandler,
    notFoundErrorHandler,
    unhandledRejectionHandler,
    uncaughtExceptionHandler
} = require("./utils/errorMiddleware");

const app = express();

Sentry.init({
    dsn: config.get("sentry.dsn"),
    environment: process.env.NODE_ENV,
    release: packageJson.version
});

app.use(Sentry.Handlers.requestHandler());

app.use(helmet());

app.set("env", process.env.NODE_ENV);

app.use(stderrStream, stdoutStream);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(require("./controller"));

app.use(Sentry.Handlers.errorHandler());

app.use(notFoundErrorHandler);
process.on("unhandledRejection", unhandledRejectionHandler);
process.on("uncaughtException", uncaughtExceptionHandler);
app.use(errorDecorator);
app.use(finalErrorHandler);

module.exports = app;
