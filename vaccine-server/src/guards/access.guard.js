"use strict";

const { PropertiesModel } = require('./../models');

const http_status = require('./../utils/http-status-codes');

const noAccessMesssage = {
    statusCode: http_status.FORBIDDEN,
    type: 'access_denied',
    message: '🚫!, No permission to access this resource'
};

module.exports = (accessId = 0) => {

    return async (req, res, next) => {

        switch (accessId) {
            case 1: // ? it checks Property Owner of Property
                const property_id = req.body.property_id || req.params.property_id;

                if (!property_id) { return next('property id required'); }

                if (!ObjectId.isValid(property_id)) { return next("Property id is not a valid format"); }
                try {
                    const prop = await PropertiesModel.findById(property_id);
                    if (prop) {
                        if (prop.property_user_id == req.user.user_id) {
                            next();
                        } else {
                            return next(noAccessMesssage);
                        }
                    } else {
                        return res.status(http_status.NO_CONTENT).send();
                    }
                } catch (error) {
                    next(error);
                }

            case 2:

                break;
            case 3:

                break;
            case 5:

                break;

            default:
                next('permission not allowed / not exists...');
                break;
        }
    };
};