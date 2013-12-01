var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/blogjs");
var Schema = mongoose.Schema;

var postSchema = new Schema({
  // title:  {type: String, validate: presenceValidator},
  title:  String,
  body:   {type: String, required: true},
  // comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
});

exports.Post = mongoose.model('Post', postSchema);
