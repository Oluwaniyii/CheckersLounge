"use strict";

const boom = require("@hapi/boom");
const Sentry = require("@sentry/node");
const winston = require("./logger/winston");

const exitProcess = () => {
  const sentryClient = Sentry.getCurrentHub().getClient();
  if (sentryClient) sentryClient.close(2000).then(() => process.exit(1));
  else process.exit(1); // eslint-disable-line no-process-exit
};

const notFoundErrorHandler = (req, res, next) => {
  next(boom.notFound());
};

const unhandledRejectionHandler = (reason, p) => {
  winston.error({ reason, message: "Unhandled Rejection at Promise", p });
};

const uncaughtExceptionHandler = err => {
  winston.error(err);
  exitProcess();
};

const errorDecorator = (err, req, res, next) => {
  const serverErrorWithStack = err.statusCode >= 500 && err.stack !== undefined;
  const nonBoomNoStatusCode = !err.isBoom && !err.statusCode;
  const originalMessage = err.message || null;

  const options = {
    statusCode: err.statusCode,
    decorate: {
      isDeveloperError: err.isDeveloperError || serverErrorWithStack || nonBoomNoStatusCode,
      originalUrl: req.originalUrl,
      method: req.method,
      ip: req.ip
    },
    data: { stack: err.stack || "n/a" }
  };

  boom.boomify(err, options);

  if (originalMessage) err.output.payload.message = originalMessage;

  next(err);
};

const finalErrorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);
  if (err.isServer || err.isDeveloperError) winston.error(err);

  if (err.isDeveloperError) exitProcess();
  else res.status(err.output.statusCode).json(err.output.payload);
};

module.exports = {
  exitProcess,
  errorDecorator,
  finalErrorHandler,
  notFoundErrorHandler,
  uncaughtExceptionHandler,
  unhandledRejectionHandler
};
