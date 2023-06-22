/*Author: Kam Fai, Ma
Student ID: 301276248
Date:   06/04/2023
Filename: index.js */
var express = require('express');
var router = express.Router();

const Business_contact = require('../models/business_contact')
const User = require('../models/user');
const { render } = require('ejs');

//bcrypt for hashing password
const bcrypt= require('bcrypt');
//jwt for user authentication
const jwt = require('jsonwebtoken')

//_inOut & checkInOut to determine is a user if loggin or not
var _inOut;
function checkInOut(_req){
  const token = _req.cookies.jwt;
  if(token){
    console.log(token);
    jwt.verify(token, process.env.jwtSecret, (err,decodedToken) => {
      if(err){
        res.status(400).json({ message: err.message });
      }else{
        _inOut = "Log Out";
      }
    })
  }else{
    _inOut = "Log In";
  }
  return _inOut;
};

/* GET Home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home', inOut: checkInOut(req) });
});
/* GET About Me page. */
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About Me', inOut:checkInOut(req) });
});
/* GET Project page. */
router.get('/projects', function(req, res, next) {
  res.render('projects', { title: 'Projects', inOut: checkInOut(req) });
});
/* GET Service page. */
router.get('/services', function(req, res, next) {
  res.render('services', { title: 'Services', inOut: checkInOut(req) });
});
/* GET Contact page. */
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact Me', inOut: checkInOut(req) });
});

/* GET Login page. */
router.get('/login', function(req, res, next) {
  //get token from cookies
  const token = req.cookies.jwt;
  if(!token){
  res.render('login', { title: 'Login', inOut: checkInOut(req),logInMessage:'' });}
  else{
    //use jwt.verify to authenticate the token
    jwt.verify(token, process.env.jwtSecret, (err, decodedToken)=> {
      if(err){
        res.render('login', { title: 'Login', inOut: checkInOut(req),logInMessage:'' });
      }else {
        res.redirect('/business_contact');
      }
    })
  }
});

/* POST Login page. */
router.post('/login', async(req, res, next) => {
  try{
    const _email = req.body.email;
    //use mongoose model.findOne to get user by email
    const user = await User.findOne({email:_email});
    if(!user){
      res.render('login', { title: 'Login', inOut: checkInOut(req),logInMessage: 'User Not Found' });
    }else{
        //check password by bcrypt.compare as pw is hased
        bcrypt.compare(req.body.password, user.password, (err, data) => {
          if (err){
            res.status(400).json({
              message: "Error",
              error: err.messagae})
          }
          if (data) {
            //instantiate a toke using jwt.sign
            const maxAge = 3600;
            const token = jwt.sign({
              id:user._id, email: _email}, 
              process.env.jwtSecret,
              {expiresIn: maxAge} //in sec
            );
            //send token
            res.cookie("jwt", token, {
              httpOnly: true,
              maxAge: maxAge*1000 //in ms, need to *1000
            });
              res.redirect('/business_contact');
          } else {
            res.render('login', { title: 'Login', inOut: checkInOut(req),logInMessage:'Incorrect Password' });
          }
      })
  }}catch (err){
    res.status(400).json({
      message: "Error",
      error: err.messagae})
  }
});

/* GET Logout page. */
router.get("/logout", (req, res, next) => {
  const token = req.cookies.jwt;
  if(!token){
    res.redirect("/login")}
  else{
    //remove token
    res.cookie("jwt", "", { maxAge: "0" })
    res.redirect("/")
  }
})

/* GET Add Business Contact page. */
router.get('/addBus', function(req, res, next) {
    const token = req.cookies.jwt;
    if(!token){
      res.render('login', { title: 'Login', inOut: checkInOut(req), logInMessage:''});
    }else{
      jwt.verify(token, process.env.jwtSecret, (err,decodedToken) => {
        if(err){
          res.render('login', { title: 'Login', inOut: checkInOut(req), logInMessage:'' });
        }else{
          res.render('addBus', { title: 'Add New Business Contact', inOut: checkInOut(req)});
        }
      })
    }
});

/* GET Register page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' , inOut: checkInOut(req), regMessage: '' });
});

/* POST Register page. */
router.post("/register", async (req, res, next) =>{
  //hash password by bcrypt.hash
  const hashedPassword = await bcrypt.hash(req.body.password,10);
  const user = new User({
    name : req.body.name,
    email : req.body.email,
    password : hashedPassword
  })
    try {
      const newUser = await user.save()
      res.redirect('/business_contact');
    } catch (err) {
      res.render('register', { title: 'Register' , inOut: checkInOut(req), regMessage: 'Name/ Email already used by an other user'});
    }
});

/* GET Business Contact page. */
router.get('/business_contact', async(req,res,next)=>{
  try{
    //use model.find() to get all business contact in db, sorted bu name
    const contacts = await Business_contact.find().sort("name");
    const token = req.cookies.jwt;
    if(!token){
      res.render('login', { title: 'Login', inOut: checkInOut(req),logInMessage:'' });
    }else{
      //check if user is logged in
      jwt.verify(token, process.env.jwtSecret, (err,decodedToken) => {
        if(err){
          res.render('login', { title: 'Login', inOut: checkInOut(req),logInMessage:'' });
        }else{
          res.render('business_contact', { title: 'Business Contact', contacts:contacts , inOut: checkInOut(req)});
        }
      })
    }
  }catch{
    res.status(500).json({message:err.message});
  }
})

/* POST Add Business Contact page. */
router.post('/addBus', async(req, res, next) => {
  const new_business_contact = new Business_contact({
    name: req.body.name,
    email: req.body.email,
    contact_number: req.body.contact_number
    });
    await new_business_contact.save();
    try{
      res.redirect('/business_contact');
    }catch (err){
      res.status(500).json({message:err.message})
    }
});

/* GET Delete Business Contact page. */
router.get('/delete/:id', async(req,res, next)=>{
  await Business_contact.deleteOne({_id: req.params.id});
  res.redirect('/business_contact');
});

/* GET Update Business Contact page. */
router.get('/update/:id', async(req,res, next)=>{
  try{
    //get the user to be updated by model.fineOne()
  const user = await Business_contact.findOne({_id: req.params.id});
  res.render('update', { title: 'Update', user:user , inOut: checkInOut(req)});
  }catch(err) {
    res.status(500).json({message:err.message})
  }
});

/* POST Update Business Contact page. */
router.post('/update', async(req,res, next) =>{
  const filter = { email: req.body.email };
  const update = {name: req.body.name, contact_number: req.body.contact_number};
  try{
    //get and updte the user by model.findOneAndUpdate()
    const user = await Business_contact.findOneAndUpdate(filter, update, {new: true});
    res.redirect('/business_contact');
  }catch(err){
    res.status(500).json({message:err.message})
  }
});

module.exports = router;
