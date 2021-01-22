"use strict";

const Razorpay = require("razorpay");

const { razorPayConfig } = require('./../config');

module.exports = new Razorpay({
    key_id: razorPayConfig.KEY_ID,
    key_secret: razorPayConfig.KEY_SECRET
});