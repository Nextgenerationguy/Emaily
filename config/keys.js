// keys.js - to figure out what set of  credentials to return
if (process.env.NODE_ENV === 'production'){
    // We want to send the keys used for production only
    module.exports = require('./prod');
} else {
    // We want to send the keys for development mode only
    module.exports = require('./dev');
}