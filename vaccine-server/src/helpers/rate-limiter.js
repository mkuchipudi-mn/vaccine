"use strict";

const rateLimit = require("express-rate-limit");

const http_status = require('./../utils/http-status-codes');

module.exports.apiLimiter = (minutes = 15, maxRequests = 5, message = 'Too many requests created from this IP, please try again later.') => {
    return rateLimit({
        windowMs: minutes * 60 * 1000, // 15 minutes * 60 seconds * 1000 milliseconds
        max: maxRequests,  // start blocking after {{maxRequests}} requests
        handler: (req, res, next) => {
            return res.status(http_status.TOO_MANY_REQUESTS).send({ type: 'too_many_requests', message });
        }
    });
};
