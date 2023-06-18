const mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose');

const account_info_Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

account_info_Schema.plugin(passportLocalMongoose);

module.exports = mongoose.model('account_info', account_info_Schema)