////////////////
// API Routes //
////////////////
var routes = {}
,	models = require('../models')
,	Title = models.Title;

// gets the current logo
routes.logo = function(req, res) {
	
	models.getFile("wer.jpg", function(err, stream) {
		if(err) helpers.sendError(res, err);
		else stream.pipe(res);
	});
};

// gets the current background
routes.background = function(req, res) {
	models.getFile("wer.jpg", function(err, stream) {
		if(err) helpers.sendError(res, err);
		else stream.pipe(res);
	});
};


// export
module.exports = routes;
