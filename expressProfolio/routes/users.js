/*Author: Kam Fai, Ma
Student ID: 301276248
Date:   06/04/2023
Filename: users.js */
var express = require('express');
var router = express.Router();
const User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post("/register", function (req, res) {
  User.register(new User({ email: req.body.email, username: req.body.username }), req.body.password, function (err, user) {
      if (err) {
          res.json({ success: false, message: "Your account could not be saved. Error: " + err });
      }
      else {
        res.json({ success: true, message: "Your account has been saved" });
      }
  });
});

module.exports = router;
