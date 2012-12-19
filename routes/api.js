////////////////
// API Routes //
////////////////
var routes = {}
,	helpers = require('../helpers')
,	netflix = helpers.api.netflix
,	models = require('../models')
,	Title = models.Title;


var PAGE_SIZE = 10;


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


// gets all titles
routes.titles = function(req, res) {

	var query = req.query
	,	page = query.page || 1
	,	limit = query.limit || PAGE_SIZE
	,	skip = (page - 1) * limit;

	Title
	.find({})
	.sort('-releaseYear')
	.skip(skip)
	.limit(limit)
	.exec(function(err, titles) {
		if(err) helpers.sendError(res, err);
		else helpers.send(res, titles);
	});
};

// get movies
routes.movies = function(req, res) {

	var query = req.query
	,	page = query.page || 1
	,	limit = query.limit || PAGE_SIZE
	,	skip = (page - 1) * limit;

	Title
	.find({ id: /movies/ })
	.sort('-releaseYear')
	.skip(skip)
	.limit(limit)
	.exec(function(err, titles) {
		if(err) helpers.sendError(res, err);
		else helpers.send(res, titles);
	});
};


// get tv shows
routes.tvshows = function(req, res) {

	var query = req.query
	,	page = query.page || 1
	,	limit = query.limit || PAGE_SIZE
	,	skip = (page - 1) * limit;

	Title
	.find({ id: /series\/\d+$/ })
	.sort('-releaseYear')
	.skip(skip)
	.limit(limit)
	.exec(function(err, titles) {
		if(err) helpers.sendError(res, err);
		else helpers.send(res, titles);
	});
};


// get by genres
routes.genres = function(req, res) {

	var query = req.query
	,	type = query.type
	,	page = query.page || 1
	,	limit = query.limit || PAGE_SIZE
	,	skip = (page - 1) * limit

	// filter by genre
	var genre = req.params.genre
	, 	regex = new RegExp(genre);

	var  dbquery = Title.find({ categories: regex });

	// filter by type (tv show or movies
	if(type) {
		if(type.toLowerCase() === 'tv') {
			dbquery.regex('id', /series\/\d+$/);
		} else if(type.toLowerCase() === 'movie') {
			dbquery.regex('id', /movies/);
		}
	}

	// paging
	dbquery
	.sort('-releaseYear')
	.skip(skip)
	.limit(limit);


	// execute query
	dbquery.exec(function(err, titles) {
		if(err) helpers.sendError(res, err);
		else helpers.send(res, titles);
	});

}


// export
module.exports = routes;