////////////////////
// Configurations //
////////////////////
var config = {};


// db connection string
if(process.env.PORT) {
	config.db = 'mongodb://ces2013:ces2013@ds045757.mongolab.com:45757/ces2013'; // PROD
} else {
	config.db = 'localhost:27017/ces2013'; // DEV
}


// netflix api
var netflix = {};
netflix.key = '7dtbcfsmprsya4cj499x8pav';
netflix.secret = 'CtCshKCMKm';
config.netflix = netflix;


// export module
module.exports = config;