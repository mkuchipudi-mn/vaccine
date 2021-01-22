"use strict";

module.exports = (req, res, next) => {

    req.query.skip = +req.query.skip || 0;
    req.query.limit = +req.query.limit || 20;
    req.query.order = req.query.order && req.query.order == 'asc' ? 1 : -1;
    req.query.sort = req.query.sort ? { [req.query.sort]: req.query.order } : { createdAt: req.query.order };
    req.query.search_string = req.query.search_string || undefined;
    req.query.type = req.query.type || undefined;

    next();
};