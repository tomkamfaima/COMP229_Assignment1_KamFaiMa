/*
Author: Kam Fai, Ma
Student ID: 301276248
Date:   06/18/2023
Filename: business_contact.js */
const mongoose = require('mongoose')

//create schema and model for business contact
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