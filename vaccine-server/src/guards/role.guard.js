"use strict";
const { Promise } = require('mongoose');
const http_status = require('../utils/http-status-codes');

const { AdminModel, PropertiesModel, PropertyManagersModel, TravelAgencyModel, TraveltubeUsersModel, UsersModel } = require('./../models');

const getRoleExists = (user, role) => {
    return new Promise(async (resolve, reject) => {
        let roleObj = null, hasRole = false;
        switch (role) {
            case 'SUPER_ADMIN':
                roleObj = await AdminModel.findOne({ user_id: user.user_id, type: role });
                hasRole = roleObj && roleObj.is_active;
                break;

            case 'ADMIN':
                roleObj = await AdminModel.findOne({ user_id: user.user_id, type: role });
                hasRole = roleObj && roleObj.is_active;
                break;

            case 'USER':
                roleObj = await UsersModel.findOne({ _id: user.user_id });
                hasRole = !!roleObj;
                break;

            case 'PROPERTY_OWNER':
                hasRole = !!await PropertiesModel.countDocuments({ property_user_id: user.user_id });
                break;

            case 'PROPERTY_MANAGER':

                roleObj = await PropertyManagersModel.findOne({ user: user.user_id, type: role });
                hasRole = roleObj && roleObj.is_active && roleObj.approval && roleObj.approval.status === 'APPROVED';
                break;

            case 'PROPERTY_AGENCY':

                roleObj = await PropertyManagersModel.findOne({ user: user.user_id, type: role });
                hasRole = roleObj && roleObj.is_active && roleObj.approval && roleObj.approval.status === 'APPROVED';
                break;

            case 'PROPERTY_AGENCY_COWORKER':

                break;

            case 'TRAVEL_AGENCY':
                roleObj = await TravelAgencyModel.findOne({ travel_agency: user.user_id });
                hasRole = roleObj && roleObj.is_active && roleObj.approval && roleObj.approval.status === 'APPROVED';
                break;

            case 'TRAVEL_AGENCY_COWORKER':

                break;

            case 'TRAVELTUBE_USER':
                roleObj = await TraveltubeUsersModel.findOne({ user: user.user_id });
                hasRole = roleObj && roleObj.is_active;
                break;

            case 'LARGE_POCKET_USER':

                break;
        }
        resolve({ roleObj, hasRole });
    });
};
module.exports = (...roles) => {

    return async (req, res, next) => {

        if (req.user) {

            const rolesNew = await Promise.all(roles.map(async r => await getRoleExists(req.user, r)));
            
            const exist = rolesNew.find(r => r.hasRole);

            // todo check suspend for all type of roles
            if (exist && exist.hasRole) {
                next();
            } else {
                return res.status(http_status.FORBIDDEN).send({
                    type: 'access_denied', message: "Role Doesn't have permission for this resource"
                });
            }
        } else {
            return res.status(http_status.UNAUTHORIZED).send({
                type: 'un_authorized', message: 'Invalid Token'
            });
        }
    };
};