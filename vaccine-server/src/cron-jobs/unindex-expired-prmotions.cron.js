"use strict";

const CronJob = require('cron').CronJob;

const { PropertiesModel, PropertyPromotionsModel } = require('./../models');
const { cronTimeConstants: constants } = require('./../constants');

// '*/1 * * * *'

const job = new CronJob(constants.CRON_EVERY_DAY_MID_NIGHT, async () => {

    try {
        const props = await PropertiesModel.find({ 'property_promotions.0': { $exists: true } },
            { _id: 1, property_promotions: 1 }).populate('property_promotions');

        props.forEach(prop => {
            prop.property_promotions.forEach(async promo => {
                // promo.type === 'long_term'
                const bool = (promo.from <= new Date() && promo.type !== 'long_term') || (promo.to <= new Date() && promo.type === 'long_term');

                if (bool) {
                    await PropertiesModel.findOneAndUpdate({ _id: prop._id },
                        { $pull: { property_promotions: promo._id } }, { new: true }
                    ).populate('property_promotions');
                }
            });
        });

    } catch (error) {
        logger.error(error);
    }
}, null, true, 'America/Los_Angeles');

module.exports = job;