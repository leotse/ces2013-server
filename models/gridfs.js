////////////////////////////
// Model Schema Creations //
////////////////////////////
var files = {};

var mongoose = require('mongoose')
,	initialized = false
,	conn = null
,	db = null
,	GridStore = null


// to initialize gridfs
// expects input connection and database
files.init = function(connArg, dbArg) {

	if(!connArg || !dbArg) throw new Error("conenction and database are required");
	else {

		initialized = true;
		conn = connArg;
		db = dbArg;
		GridStore = conn.mongo.GridStore;
	}
};


// to retrieve files
files.getFile = function(filename, callback) {

	if (!initialized) throw new Error("file module must be initialized before use");
	else if(!filename || !callback) throw new Error("filename and callback are required");
	else {

		var file = new GridStore(db, filename, "r");
		file.open(function(err, gs) {

			if(err) callback(err);
			else {
				var stream = gs.stream(true);
				callback(null, stream);
			}
		});
	}
};


// to save a file
files.saveFile = function(local, filename, contenttype, callback) {

	if(!initialized) throw new Error("file module must be initialized before use");
	else if(!local || !filename || !contenttype || !callback) throw new Error("local, filename, contenttype and callback are required");
	else {

		var file = new GridStore(db, filename, "w", {
			"content_type": contenttype
		});
		
		wow.open(function(err, obj) {

			if(err) callback(err);
			else {
				wow.writeFile(local, function(err, obj) {
					if(err) callback(err);
					else callback(null, obj);
				});
			}
		});
	}
};


// export
module.exports = files;
