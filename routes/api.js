////////////////
// API Routes //
////////////////
var routes = {}
,	helpers = require('../helpers')
,	netflix = helpers.api.netflix;


// test an api path
routes.test = function(req, res) {

	var query = req.query
	,	path = query.path;

	if(path) {
		netflix.test(path, completed);
	} else {
		netflix.connect(completed);
	}

	// request completed handler
	function completed(err, result) {
		if(err) helpers.sendError(res, err);
		else helpers.send(res, result);
	}
};


// export
module.exports = routes;