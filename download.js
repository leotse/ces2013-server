var _ = require('underscore')
,	fs = require('fs')
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

var XmlSelector = require('./helpers/xmlselector')
,	selector = new XmlSelector('catalog_title', extracted)
,	parser = new xml2js.Parser()
,	models = require('./models')
,	Title = models.Title;

selector.on('match', function(xml) {

	parser.parseString(xml, function(err, json) {
		if(err) throw err;
		else {

			// successfully parsed xml to json!
			// now we can create a data model with this json and store in db
			// console.log(util.inspect(json, false, null));
			saveTitle(json);
		}
	});
});

// start refresh db
Title.collection.drop();
selector.process();




/////////////
// Helpers //
/////////////


function saveTitle(json) {

	var title = new Title()
	,	catalogTitle = json.catalog_title
	,	link = catalogTitle.link
	,	category = catalogTitle.category;

	// populate the fields
	title.id = getId();
	title.title = getTitle();
	title.releaseYear = getReleaseYear();
	title.averageRating = getAverageRating();
	title.updated = getUpdated();
	title.boxArt = getBoxArt();
	title.synopsis = getSynopsis();
	title.synopsisShort = getSynopsisShort();
	title.people = getPeople();
	title.similars = getSimilars();
	title.categories = getCategories();

	// save the doc!
	title.save(function(err, saved) {
		if(err) throw err;
		else console.log('saved title: ' + saved.id);
	});


	// helpers
	function getId() {
		return catalogTitle.id[0];
	}

	function getTitle() {
		var title = catalogTitle.title[0].$;
		return {
			short: title.short,
			regular: title.regular
		};
	}

	function getReleaseYear() {
		var year = catalogTitle.release_year[0];
		if(isFinite(year)) {
			return year;
		} else {
			return 0;
		}
	}

	function getAverageRating() {
		if(catalogTitle.average_rating) {
			return catalogTitle.average_rating[0];
		}
	}

	function getUpdated() {
		return catalogTitle.updated[0];
	}

	function getBoxArt() {
		var node = _.find(link, function(l) { return l.box_art; });
		if(node) {
			return _.map(node.box_art[0].link, function(boxart) { 
				return {
					title: boxart.$.title,
					url: boxart.$.href
				};
			});
		}
	}

	function getSynopsis() {
		var node = _.find(link, function(l) { return l.synopsis; });
		if(node) {
			return node.synopsis[0];
		} else {
			return null;
		}
	}

	function getSynopsisShort() {
		var node = _.find(link, function(l) { return l.short_synopsis; });
		if(node) {
			return node.short_synopsis[0];
		} else {
			return null;
		}
	}

	function getPeople() {
		var node = _.find(link, function(l) { return l.people; });
		if(node) {
			return _.map(node.people[0].link, function(person) { return person.$.title });
		} else {
			return [];
		}
	}

	function getSimilars() {
		var node = _.find(link, function(l) { return l.$ && l.$.title === 'similars'; });
		if(node) {
			return node.$.href;
		} else {
			return null;
		}
	}

	function getCategories() {
		return _.map(category, function(cat) { return cat.$.term.toLowerCase(); });
	}
}








