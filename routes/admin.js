// dependencies
var _ = require('underscore')
,	fs = require('fs')
,	mime = require('mime')
,	async = require('async')
,	helpers = require('../helpers')
,	models = require('../models')
,	GridFS = models.GridFS;


exports.index = function(req, res) {
	res.render('admin');
};

exports.uploadPage = function(req, res) {
	res.render('upload');
};

exports.upload = function(req, res) {
	var files = req.files;

	// error checking
	if(!files || Object.keys(files).length !== 2) helpers.sendError(res, new Error("i am expecting 2 files!"));
	else {

		// save the files to gridfs
		saveUploadedFiles(files, function(err, saved) {
			if(err) {
				helpers.sendError(res, err);
				console.log("===== error occurred while saving files =====");
				console.log(err);
			} else {

				helpers.send(res, 'done');

				// finally delete the files!
				deleteUploadedFiles(files);

			}
		});
	}
};


/////////////
// Helpers //
/////////////

function saveUploadedFiles(uploadedFiles, callback) {

	var files = null
	,	background = uploadedFiles.background
	,	logo = uploadedFiles.logo;

	var files = [{
		path: ".\\" + background.path,
		filename: "background",
		contentType: background.mime
	}, {
		path: ".\\" + logo.path,
		filename: "logo",
		contentType: logo.mime
	}];

	// save all files!
	async.each(files, saveFile, function(err) {
		if(err) callback(err);
		else callback();
	});

	function saveFile(file, done) {
		var path = file.path
		,	filename = file.filename
		,	contentType = file.contentType;

		GridFS.saveFile(path, filename, contentType, function(err, saved) {
			if(err) done(err);
			else done(null, saved);
		});
	}
}

function deleteUploadedFiles(uploadedFiles) {

	// map the files to an array
	var files = _.map(uploadedFiles, function(value, key) {
		return value;
	});

	// delete all files!
	async.each(files, deleteFile, function(err) {
		if(err) { 
			console.log("===== error occurred while deleting files =====");
			console.log(err);
		}
	});

	function deleteFile(file, done) {
		var path = '.\\' + file.path;
		fs.unlink(path, function(err) {

			// report deletion is completed!
			if(err) done(err);
			else done();
		});
	}
}
