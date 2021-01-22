//var FacebookStrategy = require('passport-facebook').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');

const { fbConfig } = require('./../config');

module.exports = (passport) => {
    passport.use('facebook-token', new FacebookTokenStrategy({
        clientID: fbConfig.APP_ID,
        clientSecret: fbConfig.APP_SECRET,
        passReqToCallback: true
    }, (req, access_token, refresh_token, profile, done) => { // facebook will send back the tokens and profile
        // console.log('facebook-token', 'profile', access_token, refresh_token, profile);
        process.nextTick(() => { done(null, profile); });
    }));
    passport.use('facebook-token-mobile', new FacebookTokenStrategy({
        clientID: fbConfig.APP_ID,
        clientSecret: fbConfig.APP_SECRET,
        passReqToCallback: true
    }, (req, access_token, refresh_token, profile, done) => { // facebook will send back the tokens and profile
        // console.log('facebook-token-mobile', 'profile', access_token, refresh_token, profile);
        process.nextTick(() => { return done(null, profile); });
    }));
};