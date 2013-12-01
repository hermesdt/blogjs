var Post = require("../models/post").Post;

/* GET /posts */
exports.index = function(req, res){
  var new_post = new Post({title: "Nuevo"});
  Post.find({}, function(err, docs){
    res.render('posts/index', {posts: docs, new_post: new_post});
  });

  // res.render('posts/index', {posts: Post.find({}), new_post: new_post});
};

/* POST /posts */
exports.create = function(req, res){
  var _post = new Post(req.body.post);

  _post.save(function(err, post, numberAffected){
    res_data = {};
    if(err){
      Post.find({}, function(err, docs){
        res.render('posts/index', {posts: docs, new_post: _post});
      });
    }else{
      res.redirect("/posts");
    }
  });
};
