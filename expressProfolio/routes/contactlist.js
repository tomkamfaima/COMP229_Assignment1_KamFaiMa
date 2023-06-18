/*Author: Kam Fai, Ma
Student ID: 301276248
Date:   06/04/2023
Filename: contactlist.js */
var express = require('express');
var router = express.Router();
const mongoose = require('mongoose'); 
const business_contact = require('../models/business_contact')

router.get('/business_contact', (req,res,next) => {
    business_contact.find((err, list) =>{
        if(err){
            return console.error(err);
        }else{
            res.render('business_contact', {title: 'Business Contact', list: list})     
        }
    });
});
module.exports = router;
