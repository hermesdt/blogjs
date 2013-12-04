
/**
 * Module dependencies.
 */

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/blogjs");
var User = require("./models/user").User;

var express = require('express');
var routes = require('./routes');
var users = require('./routes/users');
var sessions = require('./routes/sessions');
var posts = require('./routes/posts');
var flash = require('connect-flash');

var http = require('http');
var path = require('path');
var consolidate = require("consolidate");

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'dust');
app.engine('dust', consolidate.dust);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser("ñlkjasdjfskjfsf"));
app.use(express.cookieSession({ secret: "heyhey!", key: "session", cookie: {maxAge: 365 * 24 * 60 * 60 * 1000}}));
app.use(express.csrf());
app.use(flash());
app.use(function(req, res, next){
  res.locals._csrf = req.csrfToken();

  User.findById(req.session.user_id, function(err, user){
    res.locals.currentUser = user;
    next();
  });
});

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var loginFilter = function (req, res, next){
  if(res.locals.currentUser){
    next();
  }else{
    req.flash("info", "Not logged in");
    res.redirect("/");
  }
};
var redirectIfLoggedIn = function(req, res, next){
  if(res.locals.currentUser){
    req.flash("info", "Already logged in");
    res.redirect("/");
  }else{
    next();
  }
}

app.get('/', routes.index);

app.get('/users/new', redirectIfLoggedIn, users.new);
app.post('/users', users.create);

app.get('/sessions/new', redirectIfLoggedIn, sessions.new);
app.post('/sessions', redirectIfLoggedIn, sessions.create);
app.delete('/sessions', loginFilter, sessions.destroy);

app.get('/blog/:user_id/posts', posts.index);
app.post('/blog/:user_id/posts', loginFilter, posts.checkAuthorized, posts.create);
app.get('/blog/:user_id/posts/new', loginFilter, posts.checkAuthorized, posts.new);
app.delete('/blog/:user_id/posts/:id', loginFilter, posts.checkAuthorized, posts.destroy);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
