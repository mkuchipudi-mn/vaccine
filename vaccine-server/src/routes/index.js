"use strict";
const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const exec = require('util').promisify(require('child_process').exec);

const { config } = require('./../config');
const { roles } = require('./../constants');


const { AuthGuard, hasRoles, CheckAuthGuard, LogSessionGuard } = require('./../guards');
const http_status = require('../utils/http-status-codes');
const { apiLimiter } = require('./../helpers/rate-limiter');

const swaggerDocument = require('./../json-data/api-doc-swagger.json');
swaggerDocument.host = config.API_HOST;

// router.use(apiLimiter());

const index = async (req, res, next) => {
    let gitRes;

    try { gitRes = await exec('git --no-pager log -1 --format="%ai"'); } catch (error) { }

    const getdate = (date, zone) => `${require('moment').tz(new Date(date), zone).format("YYYY-MM-DD HH:mm:ss")} ${zone === 'Asia/Kolkata' ? 'GMT+0530 (India Standard Time)' : 'GMT-0600 (Central Standard Time (Mexico))'}`;

    return res.send({
        message: "Welcome to Rentastico API Server",
        api_reference_doc: ENV.NODE_ENV !== 'production' ? config.API_URL + 'api-docs/' : undefined,
        api_statistics: ENV.NODE_ENV !== 'production' ? config.API_URL + 'swagger-stats/ux#/' : undefined,
        logs: ENV.NODE_ENV !== 'production' ? config.API_URL + 'logs/' : undefined,
        updated_on: {
            gmt: ENV.updated_on,
            ist: getdate(ENV.updated_on, 'Asia/Kolkata'),
            cdt: getdate(ENV.updated_on, 'America/Mexico_City'),
        },
        code_last_updated_on: gitRes && gitRes.stdout ? {
            gmt: new Date(gitRes.stdout),
            ist: getdate(gitRes.stdout, 'Asia/Kolkata'),
            cdt: getdate(gitRes.stdout, 'America/Mexico_City'),
        } : undefined
    });

};
const notFound = (req, res) => {
    return res.status(http_status.NOT_FOUND).send({
        'status': 'not_found',
        'message': `4😟4, The requested URL '${req.originalUrl}' with '${req.method}' method was not found on this server.`
    });
};

router.get('/', index);

//router.use('', require('./auth.route'));

router.use('/logs', require('./log.route'));

router.use('/api-docs', LogSessionGuard, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

router.use('/user', require('./user.route'));


if (ENV.NODE_ENV === 'development') router.use('/dev', require('./developer.route')); // todo

// router.use('/resize', require('./resize.route'));
router.get('/resize', async (req, res, next) => {

    if (!req.query.key) { return next('key required'); }

    const w = +req.query.w || 0, h = +req.query.h || 0;

    try {
        const buffer = await s3_bucket.getResizedImage(req.query.key, w, h);
        res.body = buffer.toString('base64');
        res.bodyEncoding = 'base64';
        res.setHeader('content-type', 'image/' + 'webp');
        return res.status(http_status.OK).send(buffer);
    } catch (error) {
        console.warn(error.message);
        // const default_path = require('path').join(__dirname, '../../media-storage', '4b763e8c-d347-43d2-b778-5d7a12a36eab.png');
        // return res.status(http_status.OK).sendFile(default_path);
        return require('request')(`https://via.placeholder.com/${w || h || 400}x${h || w || 400}`).pipe(res);
    }
});

router.use('**', notFound);

module.exports.init = () => router;