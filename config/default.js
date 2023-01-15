"use strict";

require("dotenv").config();

module.exports = {
    app: {
        port: 5000,
        logging: {
            file: true
        }
    },
    db: {
        mongoose: {
            url: process.env.MONGO_DB,
            auto_reconnect: true
        },
        mysql: {
            host: process.env.MYSQL_HOST,
            database: process.env.MYSQL_DATABASE,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD
        }
    },
    mailjet: {
        api_key: process.env.MAILJET_API_KEY,
        secret: process.env.MAILJET_API_SECRET
    },
    sentry: {
        dsn: process.env.SENTRY_DSN
    },
    mock: {
        crashAppRoutes: false
    }
};
