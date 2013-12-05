var assert = require("assert");
var mongoose = require("mongoose");
var should = require("should");

if(mongoose.connection.db == undefined)
  mongoose.connect(process.env.MONGOLAB_URI || "mongodb://localhost/test_blogjs");

var User = require("../../models/user").User;

function validUser(){
  var user = new User({email: "email@gmail.com", password: "password"});
  return user;
}


describe('User', function(){
  beforeEach(function(done){
    User.remove(done);
  });

  it("should assign salt on pre.save middle if password present", function(done){
    var user = validUser();
    user.save(function(err, user){
      if(err) return done(err);
      
      user.should.have.property("salt");
      done();
    });
  });

  it("should not assign salt on pre.save middle because password is not present", function(done){
    var user = new User({email: "email@"});
    user.save(function(err, user){
      if(err) return done(err);
      
      user.should.not.have.property("salt");
      done();
    });
  });

  it("should not save user because email is not present", function(done){
    var user = new User({});
    user.save(function(err, user){
      should(err).have.property("name", "ValidationError");
      should(err.errors.email).have.property("type", "required");
      
      done();
    });
  });
});
