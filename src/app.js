"use strict";

require("dotenv").config();
const config = require("config");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const Sentry = require("@sentry/node");
const path = require("path");
const packageJson = require("../package.json");
const { stderrStream, stdoutStream } = require("./utils/logger/morgan");

const {
  errorDecorator,
  finalErrorHandler,
  notFoundErrorHandler,
  unhandledRejectionHandler,
  uncaughtExceptionHandler,
} = require("./utils/errorMiddleware");

Sentry.init({
  dsn: config.get("sentry.dsn"),
  environment: process.env.NODE_ENV,
  release: packageJson.version,
});

const app = express();

app.set("env", process.env.NODE_ENV);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(Sentry.Handlers.requestHandler());
app.use(helmet());
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
