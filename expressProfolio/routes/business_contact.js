/*Author: Kam Fai, Ma
Student ID: 301276248
Date:   06/18/2023
Filename: contactList.js */
var express = require('express');
var router = express.Router();
const Business_contact = require('../models/business_contact')

//Getting all contacts
router.get('/', async (req,res)=>{
    try{
        const contacts = await Business_contact.find()
        res.json(contacts)
    }catch (err){
        res.status(500).json({message:err.message})
    }
});

module.exports = router;