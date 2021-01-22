"use strict";

module.exports = (req, res, next) => {
    if (req.session && req.session.logging_id) {
        next();
    } else {
        return res.redirect(`/logs/get-auth?redirect_to=${req.originalUrl}`);
    }
};