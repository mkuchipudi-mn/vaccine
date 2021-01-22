"use strict";

const {
    CurrencyExchangeRatesModel
} = require('./../models');

module.exports.getConvertedCurrency = (units = 1, from, to = 'USD') => {
    console.log(units, from, to);
    return new Promise(async (resolve, reject) => {
        const currenciesObj = await CurrencyExchangeRatesModel.findOne();
        if (currenciesObj) {
            const converted_unit_price = (currenciesObj.rates[to] / currenciesObj.rates[from]);
            const converted_price = units * converted_unit_price;
            resolve(converted_price);
        } else {
            resolve(undefined);
        }
    });
};