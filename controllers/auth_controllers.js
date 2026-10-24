const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const crypto = require('crypto');
const cookie_parser = require('cookie-parser');
const bcrypt = require('bcrypt');
require('dotenv').config();
const User = require('../models/user');
const { sendEmail } = require('../config/mailjet.js');

router.use(express.json());
router.use(express.urlencoded({ extended : true }));
router.use(cookie_parser());

router.get('/login', (req, res) => {
    return res.render('login', {
        syncCart: req.query.syncCart === '1'
    });
});

router.get('/signin',(req,res)=>{
    res.render("signin");
});

router.get('/forget-password',(req,res)=>{
    res.render("forget-password");
});

router.get('/reset-password/:token',(req,res)=>{
    if(req.params.token){
        res.render('reset', { token: req.params.token });
    }
    else{
        return res.send('Token could not find');
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('Access_Token');
    res.redirect('/login');
});

router.get('/verify/:email/:token',(req,res)=>{
    res.render('verify' , { email : req.params.email , token : req.params.token });
});

router.post('/login', async (req,res)=>{
    const { name , email , password } = req.body;

    if(!name || !email || !password){
        return res.send('Please fill out all the details');
    }

    const user = await User.findOne({ email , isAdmin : true });
    if(user){

        const ACCESS_TOKEN = jwt.sign(
            { name : user.name , email : user.email , _id : user._id },
            process.env.JWT_SECRET,
            { expiresIn : '2h' }
        );

        res.cookie('ADMIN_Access_Token',ACCESS_TOKEN,{
            httpOnly : true
        });

        return res.redirect('/admin-dashboard',);
    }

    const existingUser = await User.findOne({ email });
    if(!existingUser){
        return res.send(`Wrong details`);
    }

    const isMatch = await bcrypt.compare(
        password,
        existingUser.password
    );
    if(!isMatch){
        return res.send('Wrong details');
    }

    const ACCESS_TOKEN = jwt.sign(
        { name : existingUser.name , email : existingUser.email , _id : existingUser._id },
        process.env.JWT_SECRET,
        { expiresIn : '2h' }
    );

    res.cookie('Access_Token',ACCESS_TOKEN,{
        httpOnly : true
    });

    if (req.body.syncCart === '1') {
        return res.redirect('/?syncCart=1');
    }      
    res.redirect(`/dashboard`);
});

router.post('/signin',async (req,res)=>{
    const { email } = req.body;

    if(!email){
        return res.send('Please provide your email');
    }

    const existingUser = await User.findOne({ email });

    if(existingUser){
        return res.send(`User already exists`);
    }

    const verificationtoken = crypto.randomBytes(32).toString('hex');
    const verificationtokenExpiry = Date.now() + 10 * 60 * 1000;

    const verificationLink = `http://localhost:${process.env.PORT}/verify/${email}/${verificationtoken}`

    await User.create({
        email,
        verificationtoken,
        verificationtokenExpiry
    });

    try {
        const result = await sendEmail(
            email,
            'Email verification',
            `Please verify your VELNORA account: ${verificationLink}`,
            `<h1>Verify your VELNORA account</h1>
            <p>Click below to verify your email:</p>
            <a href="${verificationLink}">Verify Email</a>`
        );
        console.log(result);
        return res.send('Verification email sent successfully. Please check your inbox.');
    }catch(error){
        await User.deleteOne({
            email,
            verificationtoken,
            verificationtokenExpiry
        })
        return res.status(500).send(error);
    }
});

router.post('/verify/:email/:token',async (req,res)=>{
    const email = req.params.email;

    const { name , password } = req.body;

    if(!name || !password){
        return res.send('Please fill all fields');
    }

    const existingUser = await User.findOne({ email ,
        verificationtoken : req.params.token,
        verificationtokenExpiry : { $gt : Date.now() }
    });

    if(!existingUser){
        return res.send('Email is not valid');
    }
    existingUser.email = email;
    existingUser.name = name;
    existingUser.password = await bcrypt.hash(password,10);
    existingUser.verificationtoken = undefined;
    existingUser.verificationtokenExpiry = undefined;

    await existingUser.save();

    res.render('login');

});

router.post('/forget-password',async (req,res)=>{
    const { email : recipient_email } = req.body;
   
    if(!recipient_email){
        return res.send('Please provide email');
    }

    const existingUser = await User.findOne({ email : recipient_email });

    if(!existingUser){
        return res.send("Sorry, user doesn't exist");
    }

    const tokenn = crypto.randomBytes(32).toString('hex');
    const resetLink = `http://localhost:${process.env.PORT}/reset-password/${tokenn}`;

    existingUser.resetToken = tokenn;
    existingUser.tokenExpiresAt = Date.now() + 10 * 60 * 1000;

    await existingUser.save();

    try{
        const result = await sendEmail(
            recipient_email,
            'Reset Your VELNORA Password',
            `Reset your password for ${resetLink}`,
            `<h1>RESET your password for VELNORA account</h1>
            <p>Click below to change your password:</p>
            <a href="${resetLink}">Reset Password</a>`
        )
        console.log(result);
        return res.send('Verification email sent successfully. Please check your inbox.');
    }catch(error){
        existingUser.resetToken = undefined;
        existingUser.tokenExpiresAt = undefined

        await existingUser.save();

        return res.send("Couldn't reset your password");
    }
});

router.post('/reset-password/:token',async (req,res)=>{
    const { newPass , confirmPass } = req.body;
    
    if(!newPass || !confirmPass){
        return res.send("Please enter both the fields");
    }

    if(newPass != confirmPass){
        return res.send("OOPS! There's an issue. Please check your both passwords");
    }

    const existingUser = await User.findOne({
        resetToken : req.params.token,
        tokenExpiresAt : { $gt : Date.now() }
     });
 
    if(existingUser){
        existingUser.password = await bcrypt.hash(newPass,10);
        existingUser.resetToken = undefined;
        existingUser.tokenExpiresAt = undefined;

        await existingUser.save();
        return res.redirect('/login');
    }
    else{
        return res.send('Invalid or expired reset link');
    }

});



module.exports = router;