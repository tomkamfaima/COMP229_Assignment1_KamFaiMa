const mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
})
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema)

