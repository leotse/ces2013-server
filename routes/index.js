// dependencies
var models = require('../models');


exports.index = function(req, res) {
	res.render('index');
};


exports.login = function(req, res) {
	res.render('login');
};

exports.test = function(req, res) {

	models.getFile('wer.jpg', function(err, stream) {
		if(err) {
			console.log('===== error occured in test method =====');
			console.log(err);
		}
		else stream.pipe(res);
	});
};