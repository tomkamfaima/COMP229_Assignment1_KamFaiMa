/*Author: Kam Fai, Ma
Student ID: 301276248
Date:   06/04/2023
Filename: app.js */

//Get value stored in .env
require('dotenv').config();

//third parties dependencies
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();


//for authenication
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

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
const mongoose = require('mongoose'); 
const Business_contact = require('./models/business_contact');
const User = require('./models/user');

//connect to db, using DB_URL from .env
mongoose.connect(process.env.DB_URL,{
        useUnifiedTopology:true,
        useNewUrlParser:true
      })
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

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
