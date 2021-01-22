'use strict';
const LinkedInTokenStrategy = require('passport-linkedin-token-v2');

const { linkedInConfig } = require('./../config');

module.exports = (passport) => {
    passport.use('candidate-linkedin', new LinkedInTokenStrategy({
        clientID: linkedInConfig.LINKEDIN_CLIENT_ID,
        clientSecret: linkedInConfig.LINKEDIN_CLIENT_SECRET,
        passReqToCallback: true
    }, (req, access_token, refresh_token, profile, done) => { // LinkedIn will send back the tokens and profile
        console.log('linkedin', 'profile', access_token, refresh_token, profile);
        process.nextTick(() => { return done(null, profile); });
    }));
};