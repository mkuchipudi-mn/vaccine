"use strict";
const AWS = require('aws-sdk');
const rangeStream = require("range-stream");

const { awsConfig } = require('./../config');
const Sharp = require('sharp');

AWS.config.update({
    accessKeyId: awsConfig.ACCESS_KEY,
    secretAccessKey: awsConfig.SECRET_ACCESS_KEY,
    region: awsConfig.AWS_REGION
});

const s3 = new AWS.S3();

const S3_BUCKET = awsConfig.S3_BUCKET;

module.exports = {
    getSignedS3Url: (key) => {
        return new Promise((resolve, reject) => {
            s3.getSignedUrl('getObject', {
                Bucket: S3_BUCKET,
                Key: key,
                Expires: awsConfig.EXPIRES
            }, (err, url) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(url);
                }
            });
        });
    },
    getObject: (key) => {
        return new Promise((resolve, reject) => {
            s3.getObject({
                Bucket: S3_BUCKET,
                Key: key
            }, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    },
    uploadFileToS3: (input) => {
        if (input.body.includes('data:image')) {
            input.body = input.body.replace(/^data:image\/\w+;base64,/, "");
        }
        let body, ContentType, key;
        if (input.type === 'image') {
            body = new Buffer(input.body, 'base64');
            ContentType = "image/webp";
        } else if (input.type === 'video') {
            body = new Buffer(input.body, 'base64');
            ContentType = "video/mp4";
        } else {
            body = input.body;
        }
        key = input.dir + input.filename;
        return new Promise((resolve, reject) => {
            s3.putObject({
                Bucket: S3_BUCKET,
                Key: key,
                Body: body,
                ACL: 'public-read',
                ContentType,
                // ContentEncoding: "base64"
            }, (err, data) => {
                if (err) reject(err); else
                    resolve({
                        // etag: data.ETag, 
                        key, filename: input.filename,
                        mimetype: ContentType,
                        src: `https://${S3_BUCKET}.s3.${awsConfig.AWS_REGION}.amazonaws.com/` + key
                    });
            });
        });

    },
    copyS3Object: (sourcePath, newPath, callback) => {
        s3.copyObject({
            Bucket: S3_BUCKET,
            ACL: 'public-read',
            CopySource: S3_BUCKET + '/' + sourcePath,
            Key: newPath
        }, (copyErr, copyData) => {
            callback(copyErr, copyData);
        });
    },
    deleteS3Object: (key) => {
        return new Promise((resolve, reject) => {
            s3.deleteObject({
                Bucket: S3_BUCKET,
                Key: key
            }, (err, data) => {
                if (err) { reject(err); } else resolve(key);
            });
        });
    },
    deleteS3Folder: (folderPath, callback) => {
        s3.listObjects({
            Bucket: S3_BUCKET,
            Prefix: folderPath + '/'
        }, (err, data) => {
            if (err) return callback(err);
            if (data.Contents.length == 0) callback(err, []);
            const params = {
                Bucket: S3_BUCKET,
                Delete: {
                    Objects: []
                }
            };
            data.Contents.forEach((content) => {
                params.Delete.Objects.push({
                    Key: content.Key
                });
            });
            s3.deleteObjects(params, (err, data) => {
                callback(err, data);
            });
        });
    },
    deleteS3File: (file) => {
        const deleteObj = (key) => {
            s3.deleteObject({
                Bucket: S3_BUCKET,
                Key: key
            }, (err, data) => {
                if (err) console.log(err);
            });
        };
        return new Promise((resolve, reject) => {
            if (file.key) deleteObj(file.key);
            if (file.x_large) deleteObj(file.x_large.key);
            if (file.large) deleteObj(file.large.key);
            if (file.medium) deleteObj(file.medium.key);
            if (file.small) deleteObj(file.small.key);
            if (file.x_small) deleteObj(file.x_small.key);
            resolve('success');
        });
    },
    sizeOf: async (key) => {
        return s3.headObject({ Key: key, Bucket: S3_BUCKET }).promise().then(res => res.ContentLength);
    },
    getObjectStream: (key, se) => {
        if (!se) return s3.getObject({ Bucket: S3_BUCKET, Key: key }).createReadStream();
        else return s3.getObject({ Bucket: S3_BUCKET, Key: key }).createReadStream().pipe(rangeStream(se.start, se.end));
    },
    getResizedImage: (key, width = 100, height = 100) => {

        return new Promise((resolve, reject) => {
            s3.getObject({ Bucket: S3_BUCKET, Key: key })
                .promise().then(data =>
                    Sharp(data.Body).resize(width || undefined, height || undefined).toFormat('webp').toBuffer()
                ).then(buffer =>
                    resolve(buffer)
                ).catch(error =>
                    reject(error)
                );
        });
    }
};