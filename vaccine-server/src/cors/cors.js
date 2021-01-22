"use strict";
const { whiteListedDomains: whiteList, blockedDomains: blockList } = require('./domains');

module.exports = (req, cb) => {
    const origin = req.header('Origin');
    // TODO: add a seperate header to mobile app to skip cors for Mobile apps 
    if (whiteList.includes(origin) && !blockList.includes(origin)) {
        cb(null, true);
    } else {
        cb('😞 no CORS, no party!');
    }
};