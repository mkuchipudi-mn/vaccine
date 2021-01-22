"use strict";
const { createLogger, transports, format } = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');

const LOGGING_DIR = 'logs/';

if (!fs.existsSync(LOGGING_DIR)) { fs.mkdirSync(LOGGING_DIR); }

const loggerOptions = (level) => {
    return {
        format: format.printf(data => {
            const timestamp = (new Date()).toISOString().replace(/T/, ' ').replace(/Z/, '');
            return `${timestamp} [${data.level.toUpperCase()}]: ${JSON.stringify(data)}`;
        }),
        level,
        transports: [
            new transports.Console({ name: 'console', colorize: true }),
            new transports.DailyRotateFile({
                name: `${level}-file`,
                filename: `${LOGGING_DIR}%DATE%-${level}.log`,
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '30d'
            })
        ]
    };
};

module.exports.info = (info) => createLogger(loggerOptions('info')).info(info);

module.exports.warn = (warn) => createLogger(loggerOptions('warn')).warn(warn);

module.exports.error = (err) => createLogger(loggerOptions('error')).error(err);
