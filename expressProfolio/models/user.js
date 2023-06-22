/*
Author: Kam Fai, Ma
Student ID: 301276248
Date:   06/18/2023
Filename: user.js */
const mongoose = require('mongoose')

//create schema and model for user
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
  },
  password: {
    type: String,
    required: true
  }
},
{
  collection : '_user'
});


module.exports = mongoose.model('User', userSchema);

