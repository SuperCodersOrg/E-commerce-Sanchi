const mongoose = require('mongoose');

const cart = new mongoose.Schema({
    userId : {
        type : String
    },
    image : {
        type : String
    },
    name : {
        type : String,
        maxLength : 50,
        required : true,
        trim : true
    },
    description : {
        type : String,
        maxLength : 500,
    },
    category : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        min : 0
    },
    quantity : {
        type : Number,
        default : 1,
        min : 1
    }
});

module.exports = mongoose.model('CartProducts',cart);