"use strict";
const elasticsearch = require("elasticsearch");

const { dbConfig } = require('../config');

const client = new elasticsearch.Client({
    hosts: [
        dbConfig.ELASTIC_SEARCH_HOST,
    ]
});

module.exports.verify = () => {
    return new Promise(async (resolve, reject) => {
        client.ping({
            requestTimeout: 30000,
        }, (error) => {
            if (error) {
                // logger.error(error);
                logger.error('elasticsearch cluster is down!');
                reject(error);
            } else {
                logger.info('Elastic Search Database connection Established');
                resolve('success');
            }
        });
    });
};

module.exports.esClient = client;