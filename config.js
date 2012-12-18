////////////////////
// Configurations //
////////////////////
var config = {};


// db connection string
config.db = 'localhost:27017/ces2013';


// netflix api
var netflix = {};
netflix.key = '7dtbcfsmprsya4cj499x8pav';
netflix.secret = 'CtCshKCMKm';
config.netflix = netflix;


// export module
module.exports = config;