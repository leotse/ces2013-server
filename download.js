var fs = require('fs')
,	request = require('request')
,	config = require('./config').netflix;


// download streaming catalog
var url = 'http://api-public.netflix.com/catalog/titles/streaming?output=json'
,	headers = { 'Accept-Encoding': 'gzip' }
, 	oauth = {
		consumer_key: config.key,
		consumer_secret: config.secret
	};

// create file stream
var stream = fs.createWriteStream('catalog.zip');

// download file
request({ 
	url: url, 
	oauth: oauth,
	headers: headers 
}).pipe(stream);



/////////////////////
// Private Helpers //
/////////////////////

function print(json) {
	console.log(JSON.stringify(json));
}