
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , adminRoutes = require('./routes/admin')
  , apiRoutes = require('./routes/api')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , dauser = { id: 1, username: 'admin' };

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'some random secret damn son - lk2i3lk#opikj#KLj3lkjl' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


// passport configuration
passport.use(new LocalStrategy(function(username, password, done) {
  // TODO: dumb code alert! to be replaced with more secure code!
  if(username === 'admin' && password === 'password') {
    var user = dauser;
    return done(null, user); 
  } 
  else { return done(null, false, { message: 'Incorrect username password combination.' }); }
}));

passport.serializeUser(function(user, done) {
  done(null, dauser.id);
});

passport.deserializeUser(function(id, done) {
  done(null, dauser);
});


// init authentication
app.post('/login', passport.authenticate('local', {
  successRedirect: '/admin',
  failureRedirect: '/login'
}));


// general routes
app.get('/', routes.index);
app.get('/login', routes.login);

// admin routes
app.get('/admin', adminRoutes.index);

// api routes
app.get('/api/test', apiRoutes.test);
app.get('/api/featured', apiRoutes.featured);
app.get('/api/titles', apiRoutes.titles);
app.get('/api/titles/:id', apiRoutes.title);
app.get('/api/movies', apiRoutes.movies);
app.get('/api/tvshows', apiRoutes.tvshows);
app.get('/api/genres/:genre', apiRoutes.genres);
app.get('/api/similar/:id', apiRoutes.similar);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
