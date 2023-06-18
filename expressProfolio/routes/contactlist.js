/*Author: Kam Fai, Ma
Student ID: 301276248
Date:   06/04/2023
Filename: contactlist.js */
var express = require('express');
var router = express.Router();
const mongoose = require('mongoose'); 
const business_contact = require('../models/business_contact')

router.get('/', (req,res,next) => {
    business_contact.find((err, list) =>{
        if(err){
            return console.error(err);
        }else{
            console.log(list);
        }
    });
});
module.exports = router;
