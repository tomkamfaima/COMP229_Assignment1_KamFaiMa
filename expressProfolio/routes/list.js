/*Author: Kam Fai, Ma
Student ID: 301276248
Date:   06/18/2023
Filename: list.js */
var express = require('express');
var router = express.Router();
const Business_contact = require('../models/business_contact')

router.get('/', (req,res,next) =>{
    Business_contact.find((err,Business_contactList) => {
        if(err){
            return console.error(err);
        }else{
            console.log(Business_contactList);
        }
    })
})

module.exports = router;