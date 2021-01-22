const facebook = require('./facebook');
const google = require('./google');
const linkedin = require('./linkedin');

const { googleConfig, fbConfig, linkedInConfig } = require('./../config');

module.exports = (passport) => {
    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((id, done) => {
        const o_id = new ObjectId(id);
        console.log(o_id);
    });
    
    // Setting up Passport Strategies for Google, Facebook and LinkedIn
    if (googleConfig.APP_ID) google(passport);
    if (fbConfig.APP_ID) facebook(passport);
    if (linkedInConfig.LINKEDIN_CLIENT_ID) linkedin(passport);
};