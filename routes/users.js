const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/pinterestDB");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  posts: [
    {
      // referencing to object id of post ( each created object have a unique id )
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
  ],
  dp: {
    type: String // img path
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  fullname: {
    type: String,
    requred: true,
  },
  tagline: {
    type: String
  },
  description: {
    type: String
  }
});

userSchema.plugin(plm);

const User = mongoose.model("User", userSchema);

module.exports = User;
