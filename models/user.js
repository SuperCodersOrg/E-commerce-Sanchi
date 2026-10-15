const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        trim : true,
        maxLength : 50,
    },
    email : {
        type : String,
        trim : true,
        maxLength : 50,
        unique : true
    },
    password : {
        type : String,
        min : 1,
    },
    isAdmin : {
        type : Boolean,
        default : false
    },
    isBuyer : {
        type : Boolean,
        default : true
    },
    verificationtoken: String,
    verificationtokenExpiry: Number,
    resetToken: String,
    tokenExpiresAt: Number
});

module.exports = mongoose.model('User',userSchema);