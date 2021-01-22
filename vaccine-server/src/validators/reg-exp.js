"use strict";

module.exports = {
    EMAIL: {
        reg: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        message: 'A valid Email id required',
        desc: "Email Regular expression for validation"
    },
    LOWER_SNAKE_CASE: {
        reg: /\b[a-z]+(_[a-z]+)*\b/,
        message: 'Please fill a valid value ( should be a lower snake case)',
        desc: "Lower Snake case Regular expression for validation"
    },
    UPPER_SNAKE_CASE: {
        reg: /\b[A-Z]+(_[A-Z]+)*\b/,
        message: 'Please fill a valid value ( should be a upper snake case)',
        desc: "Upper Snake case Regular expression for validation"
    },
    IP: {
        reg: /^(?:(?:^|\.)(?:2(?:5[0-5]|[0-4]\d)|1?\d?\d)){4}$/,
        message: 'valid Ip required',
        desc: "IP Regular expression for validation"
    },
    WEBSITE: {
        reg: /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/,
        message: 'valid website url required',
        desc: 'Website Regular Expression Validation'
    }
};