
exports.index = function(req, res) {
	res.render('admin');
};

exports.uploadPage = function(req, res) {
	res.render('upload');
};

exports.upload = function(req, res) {
	res.send(req.files);
};
