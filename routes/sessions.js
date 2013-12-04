var User = require("../models/user").User;

exports.new = function(req, res){
  var user = new User();
  res.render('sessions/new', {user: user});
};

exports.create = function(req, res){
  req.body.user.email
  User.authenticate(req.body.user.email, req.body.user.password, function(err, user){
    if(err) return res.redirect("/sessions/new");
    req.session.user_id = user.id;
    res.redirect("/");
  });
};

exports.destroy = function(req, res){
  req.session = null;
  res.redirect("/");
};
