/*Author: Kam Fai, Ma
Student ID: 301276248
Date:   06/04/2023
Filename: index.js */
var express = require('express');
var router = express.Router();
const bcrypt= require('bcrypt');
const Business_contact = require('../models/business_contact')
const User = require('../models/user');

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

router.get('/update', function(req, res, next) {
  res.render('update', { title: 'Update' });
});


/* GET Login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});
/* GET Register page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

router.post('/register', (req,res) =>{
    const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
    });
    newUser.save()
});

router.post('/update', (req,res) =>{
    const new_business_contact = new Business_contact({
      name: req.body.name,
      email: req.body.email,
      contact_number: req.body.contact_number
      });
  new_business_contact.save()
  return res.status(200).json({msg:new_business_contact})
});

const getAllContact = async (req,res)=> {
  const contacts = await Business_contact.find();
  res.json(contacts);
}

router.get('/business_contact', async (req,res, next)=>{
  try{
      const contacts = await Business_contact.find();
      res.render('business_contact', { title: 'Business Contact', contacts:contacts });
  }catch (err){
      res.status(500).json({message:err.message})
  }
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