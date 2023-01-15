'use strict';

const appRoot = require('app-root-path');
const { createLogger, transports, format } = require('winston');

const { combine, prettyPrint } = format;
const config = require('config');

const options = {
    ...(config.app.logging.file && {
        file: {
            level: 'info',
            filename: `${appRoot}/logs/app.log`,
            handleExceptions: true,
            json: true,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            colorize: false,
        },
    }),
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};

const logger = createLogger({
    format: combine(
        format.timestamp({
            format: 'YYYY-MM-DD hh:mm:ss',
        }),
        prettyPrint(),
    ),
    transports: [
        /* istanbul ignore next line */
        ...(config.app.logging.file ? [new transports.File(options.file)] : []),
        new transports.Console(options.console),
    ],
    exitOnError: false, // Do not exit on handled exceptions
});

logger.stream = {
    stdout: {
        write(message, encoding) {
            logger.info(message);
        },
    },
    stderr: {
        write(message, encoding) {
            logger.error(message);
        },
    },
};

module.exports = logger;
