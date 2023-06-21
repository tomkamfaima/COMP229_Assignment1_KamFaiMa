/*Author: Kam Fai, Ma
Student ID: 301276248
Date:   06/04/2023
Filename: index.js */
var express = require('express');
var router = express.Router();
const bcrypt= require('bcrypt');
const Business_contact = require('../models/business_contact')
const User = require('../models/user');
const { render } = require('ejs');

const jwt = require('jsonwebtoken')
const jwtSecret  = "fef165c39c78bd62f649ea39c0ed24a9192659dcee3aa3ff5ae9ea3e7a4a71d670eaea";
var _inOut;


function checkInOut(_req){
  const token = _req.cookies.jwt;
  if(token){
    console.log(token);
    jwt.verify(token, jwtSecret, (err,decodedToken) => {
      if(err){
        res.status(400).json({ message: err.message });
      }else{
        _inOut = "Log Out";
      }
    })
  }else{
    _inOut = "Log In";
  }
};

/* GET Home page. */
router.get('/', function(req, res, next) {
  checkInOut(req);
  res.render('index', { title: 'Home', inOut: _inOut });
});
/* GET About Me page. */
router.get('/about', function(req, res, next) {
  checkInOut(req);
  res.render('about', { title: 'About Me', inOut: _inOut });
});
/* GET Project page. */
router.get('/projects', function(req, res, next) {
  checkInOut(req);
  res.render('projects', { title: 'Projects', inOut: _inOut });
});
/* GET Service page. */
router.get('/services', function(req, res, next) {
  checkInOut(req);
  res.render('services', { title: 'Services', inOut: _inOut });
});
/* GET Contact page. */
router.get('/contact', function(req, res, next) {
  checkInOut(req);
  res.render('contact', { title: 'Contact Me', inOut: _inOut });
});
router.get('/addBus', function(req, res, next) {
    const token = req.cookies.jwt;
    checkInOut(req);
    if(!token){
      res.render('login', { title: 'Login', inOut: _inOut });
    }else{
      jwt.verify(token, jwtSecret, (err,decodedToken) => {
        if(err){
          res.render('login', { title: 'Login', inOut: _inOut });
        }else{
          res.render('addBus', { title: 'Add New Business Contact', inOut: _inOut });
        }
      })
    }
});

/* GET Login page. */
router.get('/login', function(req, res, next) {
  const token = req.cookies.jwt;
  checkInOut(req);
  if(!token){
  res.render('login', { title: 'Login', inOut: _inOut });}
  else{
    jwt.verify(token, jwtSecret, (err, decodedToken)=> {
      if(err){
        res.render('login', { title: 'Login', inOut: _inOut });
      }else {
        res.redirect('/business_contact');
      }
    })
  }
});
/* GET Register page. */
router.get('/register', function(req, res, next) {
  checkInOut(req);
  res.render('register', { title: 'Register' , inOut: _inOut});
});

router.get('/business_contact', async(req,res,next)=>{
  checkInOut(req);
  try{
    const contacts = await Business_contact.find().sort("name");
    const token = req.cookies.jwt;
    if(!token){
      res.render('login', { title: 'Login', inOut: _inOut });
    }else{
      jwt.verify(token, jwtSecret, (err,decodedToken) => {
        if(err){
          res.render('login', { title: 'Login', inOut: _inOut });
        }else{
          res.render('business_contact', { title: 'Business Contact', contacts:contacts , inOut: _inOut});
        }
      })
    }
  }catch{
    res.status(500).json({message:err.message});
  }
})

router.get('/update/:id', async(req,res)=>{
  checkInOut(req);
  try{
  const user = await Business_contact.findOne({_id: req.params.id});
  res.render('update', { title: 'Update', user:user , inOut: _inOut});
  }catch(err) {
    res.status(500).json({message:err.message})
  }
});

router.post('/update', async(req,res) =>{
  const filter = { email: req.body.email };
  const update = {name: req.body.name, contact_number: req.body.contact_number};
  try{
    const user = await Business_contact.findOneAndUpdate(filter, update, {new: true});
    res.redirect('/business_contact');
  }catch(err){
    res.status(500).json({message:err.message})
  }
});

router.post('/addBus', async(req, res, next) => {
  const new_business_contact = new Business_contact({
    name: req.body.name,
    email: req.body.email,
    contact_number: req.body.contact_number
    });
    new_business_contact.save();
    try{
      res.redirect('/business_contact');
    }catch (err){
      res.status(500).json({message:err.message})
    }
});
router.post('/login', async(req, res, next) => {
    try{
      const _email = req.body.email;
      const user = await User.findOne({email:_email});
      if(!user){
        res.status(400).json({
          messagae: "Login fails",
          error: "User not found"
        })}else{
          bcrypt.compare(req.body.password, user.password, (err, data) => {
            if (err){
              res.status(400).json({
                message: "Error",
                error: err.messagae})
            }
            if (data) {
              const maxAge = 3600;
              const token = jwt.sign({
                id:user._id, email: _email}, jwtSecret,{expiresIn: maxAge}
              );
              res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: maxAge*1000
              });
                res.redirect('/business_contact');
            } else {
                res.redirect('/login');
            }
        })
    }}catch (err){
      res.status(400).json({
        message: "Error",
        error: err.messagae})
    }
});

router.get("/logout", (req, res) => {
  const token = req.cookies.jwt;
  if(!token){
    res.redirect("/login")}
  else{
    res.cookie("jwt", "", { maxAge: "0" })
    res.redirect("/")
  }
})

module.exports = router;
