"use strict";
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const s3Storage = require('multer-sharp-s3');

// const s3Storage = require('../plugins/multer-sharp-s3/main').default;
const { awsConfig } = require('./../config');

AWS.config.update({
    accessKeyId: awsConfig.ACCESS_KEY,
    secretAccessKey: awsConfig.SECRET_ACCESS_KEY,
    region: awsConfig.AWS_REGION
});

const s3 = new AWS.S3();
const maxSize = 10 * 1000 * 1000;
const maxFiles = 10;
const resize = [{
    suffix: 'x_large.webp',
    width: 1200,
    // height: 1200
},
{
    suffix: 'large.webp',
    width: 800,
    // height: 800
},
{
    suffix: 'medium.webp',
    width: 500,
    // height: 500
},
{
    suffix: 'small.webp',
    width: 300,
    // height: 300
},
{
    suffix: 'x_small.webp',
    width: 100
},
{
    suffix: 'original.webp'
}
];
module.exports = (data) => {
    if (data.upload_type == 'avatar') {
        resize.forEach(size => { if (size.width) size.height = size.width; });
    }
    return multer({
        storage: s3Storage({
            s3: s3,
            Bucket: awsConfig.S3_BUCKET,
            acl: awsConfig.ACL.PUBLIC_READ,
            limits: {
                fileSize: maxSize,
                files: maxFiles
            },
            contentType: multerS3.AUTO_CONTENT_TYPE,
            Key: (req, file, cb) => {
                const { filename, dir } = upload_utils.getDirAndFilename(file, req.query, req.user);

                if (!filename || !dir) { cb(new Error('key not found'), null); }

                file.filename = filename;
                cb(null, dir);
            },
            multiple: true,
            resize,
            toFormat: 'webp'
        }),
        fileFilter: upload_utils.fileFilter
    });
};