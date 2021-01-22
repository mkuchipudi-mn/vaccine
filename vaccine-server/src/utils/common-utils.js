"use strict";
const jwt = require('jsonwebtoken');
const CryptoJS = require("crypto-js");
const request = require('request');
const ipLocation = require("iplocation");

const { config, jwtConfig, msg91Config } = require('./../config');
const country_codes = require('../json-data/country-codes.js');
const { UsersModel } = require('./../models');

const cryptoSecret = ENV.CRYPTO_SECRET_KEY;

const getCountryISDCode = (country) => {
    const coutryObj = country_codes.find(ele => ele.code == country);
    return coutryObj && coutryObj.dial_code ? coutryObj.dial_code.slice(1) : '';
};

module.exports.getRandomId = (length, timeFlag) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        const is_dash = ((i + 1) % 8 == 0 && i < length - 1);
        result += is_dash ? '-' : '' + characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result + (timeFlag ? '-' + Date.now().toString().slice(0, 10) : '');
};

module.exports.getRandomNumber = (length) => {
    const s = Math.pow(10, length - 1);
    return Math.floor(s + Math.random() * 9 * s);
};

module.exports.getSignedJwt = (user) => {
    return jwt.sign({
        user_id: user._id,
        roles: user.roles,
        agency_id: user && user.agency ? user.agency._id : undefined,
        co_worker_id: user.co_worker_id || undefined,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.firstName + ' ' + user.lastName,
        sitename: user.origin || config.WEB_URL,
        profilePic: user.profilePic ? user.profilePic.src : null,
        email: user.email
    }, jwtConfig.JWT_SECRET, {
        expiresIn: jwtConfig.JWT_EXPIRES,
        issuer: jwtConfig.JWT_ISSUER,
        jwtid: user.jti,
        subject: user.origin || config.WEB_URL,
        // audience: ''
        // algorithm: 'RS256'
    });
};

module.exports.encrypt = (message) => {
    try {
        return CryptoJS.AES.encrypt(message, cryptoSecret).toString();
    } catch (error) {
        console.error(error, 'crypto Secret key was missed, ask Maintainer');
        return null;
    }
};

module.exports.decrypt = (cipher) => {
    try {
        return CryptoJS.AES.decrypt(cipher, cryptoSecret).toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error(error, 'crypto Secret key was missed, ask Maintainer');
        process.exit();
    }
};

module.exports.encryptObj = (msgObj) => {
    try {
        return CryptoJS.AES.encrypt(JSON.stringify(msgObj), cryptoSecret).toString();
    } catch (error) {
        console.error(error, 'crypto Secret key was missed, ask Maintainer');
        return null;
    }
};

module.exports.decryptObj = (cipher) => {
    try {
        return JSON.parse(CryptoJS.AES.decrypt(cipher, cryptoSecret).toString(CryptoJS.enc.Utf8));
    } catch (error) {
        console.error(error, 'crypto Secret key was missed, ask Maintainer');
        return null;
    }
};

module.exports.sendOtp = (data, callback) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const params = {
        authkey: msg91Config.AUTH_KEY,
        sender: msg91Config.SENDER,
        mobile: parseInt(getCountryISDCode(data.country) + data.mobile),
        message: "Your Rentastico verification code is: " + otp + " (valid for 5 minutes). Don't share this code with anyone;",
        email: data.email || undefined,
        otp_length: 6,
        otp: otp,
        otp_expiry: 5 // OTP Expires 5 ( in minutes )
    };
    const queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

    request(msg91Config.BASE_URL + 'otp?' + queryString, {
        json: true
    }, (err, res, body) => {
        if (err) {
            console.log(err);
            callback(err);
        }
        console.log(body);
        callback(null, body);
    });
};

module.exports.verifyOtp = (data, callback) => {
    const params = {
        authkey: msg91Config.AUTH_KEY,
        sender: msg91Config.SENDER,
        mobile: parseInt(getCountryISDCode(data.country) + data.mobile),
        otp: data.otp
    };

    const queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

    request(msg91Config.BASE_URL + 'otp/verify?' + queryString, {
        json: true
    }, (err, res, body) => {
        if (err) {
            console.log(err);
            callback(err);
        }
        console.log(body);
        callback(null, body);
    });
};

module.exports.resendOtp = (data, callback) => {
    const params = {
        authkey: msg91Config.AUTH_KEY,
        sender: msg91Config.SENDER,
        mobile: parseInt(getCountryISDCode(data.country) + data.mobile),
        email: data.email || undefined,
        retrytype: 'text' // defailt is 'voice'
    };
    const queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

    request(msg91Config.BASE_URL + 'otp/retry?' + queryString, {
        json: true
    }, (err, res, body) => {
        if (err) {
            console.log(err);
            callback(err);
        }
        console.log(body);
        callback(null, body);
    });
};

module.exports.sendSms = (data, callback) => {
    const params = {
        authkey: msg91Config.AUTH_KEY,
        sender: msg91Config.SENDER,
        route: 4, // 1 => Promotional, 4 => Transactional
        country: getCountryISDCode(data.country),
        to: [data.mobile],
        sms: [{
            "message": data.message,
            "to": [data.mobile]
        }]
    };
    const queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

    request.post(msg91Config.BASE_URL + 'sendsms?' + queryString, {
        json: params
    }, (err, res, body) => {
        if (err) {
            console.log(err);
            callback(err);
        }
        console.log(body);
        callback(null, body);
    });
};

module.exports.getFormattedFileObj = (file) => {
    const original = 'original.webp',
        x_large = 'x_large.webp',
        large = 'large.webp',
        medium = 'medium.webp',
        small = 'small.webp',
        x_small = 'x_small.webp';
    const obj = {
        filename: file.filename,
        media_id: file.media_id || undefined,
        src: file.location || file.Location || file.path, // todo: remove
    };
    if (file.mimetype.includes('video')) {
        obj.file_type = 'video';
    } else if (file.mimetype.includes('image')) {
        obj.file_type = 'image';
    } else if (file.mimetype.includes('pdf')) {
        obj.file_type = 'pdf';
    }
    if (file.key) obj.key = file.key;
    if (file[original]) {
        obj.src = file[original].Location;
        obj.key = file[original].key;
    }
    if (file[x_large]) obj.x_large = {
        src: file[x_large].Location,
        key: file[x_large].key
    };
    if (file[large]) obj.large = {
        src: file[large].Location,
        key: file[large].key
    };
    if (file[medium]) obj.medium = {
        src: file[medium].Location,
        key: file[medium].key
    };
    if (file[small]) obj.small = {
        src: file[small].Location,
        key: file[small].key
    };
    if (file[x_small]) obj.x_small = {
        src: file[x_small].Location,
        key: file[x_small].key
    };
    return obj;
};

module.exports.getGeoLocation = async (ip) => {
    if (!ip) return null;
    try {
        const geo = await ipLocation(ip);
        return {
            ip,
            latitude: geo.latitude,
            longitude: geo.longitude,
            city: geo.city,
            region: geo.region && geo.region.name || null,
            country: geo.country && geo.country.name || null,
            timezone: geo.country && geo.country.timezone || null
        };
    } catch (error) {
        // console.log(error.message);
        return {
            ip
        };
    }
};

module.exports.getDate = (date) => {
    date = new Date(date);
    return new Date(date.valueOf() - date.valueOf() % (1000 * 60 * 60 * 24));
};

module.exports.getTimeDifferenceBtDates = (from, to, type) => {
    const diffInMs = new Date(to).getTime() - new Date(from).getTime();
    const ms = 1000;
    let diff;
    switch (type) {
        case 'minutes':
            diff = diffInMs / (60 * ms);
            break;
        case 'hours':
            diff = diffInMs / (60 * 60 * ms);
            break;
        case 'days':
            diff = diffInMs / (24 * 60 * 60 * ms);
            break;
    }
    return +diff.toFixed(2);
};

module.exports.getLocaleDate = (format = 'GMT', date = new Date()) => {
    console.log(format, date);
    // return new Date(date).toLocaleString("en-US", {
    //     timeZone: "Asia/Kolkata"
    // });
};

module.exports.generateUserName = async (fname, lname) => {
    let isExists = true;
    const uname = (fname + (lname || '')).replace(/\s+/g, '').replace(/\'+/g, '').replace(/-+/g, '').toLowerCase();
    while (isExists) {
        const username = uname + this.getRandomNumber(3);
        isExists = await UsersModel.exists({ username });
        if (!isExists) { return username; }
    }
};

const ipRegExp = /^(?:(?:^|\.)(?:2(?:5[0-5]|[0-4]\d)|1?\d?\d)){4}$/;

module.exports.getUserLocation = async (req) => {

    const ip = req.header('R-Client-IP') || req.header('X-Cluster-Client-IP') || req.header('X-Client-IP') || req.header('X-Forwarded-For') ||
        req.header('X-Real-IP') || req.header('Forwarded-For') || req.connection.remoteAddress || req.ip;

    const path = ipRegExp.test(ip) ? ip : '';
    return new Promise(async (resolve, reject) => {
        request({
            url: 'https://geolocation-db.com/json/' + path,
            json: true
        }, (err, res, body) => {
            if (err) { reject(err); } else { resolve(body); }
        });
    });
};

module.exports.readableBytes = (bytes = 1) => {
    const i = Math.floor(Math.log(bytes) / Math.log(1024)), sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    return (bytes / Math.pow(1024, i || 1)).toFixed(3) * 1 + ' ' + sizes[i || 1];
};