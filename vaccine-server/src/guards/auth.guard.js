"use strict";
const jwt = require('jsonwebtoken');

const { LogInLogoutModel, CoWorkersLoginLogoutModel } = require('./../models');

const { jwtConfig } = require('../config');
const { roles } = require('./../constants');
const http_status = require('../utils/http-status-codes');

module.exports = async (req, res, next) => {
    if (!req.header('Authorization')) {
        return res.status(http_status.UNAUTHORIZED).send({
            "type": "un_authorized",
            "message": 'Please make sure your request has an Authorization header'
        });
    }
    if (!req.header('Authorization').startsWith('Bearer ')) {
        return res.status(http_status.UNAUTHORIZED).send({
            "type": "un_authorized",
            "message": 'Invalid authentication scheme.'
        });
    }
    const token = req.header('Authorization').split(' ')[1];
    try {
        const payload = jwt.verify(token, jwtConfig.JWT_SECRET, {
            issuer: jwtConfig.JWT_ISSUER,
            // subject: req.header('Origin')
        });
        let obj;
        if (payload.roles.includes(roles.PROPERTY_MANAGER_COWORKER) || payload.roles.includes(roles.PROPERTY_AGENCY_COWORKER)) {
            obj = await CoWorkersLoginLogoutModel.findOneAndUpdate({
                co_worker_id: payload.co_worker_id,
                jti: payload.jti
            }, {
                lastActiveOn: new Date()
            });
        } else {
            obj = await LogInLogoutModel.findOneAndUpdate({ user_id: payload.user_id, jti: payload.jti }, { lastActiveOn: new Date() });
        }
        if (!obj) return res.status(http_status.UNAUTHORIZED).send({
            "type": "un_authorized",
            "message": "Invalid Token"
        });
        req.user = payload;
        next();
    } catch (error) {
        console.log(error);
        console.error(error.name + ': ', error.message);
        return res.status(http_status.UNAUTHORIZED).send({
            "type": "un_authorized",
            "message": "Invalid Token"
        });
    };
};