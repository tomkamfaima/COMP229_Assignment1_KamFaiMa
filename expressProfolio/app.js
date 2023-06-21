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
const jwt = require('jsonwebtoken')
const jwtSecret  = "fef165c39c78bd62f649ea39c0ed24a9192659dcee3aa3ff5ae9ea3e7a4a71d670eaea";


//for authenication
const bcrypt = require('bcrypt')


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

app.post("/register", async (req, res) =>{
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
      res.status(400).json({ message: err.message })
    }
});



app.get('/delete/:id', async(req,res)=>{
  await Business_contact.deleteOne({_id: req.params.id});
  res.redirect('/business_contact');
});

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
