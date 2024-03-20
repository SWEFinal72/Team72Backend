const alllowedOrigins = require('../config/allowedOrigins');

const corsOptions = {
    origin: function (origin, callback) {
      // limits orgins only allowed in the alllowedOrigins array
      // and places that have no origin for testing purposes
        if (alllowedOrigins.indexOf(origin) !== -1 || !origin) {
          //true boolean means the result is valid and true
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}
module.exports = corsOptions;
