var Post = require("../models/post").Post;

exports.checkAuthorized = function (req, res, next){
  if(req.params.user_id == req.session.user_id){
    next();
  }else{
    console.log("filtered at checkauthorized. redirected to /");
    res.redirect("/");
  }
};

/* GET /posts */
exports.index = function(req, res){
  Post.find({author_id: req.params.user_id}, function(err, docs){
    res.render('posts/index', {posts: docs, user_id: req.params.user_id});
  });
};

exports.new = function(req, res){
  var post = new Post({});
  res.render('posts/new', {post: post});
};

/* POST /posts */
exports.create = function(req, res){
  var params = req.body.post;
  params.author_id = req.session.user_id;
  var _post = new Post(params);

  _post.save(function(err, post, numberAffected){
    res_data = {};
    if(err){
      res.render('posts/new', {post: _post, errors: err});
    }else{
      res.redirect("/blog/"+req.session.user_id+"/posts");
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
        else
          res.redirect("/blog/"+req.session.user_id+"/posts");
      });
    }else{
      res.send(500);
    }
  });
};
