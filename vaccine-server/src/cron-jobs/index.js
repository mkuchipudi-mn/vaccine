"use strict";

const currencyCronJob = require('./currency-exchange-rates.cron');
const unindexPromotionsCronJob = require('./unindex-expired-prmotions.cron');

module.exports.init = () => {
    currencyCronJob.start();
    unindexPromotionsCronJob.start();
};
