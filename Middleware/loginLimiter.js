const rateLimit = require('express-rate-limit');
const {logEvents} = require('./logger');

const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // limit each IP to 5 requests per 'window' per minute
    message: 
        { message: 'Too many login attempts, please try again after 60 seconds.' },

    handler: (req, res, next, options) => {
        logEvents('Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}',
         'errLog.log')
        res.status(options.statusCode).send(options.message);
    },

    standardHeaders: true,
    legacyHeaders: false,

});

module.exports = loginLimiter;