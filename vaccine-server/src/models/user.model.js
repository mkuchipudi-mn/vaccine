"use strict";
const mongoose = require('mongoose');

const { modelConstants } = require('./../constants');
const regExp = require('./../validators/reg-exp');

const schema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 2,
        index: true
    },
    lastName: {
        type: String,
        default: '',
        index: true
    },
    roles: {
        type: Array,
        required: true,
        // enum: ["USER", "TAVELLER", "PROPERTY_OWNER", "PROPERTY_MANAGER", "PROPERTY_AGENCY", "TRAVEL_AGENCY", "TRAVEL_AGENT", "ADMIN", "SUPER_ADMIN", "PROPERTY_MANAGER"]
    },
    country: {
        type: String,
        // required: true
        index: true,
        default: null
    },
    email: {
        type: String,
        required: true,
        index: {
            unique: true
        },
        lowercase: true,
        maxlength: 100,
        minlength: 5,
        validate: [regExp.EMAIL.reg, 'Please fill a valid email address'],
        uniqueCaseInsensitive: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerifiedOn: {
        type: Date,
        default: null
    },
    mobile: {
        type: String,
        // index: {
        //     unique: true
        // },
        maxlength: 13,
        minlength: 10,
        default: null,
        index: true
    },
    isMobileVerified: {
        type: Boolean,
        default: false
    },
    mobileVerifiedOn: {
        type: Date,
        default: null
    },
    gender: {
        type: String,
        default: null
    },
    profilePic: {
        type: Object,
        default: null
    },
    password: {
        type: String,
        minlength: 6,
        // required: true
    },
    oAuth: {
        type: Object,
        default: {
            googleId: '',
            linkedinId: '',
            facebookId: ''
        }
    },
    languagesKnown: {
        type: Array
    },
    address: {
        type: Object,
        default: null,
        index: true
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
            required: true
        },
        coordinates: {
            type: [Number],
            default: [],
            required: true
        }
    },
    isTermsAndConditionsAgreed: {
        type: Boolean,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    username: {
        type: String,
        required: true,
        index: {
            unique: true
        },
        lowercase: true,
        maxlength: 30,
        minlength: 5
    },
    identity: {
        type: {
            document_type: {
                type: Object,
                minlength: 3,
                maxlength: 30
            },
            document_number: {
                type: String,
                minlength: 5,
                maxlength: 50
            },
            document: {
                type: Object
            },
            is_verified: {
                type: Boolean,
                default: false
            }
        },
        default: null

    },
    timezone: {
        type: Object,
        default: null
    },
    is_online: {
        type: Boolean,
        default: false
    },
    socket_ids: {
        type: [String],
        default: []
    },
    last_active: {
        type: Date,
        default: null
    },
    __v: {
        type: Number,
        select: false
    }
}, {
    versionKey: false,
    timestamps: true
});

// schema.index({ username: 'text', email: 'text', firstName: 'text', lastName: 'text' });
const collectionName = modelConstants.USERS;

const User = mongoose.model(collectionName, schema, collectionName);

module.exports = User;