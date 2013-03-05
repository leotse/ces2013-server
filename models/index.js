////////////////////////////
// Model Schema Creations //
////////////////////////////

var mongoose = require('mongoose')
,	config = require('../config')
,	GridFS = require('./gridfs')
,	conn = null
,	db = null
,	models = {};


// initialize database connection
conn = mongoose.connect(config.db);
mongoose.connection.on('open', function(err) {
	if(err) throw err;
	else {
		db = mongoose.connection.db;

		// initialize the file storage module
		GridFS.init(conn, db);
	}
});


// title schema
var TitleSchema = require('./title');
mongoose.model('Title', TitleSchema);
models.Title = mongoose.model('Title');

// and file storage module
models.GridFS = GridFS;

// export
module.exports = models;