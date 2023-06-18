/*Author: Kam Fai, Ma
Student ID: 301276248
Date:   06/18/2023
Filename: db.js */
require('dotenv').config();
const mongoose = require('mongoose'); 

mongoose.connect(process.env.DATABASE_URL,{
        useUnifiedTopology:true,
        useNewUrlParser:true
      })
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

module.exports = db;