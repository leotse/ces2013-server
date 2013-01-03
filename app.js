
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , apiRoutes = require('./routes/api')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

// api routes
app.get('/api/test', apiRoutes.test);
//app.get('/api/featured', apiRoutes.featured);
app.get('/api/titles', apiRoutes.titles);
app.get('/api/titles/:id', apiRoutes.title);
app.get('/api/movies', apiRoutes.movies);
app.get('/api/tvshows', apiRoutes.tvshows);
app.get('/api/genres/:genre', apiRoutes.genres);
app.get('/api/similar/:id', apiRoutes.similar);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
