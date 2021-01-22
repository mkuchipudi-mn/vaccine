'use strict';

const mongodb = require('./mongodb.connection');
const elasticsearch = require('./elasticsearch.connection');
const transporter = require('./mail.connection');

module.exports.init = () => {
	return new Promise(async (resolve, reject) => {
		await mongodb.connect();
		//await elasticsearch.verify();
		//await transporter.verify();
		resolve('success');
	});
};

module.exports.esClient = elasticsearch.esClient;

module.exports.mailTransporter = transporter.transporter;

module.exports.razorpay = require('./razorpay.connection');
