var Post = require("../models/post").Post;

/* GET /posts */
exports.index = function(req, res){
  Post.find({}, function(err, docs){
    res.render('posts/index', {posts: docs});
  });
};

exports.new = function(req, res){
  var post = new Post({});
  res.render('posts/new', {post: post});
};

/* POST /posts */
exports.create = function(req, res){
  var _post = new Post(req.body.post);

  _post.save(function(err, post, numberAffected){
    res_data = {};
    if(err){
      res.render('posts/new', {post: _post, errors: err});
    }else{
      res.redirect("/posts");
    }
  });
};

/* DELETE */
exports.destroy = function(req, res){
  var handleError = function (err){
    res.write(err);
  };

  Post.findById(req.params.id, function(err, post){
    if(err){
      handleError(err);
    }else if(post){
      post.remove(function(err, post){
        if(err) handleError(err);
        else res.redirect("/posts");
      });
    }else{
      res.send(500);
    }
  });
};
