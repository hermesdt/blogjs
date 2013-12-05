var mongoose = require('mongoose');
var crypto = require("crypto");

var Schema = mongoose.Schema;

function generateSalt(){
  return crypto.randomBytes(128).toString("base64")
}

function generateDerivedKey(password, salt, fn){
  crypto.pbkdf2(password, salt, 1000, 512, fn);
}

var userSchema = new Schema({
  email: {type: String, required: true, index: {unique: true}, validate: /@/},
  password: {type: String},
  encryptedPassword: {type: String, required: false},
  salt: {type: String, required: false},
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

userSchema.pre("save", function(next){
  this.updated_at = new Date;
  if ( !this.created_at ) {
    this.created_at = new Date;
  }
  
  next();
});

userSchema.pre("save", function(next){
  var self = this;
  if(this.salt == undefined && this.password != undefined){
    this.generatePassword(this.password, function(err){
      // console.log("password generated for user: "+self.id);

      if(err) next(err);
      next();
    });
  }else{
    next();
  }
});

userSchema.methods.generatePassword = function(password, fn){
  var self = this;
  self.salt = generateSalt();
  generateDerivedKey(password, self.salt, function(err, derivedKey){
    self.encryptedPassword = derivedKey.toString("base64");
    fn(err);
  });
};

userSchema.methods.authenticate = function(password, fn){
  var self = this;

  generateDerivedKey(password, self.salt, function(err, derivedKey){
    if(self.encryptedPassword == derivedKey.toString("base64")){
      fn(null, self);
    }else{
      fn(new Error("Invalid password"), null);
    }
  });
};

userSchema.static("authenticate", function(email, password, fn){
  this.findOne({email: email}, function(err, user){
    if(err) return fn(err, null);
    if(user == null) return fn(new Error("User not found"), null);
    user.authenticate(password, fn);
  });
});

exports.User = mongoose.model('User', userSchema);
