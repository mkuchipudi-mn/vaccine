// ! This Controller for Development Purpose only, not for the Production

"use strict";
const Joi = require('joi');

const { PermissionsModel, UsersModel, RolesModel } = require("../models");

const { statusConstants, modelConstants } = require('../constants');
const common_utils = require("../utils/common-utils");
const http_status = require("../utils/http-status-codes");
const currency_utils = require("../utils/currency.utils");


module.exports = {
    getRolesList: async (req, res, next) => {

        const { sort, skip, limit } = req.query;
        const role_type = req.query.role_type || undefined;

        try {
            const filter = {},
                fields = { createdAt: 0, updatedAt: 0 },
                options = { sort, skip, limit };

            if (role_type) filter.code = role_type;

            const total = await RolesModel.countDocuments(filter);
            const roles = await RolesModel.find(filter, fields, options).populate('permissions', { code: 1, name: 1, category: 1, _id: 1 });

            return res.status(http_status.OK).send({ skip, limit, total, roles, role_type });
        } catch (error) {
            return next(error);
        }
    },
    addRole: async (req, res, next) => {

        const schema = Joi.object({
            name: Joi.string().required().min(1).max(50),
            description: Joi.string().required().min(1),
            code: Joi.string().required().min(1),
            permissions: Joi.array().required()
        });

        const { error } = schema.validate(req.body);

        if (error) { return next(error.details[0].message); }

        try {
            const role = await new RolesModel(req.body).save();

            return res.status(http_status.OK).send(role);
        } catch (error) {
            return next(error);
        }
    },
    updateRolePermissions: async (req, res, next) => {

        const schema = Joi.object({
            code: Joi.string().required().min(1),
            permissions: Joi.array().required()
        });

        const { error } = schema.validate(req.body);

        if (error) { return next(error.details[0].message); }

        try {
            const filter = { code: req.body.code };

            for (const permission of req.body.permissions) {

                filter.permissions = { $nin: permission };
                const update = { $push: { permissions: permission } };

                await RolesModel.findOneAndUpdate(filter, update);
            }

            const role = await RolesModel.findOne({ code: req.body.code }, { createdAt: 0, updatedAt: 0 }).populate('permissions', { code: 1, name: 1, category: 1, _id: 1 });

            return res.status(http_status.OK).send(role);

        } catch (error) {
            return next(error);
        }
    },
    getRolePermissions: async (req, res, next) => {

        try {
            const role = await RolesModel.findOne({ code: req.params.role_type }).populate('permissions', { code: 1, name: 1, category: 1, _id: 1 });

            if (role) {
                return res.status(http_status.OK).send(role.permissions);
            } else {
                return res.status(http_status.NO_CONTENT).send();
            }
        } catch (error) {
            return next(error);
        }
    }
};