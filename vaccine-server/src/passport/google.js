'use strict';
const GooglePlusTokenStrategy = require('passport-google-plus-token');

const { googleConfig } = require('./../config');

module.exports = (passport) => {
    passport.use('google', new GooglePlusTokenStrategy({
        clientID: googleConfig.APP_ID,
        clientSecret: googleConfig.APP_SECRET,
        passReqToCallback: true
    }, (req, access_token, refresh_token, profile, done) => { // google will send back the tokens and profile
        process.nextTick(() => { return done(null, profile); });
    }));
};