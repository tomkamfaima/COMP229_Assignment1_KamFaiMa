/*Author: Kam Fai, Ma
Student ID: 301276248
Date:   06/04/2023
Filename: index.js */
var express = require('express');
var router = express.Router();
const bcrpyt = require('bcrpyt');
//extract data from form
app.use(express.urlencoded({extended:false}))

const business_contact = require('../models/business_contact')
const account_info = require('../models/account_info')

/* GET Home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

/* GET About Me page. */
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About Me' });
});
/* GET Project page. */
router.get('/projects', function(req, res, next) {
  res.render('projects', { title: 'Projects' });
});
/* GET Service page. */
router.get('/services', function(req, res, next) {
  res.render('services', { title: 'Services' });
});
/* GET Contact page. */
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact Me' });
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});
router.get('/business_contact', function(req, res, next) {
  res.render('business_contact', { title: 'Business Contact' });
});

module.exports = router;

//dotenv, express, bcrypt,passport,express-flash,express-session,method-override, passport-local
//const bcrpyt = require('bcrpyt');
//const initializePassport
//passport config at root 
// npm install bcrpty passport...
//view-engine ejs
//extract data from form: app.use(express.urlencoded({extended:false}))
//flash
// get (visti the url)request and post (entering id and pw and click login)request for loging
//repeat password
//hashed password
//app.post for logout instead of app.delete 