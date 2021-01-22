"use strict";
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

const { awsConfig } = require('./../config');
const upload_utils = require('./upload-utils');
AWS.config.update({
    accessKeyId: awsConfig.ACCESS_KEY,
    secretAccessKey: awsConfig.SECRET_ACCESS_KEY,
    region: awsConfig.AWS_REGION
});

const s3 = new AWS.S3();
const maxSize = 50 * 1000 * 1000; // ? max file size is 20 MB
const maxFiles = 10;

module.exports = (data) => {
    return multer({
        storage: multerS3({
            s3,
            bucket: awsConfig.S3_BUCKET,
            acl: awsConfig.ACL.PUBLIC_READ,
            limits: {
                fileSize: maxSize,
                files: maxFiles
            },
            contentType: multerS3.AUTO_CONTENT_TYPE,
            metadata: (req, file, cb) => {
                cb(null, { fieldName: file.fieldname });
            },
            key: (req, file, cb) => {
                const data = req.body && req.body.data ? JSON.parse(req.body.data) : req.query;

                if (!data || (data && !data.upload_type)) { cb(new Error('data object is required'), null); }
              
                console.log(data);

                const { filename, dir } = upload_utils.getDirAndFilename(file, data, req.user);

                if (!filename || !dir) { cb(new Error('key not found'), null); }

                file.filename = filename;
                cb(null, dir);
            }
        }),
        fileFilter: upload_utils.fileFilter
    });
};