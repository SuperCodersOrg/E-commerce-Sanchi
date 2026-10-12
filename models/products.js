const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
        name : {
            type : String,
            maxLength : 50,
            required : true,
            trim : true
        },
        image : {
            type : String,
            required : true
        },
        title : {
            type : String,
            maxLength : 200,
            trim : true
        },
        description : {
            type : String,
            maxLength : 200,
            trim : true
        },
        price : {
            type : Number,
            min : 0
        },
        category : {
            type : String,
            required : true
        },
        brand : {
            type : String
        },
        size : {
            type : [String]
        }
});

module.exports = mongoose.model('Product',productSchema);