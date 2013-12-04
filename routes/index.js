var User = require("../models/user").User;

/*
 * GET home page.
 */

exports.index = function(req, res){
  User.find({}, {id: 1, email: 1}, function(err, users){
    if(err) users = [];
    res.render('index', { title: 'Express', users: users});
  });
};
