////////////////////////////
// Model Schema Creations //
////////////////////////////

var mongoose = require('mongoose')
,	config = require('../config');


// initialize database connection
mongoose.connect(config.db);
mongoose.connection.on('open', function(err, db) {
	if(err) throw err;
});


// import schemas
var TitleSchema = require('./title');


// register models
mongoose.model('Title', TitleSchema);


// export models
module.exports.Title = mongoose.model('Title');