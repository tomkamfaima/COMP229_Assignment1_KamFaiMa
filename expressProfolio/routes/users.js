/*Author: Kam Fai, Ma
Student ID: 301276248
Date:   06/04/2023
Filename: users.js */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
