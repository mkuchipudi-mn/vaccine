"use strict";

const env = require('dotenv');
env.config();

global.ENV = process.env;
if (!ENV.NODE_ENV) {
    console.error('Update/set .env file before you start...');
    process.exit();
}

global.logger = require('./src/helpers/logger');
global.s3_bucket = require('./src/upload/s3-bucket');

const express = require('express');
const app = express();
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const useragent = require('express-useragent');
const swaggerStats = require('swagger-stats');
const passport = require('passport');
const path = require('path');
const http = require('http');
const cors = require('cors');

const connections = require('./src/connections');
const session = require('./src/helpers/session');
const cronJobs = require('./src/cron-jobs');
const errorHandler = require('./src/helpers/error-handler');
const { pagination } = require('./src/middlewares');

const common_utils = require('./src/utils/common-utils');

class Server {

    constructor() {
        console.log('Starting Server...');
        this.PORT = ENV.PORT || 3456;
        this.routes = require('./src/routes');
        //this.socket = require('./src/socket');
        this.server = http.createServer(app);
    }
    enableCors() {
        // ? CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
        app.use(cors()); // Access-Control-Allow-Origin => Open Cors
        // app.use(cors(require('./src/cors/cors'))); // TODO: to allow/restrict cors for particular domains
    }

    initiateMiddlewares() {

        // ? Helmet helps you secure Express apps by setting various HTTP headers.
        app.use(helmet());

        // ? express-useragent is a simple NodeJS/ExpressJS user-agent middleware exposing user-agent details to your application and views
        app.use(useragent.express());

        // ? Trace API calls and Monitor API performance, health and usage statistics in Node.js Microservices
        // ? Open Statistics host:port/swagger-stats/ui
        app.use(swaggerStats.getMiddleware({
            durationBuckets: [50, 100, 200, 500, 1000, 5000],
            requestSizeBuckets: [500, 5000, 15000, 50000],
            responseSizeBuckets: [600, 6000, 6000, 60000]
        }));

        // ? to recognize the incoming Request Object as strings or arrays
        app.use(express.urlencoded({ extended: true }));

        // ? to recognize the incoming Request Object as a JSON Object
        app.use(express.json({ limit: '300kb' }));

        app.use(cookieParser());
        app.use(pagination);

        // ? 
        if (ENV.NODE_ENV === 'production') app.set('trust proxy', true);
        app.use(session);

        // ? Passport is Express-compatible authentication middleware for Node.js.
        app.use(passport.initialize());
        app.use(passport.session());

        // ? Creating a Local Media Storage with Express
        app.use('/media-storage', express.static(path.join(__dirname, 'media-storage')));

        app.use((req, res, next) => {
            const begin = Date.now();
            // // Cookies that have not been signed
            // console.log('Cookies: ', req.cookies);

            // // Cookies that have been signed
            // console.log('Signed Cookies: ', req.signedCookies);

            res.setHeader('Access-Control-Allow-Origin', req.header('Origin') ? req.header('Origin') : '*');
            res.setHeader('Access-Control-Allow-Credentials', true);
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');

            res.on('finish', () => {
                const t = Date.now() - begin, cl = res.getHeader('content-length');
                console.log(req.method, res.statusCode, res.statusMessage, req.originalUrl, t + 'ms', common_utils.readableBytes(cl));
            });

            if (req.method === 'OPTIONS') res.send(200); else next();
        });
    }
    async includeRoutes() {
        // app.use('/v1', this.routes.init());
        app.use(this.routes.init());
        // global.socket_io = await this.socket.listen(this.server);
    }

    async execute() {

        this.enableCors();
        this.initiateMiddlewares();

        // ? Initiating database/mail Connections
        await connections.init();

        // ? Initiating Cron Jobs
        cronJobs.init();

        this.includeRoutes();
        app.use(errorHandler);

        this.server.listen(this.PORT, () => {
            logger.info(`Server is listening on ${this.server.address().address !== '::' ? 'http://' + this.server.address().address : 'http://localhost'}:${this.server.address().port}/`);
            ENV.updated_on = new Date().toISOString();
            if (ENV.NODE_ENV === 'production' || ENV.NODE_ENV === 'sandbox') {
                console.error = console.log = console.warn = () => { };
            }
        });
    }
}

const server = new Server();
server.execute();