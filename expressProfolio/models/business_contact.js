const mongoose = require('mongoose')

const business_contact_Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  contact_number: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('business_contact', business_contact_Schema)