const mongoose = require('mongoose')

const account_info_Schema = new mongoose.Schema({
  ame: {
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

module.exports = mongoose.model('account_info', account_info_Schema)