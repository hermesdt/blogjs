var mongoose = require("mongoose");
if(mongoose.connection.db == undefined)
  mongoose.connect(process.env.MONGOLAB_URI || "mongodb://localhost/test_blogjs");

var request = require('supertest')
  , express = require('express')
  , app = require("../../app").app;

var assert = require("assert");
var should = require("should");


var User = require("../../models/user").User;

describe('Users Route', function(){
  /*beforeEach(function(done){
    User.remove(done);
  });*/

  it("new user must be created", function(done){
    request(app).get("/users/new").expect(200).end(function(err, res, req){

      var _user = new User({email: "gmail@gmail.com", password: "password"});
      _user.save(function(err, user){
        
        var csrf = res.headers["x-csrf-token"];
        request(app).post("/users").
          send({_csrf: csrf, user: {email: _user.email, password: _user.password}}).
          set("Cookie", res.headers["set-cookie"]).
          expect(200).
          end(function(err, res){
            if(err) return done(err);
            User.findOne({email: _user.email}, function(err, user){
              if(err) return done(err);
              should.exists(user);
              done();
            });
          });
      });
    });
  });
});
