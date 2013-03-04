////////////////////////////
// Model Schema Creations //
////////////////////////////

var mongoose = require('mongoose')
,	config = require('../config')
,	conn = null
,	db = null
,	gs = null
,	models = {};


// initialize database connection
conn = mongoose.connect(config.db);
mongoose.connection.on('open', function(err) {
	if(err) throw err;
	else {
		db = mongoose.connection.db;
		gs = conn.mongo.GridStore;

		var wow = new gs(db, "wer.jpg", "w", {
			"content_type": "image/jpg",
			"metadata": "google doodle"
		});
		wow.open(function(err, obj) {

			if(err) throw err
			else {
				wow.writeFile('./uploaded/google.jpg', function(err, obj) {
					if(err) throw err;
					else console.log('done writing file!');
				});
			}
		});
	}
});


// title schema
var TitleSchema = require('./title');
mongoose.model('Title', TitleSchema);


// to retrieve files
module.exports.getFile = function(filename, callback) {

	if(!filename || !callback) throw new Error("filename and callback are required");
	else {

		var file = new gs(db, filename, "r");
		file.open(function(err, gs) {

			if(err) callback(err);
			else {
				var stream = gs.stream(true);
				callback(null, stream);
			}
		});
	}
};



// export
module.exports.Title = mongoose.model('Title');
