var assert = require("assert");
var mongoose = require("mongoose");
var should = require("should");

if(mongoose.connection.db == undefined)
  mongoose.connect(process.env.MONGOLAB_URI || "mongodb://localhost/test_blogjs");

var User = require("../../models/user").User;

describe('Users Route', function(){
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
