"use strict";

const LOCAL_MEDIA_DIR = './media-storage/';

module.exports.getDirPath = (data) => {
    let path = '';
    switch (data.type) {
        case 'avatar':
            path = 'avatar';
            break;
        case 'property':
            path = 'property/' + data.property_id;
            break;
        default:
            path = '';
            break;
    }

    return LOCAL_MEDIA_DIR + path;
};