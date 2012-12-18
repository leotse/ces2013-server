////////////////////////
// XmlSelector Module //
////////////////////////s
var fs = require('fs')
,	util = require('util')
,	events = require('events');


// inherts from event emitter
util.inherits(XmlSelector, events.EventEmitter);


// class definition
function XmlSelector(tag, file) {

	if(!tag || !file) throw new Error('tag and file args are required!');

	var self = this
	,	startTag = util.format('<%s>', tag)
	,	endTag = util.format('</%s>', tag)
	,	buffer = ''
	,	pos = -1
	,	start = -1
	,	end = -1
	,	xml = '';

	// method to start reading stream
	self.process = function() {
		var stream = fs.createReadStream(file);

		stream.on('data', function(data) {
			buffer += data;

			while(true) {
			
				// find the start and end pos of the tag
				start = buffer.indexOf(startTag);
				end = buffer.indexOf(endTag);

				// if both exists, return the xml body and update the buffer
				if(start >= 0 && end >= 0) {
					xml = buffer.substring(start, end + endTag.length);
					buffer = buffer.substring(end + endTag.length);
					self.emit('match', xml);
				} else {
					break;
				}
			}
		});
	};

	return self;
}


// export
module.exports = XmlSelector;