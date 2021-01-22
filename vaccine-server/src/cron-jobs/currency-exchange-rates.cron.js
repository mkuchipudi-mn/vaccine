"use strict";

const CronJob = require('cron').CronJob;
const request = require('request');

const { CurrencyExchangeRatesModel } = require('./../models');
const { cronTimeConstants: constants } = require('./../constants');
const { fixerIoConfig } = require('./../config');
const common_utils = require('./../utils/common-utils');

const FIXER_IO_URL = fixerIoConfig.FIXER_IO_BASE_URL + '?access_key=' + fixerIoConfig.FIXER_IO_ACCESS_KEY;

// '*/1 * * * *'

const job = new CronJob(constants.CRON_HOURLY, async () => {
    try {
        const ratesObj = await CurrencyExchangeRatesModel.findOne();
        if (ratesObj && fixerIoConfig.FIXER_IO_ACCESS_KEY) {
            const diffInMinutes = common_utils.getTimeDifferenceBtDates(ratesObj.updatedAt, new Date(), 'minutes');
            if (diffInMinutes >= 59) {
                request(FIXER_IO_URL, { json: true }, async (err, res, body) => {
                    if (err) {
                        logger.error(err);
                    } else {
                        await CurrencyExchangeRatesModel.findByIdAndUpdate(ratesObj._id, body, { new: true });
                    }
                });
            }
        }
    } catch (error) {
        logger.error(error);
    }
}, null, true, 'America/Los_Angeles');

module.exports = job;