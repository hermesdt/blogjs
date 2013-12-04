
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var posts = require('./routes/posts');
var flash = require('connect-flash');

var http = require('http');
var path = require('path');
// var dust = require('dustjs-linkedin');
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
app.use(express.cookieParser());
app.use(flash());
app.use(express.session({secret: "ñkl234ñkj234ñjkl23ñ4klj", key: "session"}));
app.use(express.csrf());
app.use(function(req, res, next){
  res.locals._csrf = req.csrfToken();
  next();
});

/*var loginFilter = function(req, res, next){
  if(req.session.user_id){
    User.findById id, function(err, user){
      
    });
  } else {
  }
};*/

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/posts', posts.index);
app.post('/posts', posts.create);
app.get('/posts/new', posts.new);
app.delete('/posts/:id', posts.destroy);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
