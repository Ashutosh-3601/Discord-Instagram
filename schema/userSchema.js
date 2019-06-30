const Mongoose = require('mongoose');

const userSchema = Mongoose.Schema({
  _id: String,
  intro: String,
  uploads: Array,
  followers: Array,
  verified: { type: Boolean, default: false }
});

module.exports = Mongoose.model('userSchema', userSchema)
