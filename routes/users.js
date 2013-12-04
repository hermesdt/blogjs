var User = require("../models/user").User;

exports.new = function(req, res){
  var user = new User();
  res.render('users/new', {user: user});
};

exports.create = function(req, res){
  var _user = new User(req.body.user);
  _user.save(function(err, user){
    if(err){
      res.render('users/new', {errors: err, user: _user});
    }else{
      req.flash("success", "Successful");
      req.session.user_id = user.id;
      res.redirect("/");
    }
  });
};

