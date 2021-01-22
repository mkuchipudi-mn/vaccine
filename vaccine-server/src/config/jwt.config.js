'use strict';

module.exports = {
    JWT_SECRET: ENV.JWT_SECRET,
    JWT_ISSUER: ENV.JWT_ISSUER,
    JWT_EXPIRES: ENV.JWT_EXPIRES && ENV.JWT_EXPIRES.split("*").reduce((a, b) => a * b) || 7 * 24 * 60 * 60 // token expires in 7 day(s) / (days * hours * minutes * seconds) seconds
};