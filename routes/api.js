////////////////
// API Routes //
////////////////
var routes = {}
,	helpers = require('../helpers')
,	netflix = helpers.api.netflix
,	models = require('../models')
,	Title = models.Title;


var PAGE_SIZE = 10;
var FIELDS = '_id synopsis synopsisShort updated averageRating releaseYear categories people boxArt.width boxArt.url title';


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
	.select(FIELDS)
	.exec(function(err, titles) {
		if(err) helpers.sendError(res, err);
		else helpers.send(res, titles);
	});
};


// get title details
routes.title = function(req, res) {

	var params = req.params
	,	id = params.id;

	// check id input
	if(!id) helpers.sendError(res, new Error('invalid id'));

	// return title by id
	Title.findById(id, function(err, title) {
		if(err) helpers.sendError(res, err);
		else if(!title) helpers.sendError(res, new Error('title not found'));
		else helpers.send(res, title);
	});
}

// get movies
routes.movies = function(req, res) {

	var query = req.query
	,	search = query.search
	,	page = query.page || 1
	,	limit = query.limit || PAGE_SIZE
	,	skip = (page - 1) * limit;

	// start building query
	var dbquery = Title.find({ id: /movies/ })

	// title filtering
	if(search) {
		var regex = new RegExp(search, 'i');
		dbquery.regex('title.short', regex);
	}

	// paging
	dbquery
	.sort('-releaseYear')
	.skip(skip)
	.limit(limit);

	// run query!
	dbquery
	.select(FIELDS)
	.exec(function(err, titles) {
		if(err) helpers.sendError(res, err);
		else helpers.send(res, titles);
	});
};


// get tv shows
routes.tvshows = function(req, res) {

	var query = req.query
	,	search = query.search
	,	page = query.page || 1
	,	limit = query.limit || PAGE_SIZE
	,	skip = (page - 1) * limit;

	// start building query
	var dbquery = Title.find({ id: /series\/\d+$/ });

	// title filtering
	if(search) {
		var regex = new RegExp(search, 'i');
		dbquery.regex('title.short', regex);
	}

	// paging
	dbquery
	.sort('-releaseYear')
	.skip(skip)
	.limit(limit)
	.select(FIELDS)

	// run query!
	dbquery.exec(function(err, titles) {
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
	.limit(limit)
	.select(FIELDS);


	// execute query
	dbquery.exec(function(err, titles) {
		if(err) helpers.sendError(res, err);
		else helpers.send(res, titles);
	});
};


// get similar
routes.similar = function(req, res) {

	var id = req.params.id;

	// first retrieve the title
	Title.findById(id, function(err, title) {
		if(err) helpers.sendError(res, err);
		else if(!title) helpers.sendError(res, new Error('title not found'));
		else {

			// we now have the title
			// get similar items by looking at categories
			var categories = title.categories.slice(1, title.categories.length - 2);

			// also page the query
			var query = req.query
			,	mode = query.mode
			,	page = query.page || 1
			,	limit = query.limit || PAGE_SIZE
			,	skip = (page - 1) * limit;

			// base query
			var dbquery = Title.where('_id').ne(id)

			// 'relax' mode returns more recommendations
			if(mode && mode.toLowerCase() === 'relax') {
				dbquery.in('categories', categories);
			} else {
				dbquery.all('categories', categories);
			}

			// paging
			dbquery
			.sort('-releaseYear')
			.skip(skip)
			.limit(limit)
			.select(FIELDS)

			// execute query!
			dbquery.exec(function(err, titles) {
				if(err) helpers.sendError(res, err);
				else helpers.send(res, titles);
			});
		}
	});
};


// export
module.exports = routes;