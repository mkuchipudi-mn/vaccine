"use strict";
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

const maxAge = 3 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
// const maxAge = 10 * 60 * 1000; // minutes * seconds * milliseconds

module.exports = session({
    secret: ENV.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 3 * 24 * 60 * 60, // The maximum lifetime (in seconds)
        collection: 'Sessions', // Default collection is sessions
        // autoRemoveInterval: 10 // Interval (in minutes) used when autoRemove option is set to interval.
    }),
    cookie: {
        secure: ENV.NODE_ENV === 'production',
        maxAge,
        expires: new Date(Date.now() + maxAge)
    }
});