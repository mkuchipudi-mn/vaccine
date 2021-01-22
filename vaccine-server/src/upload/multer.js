"use strict";
const multer = require('multer');
const fs = require('fs');
const mkdirp = require('mkdirp');
const uuid = require('uuid');

const dir_path = require('./dir-path');

module.exports = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const dir = dir_path.getDirPath({
                user_id: req.user.user_id,
                property_id: req.query.property_id,
                type: req.query.upload_type
            });
            fs.exists(dir, exist => {
                if (!exist) {
                    return mkdirp(dir).then(made => cb(null, dir));
                }
                return cb(null, dir);
            });
        },
        filename: (req, file, cb) => {
            let suffix = '';
            if (file.mimetype.includes('image')) {
                suffix = '.png';
            } else if (file.mimetype.includes('video')) {
                suffix = '.mp4';
            } else if (file.mimetype.includes('pdf')) {
                suffix = '.pdf';
            }
            const filename = (req.query.upload_type == 'avatar' ? req.user.user_id : uuid.v4()) + suffix;
            cb(null, filename);
        }
    }),
    limits: {
        // fieldNameSize: 100,
        fileSize: 2e+7 // Max 20mb
    }
});