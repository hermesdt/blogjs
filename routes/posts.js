var Post = require("./models/post").Post;

/* GET /posts */
exports.index = function(req, res){
  // res.render('posts/index', {posts: [{title: 'titulo 1'}]});
  res.render('posts/index', {posts: []});
};

/* POST /posts */
exports.create = function(req, res){
  var post = new Post(req.query.post);

  res.end();
};
