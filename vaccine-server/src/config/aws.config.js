'use strict';

module.exports = {
    ACCESS_KEY: ENV.S3_ACCESS_KEY,
    SECRET_ACCESS_KEY: ENV.S3_SECRET_ACCESS_KEY,
    AWS_REGION: ENV.AWS_REGION,
    S3_BUCKET: ENV.S3_BUCKET,
    EXPIRES: 1 * 24 * 60 * 60, // URL Expires in 1 day * 24 hours * 60 minutes * 60 seconds,
    ACL: {
        PRIVATE: 'private',
        PUBLIC_READ: 'public-read',
    }
};