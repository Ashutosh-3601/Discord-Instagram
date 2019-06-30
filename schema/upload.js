const mongoose = require('mongoose');

const uploadSchema = mongoose.Schema({
  id: String,
  url: String,
  likes: Array,
})

module.exports = mongoose.model('uploadSchema', uploadSchema);
