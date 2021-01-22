"use strict";
const jwt = require('jsonwebtoken');

const { LogInLogoutModel } = require('./../models');
const { jwtConfig } = require('../config');

module.exports = async (req, res, next) => {
    if (req.header('Authorization') && req.header('Authorization').startsWith('Bearer ')) {
        const token = req.header('Authorization').split(' ')[1];
        try {
            const payload = jwt.verify(token, jwtConfig.JWT_SECRET, {
                issuer: jwtConfig.JWT_ISSUER,
                subject: req.header('Origin')
            });
            const obj = await LogInLogoutModel.findOneAndUpdate({
                jti: payload.jti
            }, {
                lastActiveOn: new Date(),
            });
            if (obj) { req.user = payload; }
            next();
        } catch (error) {
            next();
        };
    } else next();
};