"use strict";

const { uploadTypes, baseDir } = require('./../constants');

module.exports.getDirAndFilename = (file, data, user) => {
    let filename, dir, suffix;
    if (file.mimetype.includes('image')) {
        suffix = '.webp';
    } else if (file.mimetype.includes('video')) {
        suffix = '.mp4';
    } else if (file.mimetype.includes('pdf')) {
        suffix = '.pdf';
    } else {
        suffix = file.originalname.slice(file.originalname.lastIndexOf("."));
    }
    switch (data.upload_type) {
        case uploadTypes.AVATAR:
            filename = user.user_id + suffix;
            dir = baseDir.AVATAR_DIR + filename;
            break;
        case uploadTypes.COVER_PIC:
            filename = user.user_id + suffix;
            dir = baseDir.COVER_PIC_DIR + filename;
            break;
        case uploadTypes.USER_INTRO_VIDEO:
            filename = user.user_id + suffix;
            dir = baseDir.USER_INTRO_VIDEO_DIR + filename;
            break;
        case uploadTypes.PROPERTY:
            file.media_id = new ObjectId();
            filename = file.media_id + suffix;
            dir = baseDir.PROPERTY_DIR + data.property_id + '/' + filename;
            break;
        case uploadTypes.USER_IDENTITY:
            filename = user.user_id + suffix;
            dir = baseDir.USER_IDENTITY_DIR + filename;
            break;
        case uploadTypes.PROPERTY_AGENCY_LICENSE:
            filename = 'business-license' + suffix;
            dir = baseDir.PROPERTY_MANAGER_DOCS_DIR + user.user_id + '/' + filename;
            break;
        case uploadTypes.PROPERTY_AGENCY_TAX:
            filename = 'business-tax' + suffix;
            dir = baseDir.PROPERTY_MANAGER_DOCS_DIR + user.user_id + '/' + filename;
            break;
        case uploadTypes.TRAVEL_AGENCY_LICENSE:
            filename = 'business-license' + suffix;
            dir = baseDir.TRAVEL_AGENCY_DOCS_DIR + user.user_id + '/' + filename;
            break;
        case uploadTypes.TRAVEL_AGENCY_TAX:
            filename = 'business-tax' + suffix;
            dir = baseDir.TRAVEL_AGENCY_DOCS_DIR + user.user_id + '/' + filename;
            break;
        case uploadTypes.TRAVEL_TUBE_FEED:
            file.media_id = new ObjectId();
            filename = file.media_id + suffix;
            dir = baseDir.TRAVEL_TUBE_FEED_MEDIA_DIR + user.user_id + '/' + data.feed_id + '/' + filename;
            break;
        case uploadTypes.EVENT_MEDIA:
            file.media_id = new ObjectId();
            filename = file.media_id + suffix;
            dir = baseDir.EVENT_DIR + user.user_id + '/' + data.event_id + '/' + filename;
            break;
        case uploadTypes.EVENT_ORGANIZER_LOGO:
            file.media_id = new ObjectId();
            filename = 'organizer-logo' + suffix;
            dir = baseDir.EVENT_ORGANIZER_LOGO_DIR + user.user_id + '/' + data.event_id + '/' + filename;
            break;

        case uploadTypes.USER_REVIEW_MEDIA:
            file.media_id = new ObjectId();
            filename = file.media_id + suffix;
            dir = baseDir.REVIEW_MEDIA_DIR + data.review_id + '/' + filename;
            break;
        case uploadTypes.LARGE_POCKET_BUSINESS:
            file.media_id = new ObjectId();
            filename = file.media_id + suffix;
            dir = baseDir.LARGE_POCKET_BUSINESS_DIR + user.user_id + '/' + filename;
            break;
        default:
            dir = filename = null;
            break;
    }

    return { dir, filename };
};

const image_types = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
const video_types = ['video/mp4', 'video/mkv', 'video/3gpp', 'video/mpeg'];
const pdf_types = ['application/pdf'];

module.exports.fileFilter = (req, file, cb) => {

    const data = req.body && req.body.data ? JSON.parse(req.body.data) : req.query;
    let accepted_mime_types = [];

    switch (data.upload_type) {
        case uploadTypes.AVATAR:
            accepted_mime_types = [...image_types];
            break;
        case uploadTypes.COVER_PIC:
            accepted_mime_types = [...image_types];
            break;
        case uploadTypes.PROPERTY:
            accepted_mime_types = [...image_types, ...video_types];
            break;
        case uploadTypes.USER_IDENTITY:
            accepted_mime_types = [...image_types, ...pdf_types];
            break;
        case uploadTypes.PROPERTY_AGENCY_LICENSE:
            accepted_mime_types = [...image_types, ...pdf_types];
            break;
        case uploadTypes.PROPERTY_AGENCY_TAX:
            accepted_mime_types = [...image_types, ...pdf_types];
            break;
        case uploadTypes.TRAVEL_AGENCY_LICENSE:
            accepted_mime_types = [...image_types, ...pdf_types];
            break;
        case uploadTypes.TRAVEL_AGENCY_TAX:
            accepted_mime_types = [...image_types, ...pdf_types];
            break;
        case uploadTypes.TRAVEL_TUBE_FEED:
            accepted_mime_types = [...image_types, ...video_types];
            break;
        case uploadTypes.EVENT_MEDIA:
            accepted_mime_types = [...image_types, ...video_types];
            break;
        case uploadTypes.EVENT_ORGANIZER_LOGO:
            accepted_mime_types = [...image_types];
            break;
        case uploadTypes.LARGE_POCKET_BUSINESS:
            accepted_mime_types = [...image_types, ...video_types];
            break;
        default:
            accepted_mime_types = [];
            break;
    }

    const is_mime_accepted = accepted_mime_types.includes(file.mimetype);

    if (is_mime_accepted) {
        cb(null, true);
    } else {
        const error = new Error('doc type not acccepted');
        error.code = 'MIME_TYPE_NOT_ACCEPTED';
        cb(error, false);
    }
};