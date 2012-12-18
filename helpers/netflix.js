/////////////////////////
// Netflix API Wrapper //
/////////////////////////
var netflix = {};
var util = require('util')
,	request = require('request')
,	config = require('../config').netflix;


// urls
var BASE_URL = 'http://api-public.netflix.com'
,	TEST = '/catalog/titles'
,	TITLES = '/catalog/titles?term=%s'


// test connection
netflix.connect = function(callback) {
	var url = getUrl(TEST);
	oauthRequest(url, callback);
};


// test api
netflix.test = function(path, callback) {
	var url = getUrl(path);
	oauthRequest(url, callback);
};


// titles
netflix.titles = function(term, callback) {
	var titlesPath = util.format(TITLES, term)
	, 	url = getUrl(titlesPath);
	oauthRequest(url, callback);
};


// export
module.exports = netflix;


/////////////////////
// Private Helpers //
/////////////////////

// easy way to get url from the given absolute path
function getUrl(path) {
	var url = BASE_URL + path;
	url += (path.indexOf('?') >= 0) ? "&" : "?";
	url += "output=json";

	return url;
}

// makes an oauth request
function oauthRequest(url, callback) {

	// oauth signing
	var oauth = { 
			consumer_key: config.key,
			consumer_secret: config.secret
		};

	// make request!
	request({
		url: url,
		oauth: oauth,

		// uncomment below and start fiddler on windows for request debugging
		// proxy: 'http://localhost:8888'
	}, function(err, res, body) {

		// request came back! check for error
		if(err) callback(err);
		else{

			// try parsing the response body
			var json;
			try { json = JSON.parse(body); } 
			catch(ex) { 
				callback(ex.message + ' - ' + body);
				return;
			}

			// body parsed! happily return the parsed json
			callback(null, json);
		}
	});
}