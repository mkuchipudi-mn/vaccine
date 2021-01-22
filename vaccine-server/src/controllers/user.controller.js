"use strict";
const bcrypt = require('bcryptjs');
const Joi = require('joi');

const { UsersModel, WorkDetailsModel, EducationDetailsModel, LogInLogoutModel, NotificationsModel,
    ConversationsModel, MessagesModel, PropertyManagersModel, PropertiesModel, PropertyFavouritesModel, PropertyLikesModel } = require('./../models');
const { roles, modelConstants } = require('./../constants');
const http_status = require('./../utils/http-status-codes');
const common_utils = require('./../utils/common-utils');

module.exports = {
    getUserById: async (req, res, next) => {
        if (!req.params.id && !req.user) {
            return res.status(http_status.BAD_REQUEST).send({
                message: 'User id required'
            });
        }
        try {
            let resObj;
            let user = await UsersModel.findById(req.params.id || req.user.user_id);

            if (user) {
                user = JSON.parse(JSON.stringify(user));
                user.is_password_not_set = !user.password || undefined;
                user.properties_count = await PropertiesModel.countDocuments({
                    property_user_id: req.user.user_id
                });
                delete user.password;
                if (user.roles.includes(roles.PROPERTY_MANAGER) || user.roles.includes(roles.PROPERTY_AGENCY)) {
                    user.agency = await PropertyManagersModel.findById(user._id);
                }
                user.rating_count = 0;
                user.rating = 0;
                if (user.profilePic && user.profilePic.key) user.profilePic.src = await s3_bucket.getSignedS3Url(user.profilePic.key);
                user.lastLogin = await LogInLogoutModel.findOne({ user_id: user._id }, { ipAddress: 1, loggedInAt: 1, loginType: 1 }, { sort: { createdAt: -1 } });

                return res.status(http_status.OK).send(user);
            } else return res.status(http_status.NO_CONTENT).send();
        } catch (error) {
            return next(error);
        }
    },
    updateUserBasicDetails: async (req, res, next) => {
        const schema = Joi.object({
            firstName: Joi.string().required().min(3).max(20),
            lastName: Joi.string().required().min(3).max(20),
            // email: Joi.string().email().required(),
            languagesKnown: Joi.array().required(),
            gender: Joi.string().required(),
            country: Joi.string().required(),
            mobile: Joi.string().required().min(10).max(10),
            address: Joi.object()
        }).unknown(true);

        const { error } = schema.validate(req.body);
        if (error) { return next(error.details[0].message); }

        try {
            if (req.body.address && req.body.address.longitude && req.body.address.latitude) {
                req.body.geometry = {
                    type: 'Point',
                    coordinates: [req.body.address.longitude, req.body.address.latitude]
                };
            }
            const user = await UsersModel.findByIdAndUpdate(req.user.user_id, req.body, {
                fields: { password: 0 }, new: true
            });
            if (user.profilePic && user.profilePic.key) user.profilePic.src = await s3_bucket.getSignedS3Url(user.profilePic.key);
            return res.status(http_status.OK).send(user);
        } catch (error) {
            return next(error);
        }
    },
    updatePassword: async (req, res, next) => {
        const schema = Joi.object({
            currentPassword: Joi.string().required().min(6),
            newPassword: Joi.string().required().min(6)
        });

        const { error } = schema.validate(req.body);
        if (error) { return next(error.details[0].message); }

        try {
            if (req.body.currentPassword === req.body.newPassword) {
                return res.status(http_status.BAD_REQUEST).send({
                    message: "New Password must be different from current password"
                });
            }
            const user = await UsersModel.findOne({
                _id: req.user.user_id
            });
            const isValidPwd = await bcrypt.compare(req.body.currentPassword, user.password);
            if (!isValidPwd) {
                return res.status(http_status.UNAUTHORIZED).send({
                    message: "Current Password Invalid"
                });
            }
            const salt = await bcrypt.genSalt(10);
            const newHashedPassword = await bcrypt.hash(req.body.newPassword, salt); // Hashed password

            await UsersModel.findOneAndUpdate({
                _id: req.user.user_id
            }, {
                password: newHashedPassword
            });
            // TODO Send Password updated info mail
            return res.status(http_status.ACCEPTED).send({
                message: "Password Updated"
            });
        } catch (error) {
            return next(error);
        }
    },

    setPassword: async (req, res, next) => {
        const schema = Joi.object({
            password: Joi.string().required().min(6)
        });

        const { error } = schema.validate(req.body);
        if (error) { return next(error.details[0].message); }

        try {
            const user = await UsersModel.findOne({
                _id: req.user.user_id,
                password: null
            });
            if (!user) {
                return res.status(http_status.FORBIDDEN).send({
                    message: "NO access to set password "
                });
            }
            const salt = await bcrypt.genSalt(10);
            const newHashedPassword = await bcrypt.hash(req.body.password, salt); // Hashed password

            await UsersModel.findOneAndUpdate({
                _id: req.user.user_id,
                password: null
            }, {
                password: newHashedPassword
            });
            // TODO Send Password set info mail
            return res.status(http_status.ACCEPTED).send({
                message: "Password Updated"
            });
        } catch (error) {
            return next(error);
        }
    },

    uploadAvatar: async (req, res, next) => {
        // console.log(req.file);
        try {
            const profilePic = common_utils.getFormattedFileObj(req.file);
            profilePic.updated_on = new Date();
            const user = await UsersModel.findByIdAndUpdate(req.user.user_id, {
                profilePic
            }, {
                new: true,
                fields: {
                    password: 0,
                    __v: 0
                },
            });
            if (user.profilePic && user.profilePic.key) user.profilePic.src = await s3_bucket.getSignedS3Url(user.profilePic.key);
            return res.status(http_status.OK).send(user);
        } catch (error) {
            return next(error);
        }

    },
    saveOrUpdateWorkDetails: async (req, res, next) => {
        const schema = Joi.object({
            companyName: Joi.string().required().min(3).max(50),
            designation: Joi.string().required().min(3).max(50),
            address: Joi.object().required(),
            startDate: Joi.date().required()
        }).unknown(true);

        const { error } = schema.validate(req.body);
        if (error) { return next(error.details[0].message); }


        try {
            req.body.user_id = req.user.user_id;
            let data;
            if (req.body.workDetailsId) {
                data = await WorkDetailsModel.findByIdAndUpdate(req.body.workDetailsId, req.body, {
                    new: true
                });
            } else {
                data = await new WorkDetailsModel(req.body).save();
            }
            return res.status(http_status.OK).send(data);
        } catch (err) {
            return next(error);
        }
    },
    saveOrUpdateEducationDetails: async (req, res, next) => {
        const schema = Joi.object({
            education: Joi.string().required().min(3).max(50),
            institution: Joi.string().required().min(3).max(50),
            specialization: Joi.string().required().min(3).max(50),
            address: Joi.object().required(),
            startDate: Joi.date().required(),
            passingOut: Joi.date().required()
        }).unknown(true);

        const { error } = schema.validate(req.body);
        if (error) { return next(error.details[0].message); }

        try {

            let data;
            req.body.user_id = req.user.user_id;
            if (req.body.educationDetailsId) {
                data = await EducationDetailsModel.findByIdAndUpdate(req.body.educationDetailsId, req.body, {
                    new: true
                });
            } else {
                data = await new EducationDetailsModel(req.body).save();
            }
            return res.status(http_status.OK).send(data);
        } catch (error) {
            return next(error);
        }
    },
    getWorkDetails: async (req, res, next) => {
        try {
            const workDetails = await WorkDetailsModel.find({
                user_id: req.user.user_id
            });
            return res.status(http_status.OK).send(workDetails);
        } catch (error) {
            return next(error);
        }


    },
    getEducationDetails: async (req, res, next) => {
        try {
            const educationDetails = await EducationDetailsModel.find({
                user_id: req.user.user_id
            }, {}, {
                sort: {
                    startDate: 1
                }
            });
            return res.status(http_status.OK).send(educationDetails);
        } catch (error) {
            return next(error);
        }
    },
    deleteWorkDetails: async (req, res, next) => {
        if (!req.params.workDetailsId) {
            return next('Work details Id required');
        }

        try {
            const data = await WorkDetailsModel.findByIdAndDelete(req.params.workDetailsId);
            if (data) {
                return res.status(http_status.OK).send({
                    message: 'deleted successfully',
                    data
                });
            } else return res.status(http_status.NO_CONTENT).send();
        } catch (error) {
            return next(error);
        }
    },
    deleteEducationDetails: async (req, res, next) => {
        if (!req.params.educationDetailsId) {
            return res.status(http_status.BAD_REQUEST).send({
                message: 'Education details Id required'
            });
        }

        try {
            const data = await EducationDetailsModel.findByIdAndDelete(req.params.educationDetailsId);
            if (data) {
                return res.status(http_status.OK).send({
                    message: 'deleted successfully',
                    data
                });
            } else return res.status(http_status.NO_CONTENT).send();
        } catch (error) {
            return next(error);
        }
    },
    getUserInfo: async (req, res, next) => {
        if (!req.params.user_id) {
            return res.status(http_status.BAD_REQUEST).send({
                message: 'User id required'
            });
        }
        if (!ObjectId.isValid(req.params.user_id)) {
            return res.status(http_status.BAD_REQUEST).send({
                message: 'User id invalid format'
            });
        }
        try {
            const keys = req.query.keys;
            let reqFields = {};
            const defaultFields = {
                firstName: 1,
                lastName: 1,
                profilePic: 1,
                username: 1
            };
            const allowedFields = ["firstName", "lastName", "profilePic", "email", "username"];
            if (keys) {
                keys.split(",").forEach(key => { if (allowedFields.includes(key)) reqFields[key] = 1; });
            } else {
                reqFields = defaultFields;
            }
            if (Object.keys(reqFields).length == 0) { reqFields = defaultFields; }

            let user = await UsersModel.findById(req.params.user_id, reqFields);
            if (user) {
                user = JSON.parse(JSON.stringify(user));
                user.user_id = user._id;
                if (user.profilePic) {
                    if (user.profilePic.key)
                        user.profilePic = await s3_bucket.getSignedS3Url(user.profilePic.key);
                    else user.profilePic = user.profilePic.src;
                }
                user._id = undefined;
            }
            return res.status(http_status.OK).send(user);
        } catch (error) {
            return next(error);
        }
    },
    getUserInfoByEmail: async (req, res, next) => {
        if (!req.params.email) {
            return res.status(http_status.BAD_REQUEST).send({
                message: 'Email address required'
            });
        }
        try {
            const keys = req.query.keys;
            let reqFields = {};
            const defaultFields = {
                firstName: 1,
                lastName: 1,
                profilePic: 1,
                username: 1
            };
            const allowedFields = ["firstName", "lastName", "profilePic", "email", "username"];
            if (keys) {
                keys.split(",").forEach(key => { if (allowedFields.includes(key)) reqFields[key] = 1; });
            } else {
                reqFields = defaultFields;
            }
            if (Object.keys(reqFields).length == 0) { reqFields = defaultFields; }

            let user = await UsersModel.findOne({ email: req.params.email }, reqFields);
            if (user) {
                user = JSON.parse(JSON.stringify(user));
                user.user_id = user._id;
                if (user.profilePic) {
                    if (user.profilePic.key)
                        user.profilePic = await s3_bucket.getSignedS3Url(user.profilePic.key);
                    else user.profilePic = user.profilePic.src;
                }
                user._id = undefined;
            }
            return res.status(http_status.OK).send(user);
        } catch (error) {
            return next(error);
        }
    },
    getDashboardCounts: async (req, res, next) => {
        const user_id = req.user.user_id;
        const notifications = {}, chat = {};

        try {
            notifications.total = await NotificationsModel.countDocuments({ user_id, is_deleted: false });
            notifications.un_seen_count = await NotificationsModel.countDocuments({ user_id, is_seen: false, is_deleted: false });
            notifications.un_read_count = await NotificationsModel.countDocuments({ user_id, is_read: false, is_deleted: false });
            const conv_ids = await ConversationsModel.distinct('_id', { 'members.user': { $eq: req.user.user_id } });
            chat.total = await MessagesModel.countDocuments({
                'conversation_id': { $in: conv_ids },
                'sender': { $ne: req.user.user_id },
                'meta.user': { $ne: req.user.user_id },
                'is_deleted': { $ne: true }
            });
            const resObj = { notifications, chat };
            return res.status(http_status.OK).send(resObj);
        } catch (error) {
            return next(error);
        }
    },
    updateIdentity: async (req, res, next) => {
        if (!req.body.data) {
            return next('data required');
        }

        const data = JSON.parse(req.body.data);

        const schema = Joi.object({
            document_type: Joi.string().required().min(3).max(20),
            document_number: Joi.string().required().min(3).max(20)
        }).unknown(true);

        const { error } = schema.validate(data);

        if (error) { return next(error.details[0].message); }

        const identity = {
            document_type: data.document_type,
            document_number: data.document_number,
            is_verified: false
        };

        try {
            if (req.file) identity.document = common_utils.getFormattedFileObj(req.file);
            const user = await UsersModel.findByIdAndUpdate(req.user.user_id, { identity }, { new: true });
            if (user.identity && user.identity.document && user.identity.document.key) user.identity.document.src = await s3_bucket.getSignedS3Url(user.identity.document.key);
            return res.status(http_status.OK).send(user);
        } catch (error) {
            return next(error);
        }
    },

    getLikedProperties: async (req, res, next) => {
        const { skip, limit, sort } = req.query;
        try {
            const filter = { user_id: new ObjectId(req.user.user_id) };
            const total = await PropertyLikesModel.countDocuments(filter);

            const liked_properties = await PropertyLikesModel.aggregate([
                {
                    $match: filter
                },
                {
                    $lookup: {
                        from: modelConstants.PROPERTIES,
                        localField: "property_id",
                        foreignField: "_id",
                        as: "property",
                    }
                },
                {
                    $unwind: {
                        path: "$property",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: 1,
                        property_id: 1,
                        user_id: 1,
                        property: {
                            property_address: 1, _id: 1, property_title: 1, property_type: 1, property_user_id: 1, property_media: 1,
                            property_currency: 1, property_bedrooms: 1, property_beds: 1, property_bathrooms: 1, property_area: 1
                        },
                        createdAt: 1,
                        updatedAt: 1
                    }
                },
                { $sort: sort },
                { $skip: skip },
                { $limit: limit }
            ]);

            return res.status(http_status.OK).send({ skip, limit, total, liked_properties });
        } catch (error) {
            return next(error);
        }
    },

    getWishlistProperties: async (req, res, next) => {

        const { skip, limit, sort } = req.query;

        try {
            const filter = { user_id: new ObjectId(req.user.user_id) };

            const total = await PropertyFavouritesModel.countDocuments(filter);

            const wishlist_properties = await PropertyFavouritesModel.aggregate([
                {
                    $match: filter
                },
                {
                    $lookup: {
                        from: modelConstants.PROPERTIES,
                        localField: "property_id",
                        foreignField: "_id",
                        as: "property",
                    }
                },
                {
                    $unwind: {
                        path: "$property",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: 1,
                        property_id: 1,
                        user_id: 1,
                        property: {
                            property_address: 1, _id: 1, property_title: 1, property_type: 1, property_user_id: 1, property_media: 1,
                            property_currency: 1, property_bedrooms: 1, property_beds: 1, property_bathrooms: 1, property_area: 1
                        },
                        createdAt: 1,
                        updatedAt: 1
                    }
                },
                { $sort: sort },
                { $skip: skip },
                { $limit: limit }
            ]);

            return res.status(http_status.OK).send({ skip, limit, total, wishlist_properties });
        } catch (error) {
            return next(error);
        }
    }

};