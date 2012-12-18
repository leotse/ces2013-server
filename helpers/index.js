///////////////////
// Helpers Index //
///////////////////
var helpers = {};


//////////////////////////////////
// Request and Response Helpers //
//////////////////////////////////
helpers.sendError = function(res, err) {
	var json = { 
			meta: { 
				code: 500,
				error: err
			}
		};
	res.send(json);

	// error log
	console.log(json);
};

helpers.send = function(res, result) {
	var json = {
		meta: { code: 200 },
		response: result
	}
	res.send(json);
};


////////////////////
// 3rd Party APIs //
////////////////////
helpers.api = {};
helpers.api.netflix = require('./netflix');


// export
module.exports = helpers;