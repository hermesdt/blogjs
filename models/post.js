var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var postSchema = new Schema({
  title:  {type: String, required: true},
  body:   {type: String, required: true},
  comments: [{ body: String, date: Date }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

postSchema.pre("save", function(next){
  this.updated_at = new Date;
  if ( !this.created_at ) {
    this.created_at = new Date;
  }
  
  next();
});

exports.Post = mongoose.model('Post', postSchema);
