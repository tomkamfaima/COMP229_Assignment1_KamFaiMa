/*Author: Kam Fai, Ma
Student ID: 301276248
Date:   06/04/2023
Filename: app.js */
require('dotenv').config();

//third parties dependencies
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();

//for authenication
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')


//routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//extract data from form
app.use(express.urlencoded({extended:false}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//setup db
require('dotenv').config();
const mongoose = require('mongoose'); 
const Business_contact = require('./models/business_contact');
const User = require('./models/user');

mongoose.connect("mongodb+srv://new_user:comp229@cluster93385.si1n2vb.mongodb.net/?retryWrites=true&w=majority",{
        useUnifiedTopology:true,
        useNewUrlParser:true
      })
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));


app.get('/business_contact', checkAuthenticated, (req, res) => {
  res.render('business_contact.ejs', { name: req.user.name })
})

const initializePassport = require('./passport-config');
initializePassport(
  passport,
  email => User.find(User => User.email === email),
  id => User.find(User => User.id === id)
)

app.use(session({
  secret: "SomeSecret",
  resave: false,
  saveUninitialized: false
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/login',  (req, res) => {
  res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/business_contact',
  failureRedirect: '/register',
  failureFlash: true
}))
/*
app.get('/register', (req, res) => {
  res.render('register.ejs')
})*/
/*
app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
      });
  } catch (err){
    console.log(err);
  }
})*/

app.post("/register", async (req, res) =>{
  const hashedPassword = await bcrypt.hash(req.body.password,10);
  const user = new User({
    name : req.body.name,
    email : req.body.email,
    password : hashedPassword
  })
    try {
      const newUser = await user.save()
      res.status(201).json(newUser)
      redirect('/business_contact');
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
});


app.post('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

app.get('/delete/:id', async(req,res)=>{
  await Business_contact.deleteOne({_id: req.params.id});
  res.redirect('/business_contact');
});
app.get('/update/:id', async(req,res)=>{
  await Business_contact.deleteOne({_id: req.params.id});
  res.redirect('/update');
});

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("success");
    return res.redirect('/business_contact')
  }
  next()
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(3001);
module.exports = app;
