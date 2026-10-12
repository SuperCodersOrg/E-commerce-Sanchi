const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cookie_parser = require('cookie-parser');
const router = express.Router();

router.use(cookie_parser());

const authenticated = ((req,res,next)=>{
    const token = req.cookies.Access_Token;

    if(!token){
       res.render("login");
    }

    try{
        const verified = jwt.verify(token,process.env.JWT_SECRET);
        if(verified){
            req.user = verified;
            next();
        }
    }
    catch(error){
        res.render("login");
    }
});

module.exports = authenticated;
