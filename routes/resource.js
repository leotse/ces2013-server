////////////////
// API Routes //
////////////////
var routes = {}
,	models = require('../models')
,	GridFS = models.GridFS
,	helpers = require('../helpers');

routes.ios = {};
routes.iosRetina = {};
routes.android = {};

// ios logo
routes.ios.logo = function(req, res) {
	streamFile(res, "ios_logo");
};

// ios background
routes.ios.background = function(req, res) {
	streamFile(res, "ios_background");
};

// ios retina logo
routes.iosRetina.logo = function(req, res) {
	streamFile(res, "ios_retina_logo");
};

// ios retina background
routes.iosRetina.background = function(req, res) {
	streamFile(res, "ios_retina_background");
};

// android logo
routes.android.logo = function(req, res) {
	streamFile(res, "android_logo");	
};

// android background
routes.android.background = function(req, res) {
	streamFile(res, "android_background");
};


/////////////
// Helpers //
/////////////

function streamFile(res, filename, callback) {
	GridFS.getFile(filename, function(err, stream) {
		if(err) helpers.sendError(res, err);
		else stream.pipe(res);
	});
}

// export
module.exports = routes;
