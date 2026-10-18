const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cookie_parser = require('cookie-parser');
const router = express.Router();

router.use(cookie_parser());

const authenticated = ((req,res,next)=>{
    const token = req.cookies.Access_Token;

    if(!token){
       return res.redirect('/login');
    }

    try{
        const verified = jwt.verify(token,process.env.JWT_SECRET);
        if(verified){
            req.user = verified;
            res.locals.name = verified.name;
            next();
        }
    }
    catch(error){
        res.clearCookie('Access_Token');
        return res.redirect('/login');
    }
});

module.exports = authenticated;
