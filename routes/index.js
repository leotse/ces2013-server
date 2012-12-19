
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'ces2013 api' });
};