"use strict";
const nodemailer = require('nodemailer');

const { mailConfig } = require('./../config');

/* 
const common_utils = require('./../utils/common-utils');
const auth = {
     type: 'login',
     user: mailConfig.SENDER_EMAIL_ID,
     pass: common_utils.decrypt(mailConfig.SENDER_EMAIL_PASSWORD)
 }; 
*/

const auth = {
    type: 'oauth2',
    user: mailConfig.SENDER_MAIL_ID,
    serviceClient: mailConfig.SENDER_SERVICE_CLIENT,
    privateKey: mailConfig.SENDER_PRIVATE_KEY
};

const transporter = nodemailer.createTransport({ service: 'gmail', auth });

module.exports.verify = () => {
    return new Promise(async (resolve, reject) => {
        transporter.verify().then(resp => {
            console.log("Email Config Succeeded", resp);
            resolve('success');
        }).catch(err => {
            console.log(err, "Email connection Error...");
            resolve();
        });
    });
};

module.exports.transporter = transporter;
