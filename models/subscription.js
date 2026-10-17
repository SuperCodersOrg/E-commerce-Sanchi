const mongoose = require('mongoose');

const subscription = new mongoose.Schema({
    name : {
        type : String
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    plan : {
        type : String,
        enum : [
            'Essential',
            'Premium'
        ]
    },
    price : {
        type : Number,
        required : true
    },
    paymentStatus : {
        type : String,
        enum : [
            'paid',
            'pending',
            'failed'
        ],
        default : 'pending'
    },
    credits : {
        type : Number,
        min : 10
    },
    razorpayOrderId : {
        type : String,
        required : true
    },
    activatedAt: {
        type: Date,
        default: null
    },
    expiresAt: {
        type: Date,
        default: null
    }
},{
        timestamps : true
});

module.exports = mongoose.model('SubscriptionSchema',subscription);