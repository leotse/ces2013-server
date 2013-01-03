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
				error: err.message
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


//////////////////
// Misc Helpers //
//////////////////


helpers.env = function() {
	if(process.env.PORT) {
		return 'prod';
	} else {
		return 'dev';
	}
}


////////////////////
// 3rd Party APIs //
////////////////////
helpers.api = {};
helpers.api.netflix = require('./netflix');


// export
module.exports = helpers;