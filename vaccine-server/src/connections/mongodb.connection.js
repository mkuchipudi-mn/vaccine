const mongoose = require('mongoose');
const { dbConfig } = require('./../config');

mongoose.Promise = global.Promise;
global.ObjectId = mongoose.Types.ObjectId;

module.exports.connect = async () => {
    return new Promise(async (resolve, reject) => {

        try {
            await mongoose.connect(dbConfig.MONGODB_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false
            });
            logger.info("Mongo db connection successful");
            resolve('success');
        } catch (error) {
            logger.error('Could not connect to the database. Exiting now...' + error);
            reject('failure');
            process.exit();
        }
    });
};