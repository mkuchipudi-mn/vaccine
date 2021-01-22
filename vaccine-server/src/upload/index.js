"use strict";
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const http_status = require('./../utils/http-status-codes');
// const upload = require('./multer');
const upload = require('./multer-s3');
// const upload = require('./multer-sharp-s3');

const LOCAL_MEDIA_DIR = './media-storage/';

module.exports.single = async (req, res, next) => {
    upload(req.query).single('file')(req, res, async (err) => {
        
        if (err instanceof multer.MulterError) {
            if (err.code == 'LIMIT_UNEXPECTED_FILE') {
                return res.status(http_status.BAD_REQUEST).send({
                    message: '"file" field is expected',
                    code: err.code
                });
            } else if (err.code == 'LIMIT_FILE_SIZE') {
                return res.status(http_status.BAD_REQUEST).send({
                    message: err.message,
                    code: err.code
                });
            }
        } else if (err) {
            if (err.code && err.code === 'MIME_TYPE_NOT_ACCEPTED') {
                return res.status(http_status.BAD_REQUEST).send({ message: err.message });
            } else {
                return res.status(http_status.BAD_GATEWAY).send(err);
            }
        }
        if (!req.file) {
            return res.status(http_status.BAD_REQUEST).send({
                message: 'Please select a file / image to upload'
            });
        }
        next();
    });
};

module.exports.multiple = async (req, res, next) => {

    upload(req.query).array('files', 10)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.log(err);
            if (err.code == 'LIMIT_UNEXPECTED_FILE') {
                return res.status(http_status.BAD_REQUEST).send({
                    message: '"files" field is expected',
                    code: err.code
                });
            } else if (err.code == 'LIMIT_FILE_SIZE') {
                return res.status(http_status.BAD_REQUEST).send({
                    message: err.message,
                    code: err.code
                });
            }
        } else if (err) {
            console.log(err);
            if (err.code && err.code === 'MIME_TYPE_NOT_ACCEPTED') {
                return res.status(http_status.BAD_REQUEST).send({ message: err.message });
            } else {
                return res.status(http_status.BAD_GATEWAY).send(err);
            }
        }
        if (!req.files || (req.files && req.files.length == 0)) {
            return res.status(http_status.BAD_REQUEST).send({
                message: 'Please select atleast one file / image to upload'
            });
        }
        // console.log(req.files);
        next();
    });
};

module.exports.uploadBase64 = async (req, res, next) => {
    if (!req.body.base64image) {
        return res.status(http_status.BAD_REQUEST).send({
            message: 'Base64 Image Code required'
        });
    }

    const matches = req.body.base64image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

    if (!matches || matches && matches.length !== 3) {
        return res.status(http_status.BAD_REQUEST).send({
            message: 'Invalid Base64 Image Code'
        });
    }
    const buffer = Buffer.from(matches[2], 'base64');
    const extenstion = '.png';
    const filename = 'avatar_' + Date.now() + extenstion;
    try {
        fs.writeFileSync(LOCAL_MEDIA_DIR + req.user.user_id + '/' + filename, buffer, 'utf8');
        req.filename = filename;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Internal server error'
        });
    }
};