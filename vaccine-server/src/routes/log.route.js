"use strict";

const router = require('express').Router();
const fs = require('fs');

const { config } = require('./../config');
const http_status = require('../utils/http-status-codes');
const { LogSessionGuard } = require('./../guards');


const logList = (req, res, next) => {

    fs.readdir('./logs', (err, files) => {

        if (err) { return next(err); }

        const warn_logs = [], info_logs = [], error_logs = [];
        files.reverse().forEach((filename, i) => {
            const updated_on = new Date(fs.statSync('./logs/' + filename).ctime);
            const obj = {
                filename,
                size: (fs.statSync('./logs/' + filename).size / 1000).toFixed(1) + ' kb',
                ref: config.API_URL + 'logs/' + filename,
                updated_on
            };
            if (filename.includes('info')) { info_logs.push(obj); } else
                if (filename.includes('warn')) { warn_logs.push(obj); } else
                    if (filename.includes('error')) { error_logs.push(obj); }
        });
        return res.status(http_status.OK).send({ log_list: { error_logs, warn_logs, info_logs }, total: files.length });
    });
};
const logs = (req, res, next) => {

    try {
        const data = fs.readFileSync('./views/logs.html');
        res.writeHead(http_status.OK, {
            'Content-Type': 'text/html',
            'Content-Length': data.length
        }).write(data);
        return res.end();
    } catch (error) {
        return next(error);
    }
};
const getLogFile = (req, res, next) => {
    try {
        const data = fs.readFileSync(`./logs/${req.params.filename}`);
        res.writeHead(http_status.OK, {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }).write(data);
        return res.end();
    } catch (error) {
        return next(error);
    }
};
const getLogAuth = (req, res, next) => {
    try {
        const data = fs.readFileSync('./views/get-auth.html');
        res.writeHead(http_status.OK, {
            'Content-Type': 'text/html',
            'Content-Length': data.length
        }).write(data);
        return res.end();
    } catch (error) {
        return next(error);
    }
};
const postAuth = (req, res, next) => {
    try {
        if (req.body.access_key && req.body.access_key === 'iamdeveloper') {
            const logging_id = Date.now();
            req.session.logging_id = logging_id;
            return res.status(http_status.OK).send({ logging_id });
        } else {
            return res.status(http_status.UNAUTHORIZED).send({ message: 'invalid credentials' });
        }
    } catch (error) {
        return next(error);
    }
};

router.get('/list', logList);
router.get('/get-auth', getLogAuth);
router.post('/auth', postAuth);
router.get('', LogSessionGuard, logs);
router.get('/:filename', LogSessionGuard, getLogFile);

module.exports = router;