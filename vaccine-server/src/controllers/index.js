"use strict";
const Joi = require('joi');
Joi.objectId = () => Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'valid object id');



module.exports.DeveloperController = require('./developer.controller'); // Todo Development purpose only

module.exports.UserController = require('./user.controller');