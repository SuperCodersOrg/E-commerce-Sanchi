const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        trim : true,
        // required : [ true , 'Provide your name'],
        maxLength : 50,
        // isAdmin : false
    },
    email : {
        type : String,
        // required : [true , 'Provide your email'],
        trim : true,
        maxLength : 50,
        // unique : true,
        // isAdmin : false
    },
    password : {
        type : String,
        min : 1,
        // required : [true , 'Provide your age'],
        // isAdmin : false
    },
    verificationtoken: String,
    verificationtokenExpiry: Number,
    resetToken: String,
    tokenExpiresAt: Number
});

module.exports = mongoose.model('User',userSchema);