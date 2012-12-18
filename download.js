var fs = require('fs')
,	events = require('events')
,	zlib = require('zlib')
,	util = require('util')
,	request = require('request')
,	xml2js = require('xml2js')
,	config = require('./config').netflix;

var filename = 'data/catalog.zip'
,	extracted = 'data/catalog.xml';


//////////////
// Download //
//////////////

// // download streaming catalog
// var url = 'http://api-public.netflix.com/catalog/titles/streaming?output=json'
// ,	headers = { 'Accept-Encoding': 'gzip' }
// , 	oauth = {
// 		consumer_key: config.key,
// 		consumer_secret: config.secret
// 	};

// // create file stream
// var stream = fs.createWriteStream(filename);

// // download file
// request({ 
// 	url: url, 
// 	oauth: oauth,
// 	headers: headers 
// }).pipe(stream);



/////////////
// Extract //
/////////////

// var input = fs.createReadStream(filename)
// ,	output = fs.createWriteStream(extracted)
// ,	gzip = zlib.createUnzip();

// output.on('error', function(err) { console.log('stream error: ' + err) });
// output.on('end', function() { console.log('stream ended'); });
// output.on('close', function() { console.log('done!'); });
// input.pipe(gzip).pipe(output);



/////////////
// Process //
/////////////

var input = fs.createReadStream(extracted)
,	selector = new XmlSelector('catalog_title', input);

selector.on('match', function(xml) {

	//console.log(xml);

});


/////////////
// Helpers //
/////////////

function XmlSelector(tag, stream) {

	// verify input stream
	if(!stream) throw Error('input stream is required');
	stream.setEncoding();
	

	// process stream
	var self = this
	,	startTag = util.format('<%s>', tag)
	,	endTag = util.format('</%s>', tag)
	,	buffer = ''
	,	pos = -1
	,	start = -1
	,	end = -1
	,	xml = '';

	stream.on('data', function(data) {
		buffer += data;

		while(true) {
		
			// find the start and end pos of the tag
			start = buffer.indexOf(startTag);
			end = buffer.indexOf(endTag);

			// if both exists, return the xml body and update the buffer
			console.log(start + ' ' + end);
			if(start >= 0 && end >= 0) {
				xml = buffer.substring(start, end + endTag.length);
				buffer = buffer.substring(end + endTag.length);
				stream.emit('match', xml);
			} else {
				break;
			}
		}
	});

	return stream;
}