"use strict";

// module.exports = ENV.NODE_ENV == 'production' ?
//     require('./../environments/environment.prod') : require('./../environments/environment');
const config = {
    development: {
        WEB_URL: 'http://localhost:4567/',
        API_URL: `http://localhost:${ENV.PORT}/`,
        AUTH_WEB_URL: `http://localhost:4300/`,
        TRAVEL2UBE_WEB_URL: `http://localhost:3434/`,
        PROPERTY_MANAGER_WEB_URL: 'http://localhost:9999/',
        TRAVEL_AGENCY_WEB_URL: '',
        ADMIN_WEB_URL: 'http://localhost:4500/',
        API_HOST: `localhost:${ENV.PORT}`,
        KURENTO_HOST: '52.66.242.106',
        apps: [
            {
                appName: 'main_app',
                origin: 'http://localhost:4567'
            },
            {
                appName: 'travel2ube',
                origin: 'http://localhost:3434'
            },
            {
                appName: 'business_property_manager',
                origin: 'http://localhost:9999'
            },
            {
                appName: 'business_travel_agency',
                origin: 'http://localhost:9998'
            },
            {
                appName: 'largepocket',
                origin: 'http://localhost:9997'
            }
        ]
    },
    sandbox: {
        WEB_URL: 'https://sandbox.rentastico.com/',
        API_URL: `https://test-api.rentastico.com/`,
        AUTH_WEB_URL: `http://localhost:4300/`,
        TRAVEL2UBE_WEB_URL: 'http://localhost:3434/',
        PROPERTY_MANAGER_WEB_URL: 'http://localhost:9999/',
        TRAVEL_AGENCY_WEB_URL: '',
        ADMIN_WEB_URL: 'https://admin-sandbox.rentastico.com',
        API_HOST: `test-api.rentastico.com/`,
        KURENTO_HOST: '52.66.242.106',
        apps: [
            {
                appName: 'main_app',
                origin: 'https://sandbox.rentastico.com'
            },
            {
                appName: 'travel2ube',
                origin: 'https://travel2ube-sandbox.rentastico.com'
            },
            {
                appName: 'business_property_manager',
                origin: 'https://manage-sandbox.rentastico.com'
            },
            {
                appName: 'business_travel_agency',
                origin: 'http://localhost:9998'
            },
            {
                appName: 'largepocket',
                origin: 'http://localhost:9997'
            }
        ]
    },
    production: {
        WEB_URL: 'https://www.rentastico.com/',
        API_URL: 'https://api.rentastico.com/',
        AUTH_WEB_URL: `http://localhost:4300/`,
        TRAVEL2UBE_WEB_URL: '',
        PROPERTY_MANAGER_WEB_URL: '',
        TRAVEL_AGENCY_WEB_URL: '',
        ADMIN_WEB_URL: '',
        API_HOST: 'api.rentastico.com',
        KURENTO_HOST: '52.66.242.106',
        apps: []
    }
};
module.exports = config[ENV.NODE_ENV];