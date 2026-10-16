const mongoose =  require('mongoose');

const orderSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        required : true
    },
    items : [
        {
            productId : {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'Product',
                required : true
            },
            quantity : {
                type : Number,
                required : true,
                min : 1
            },
            price : {
                type : Number,
                required : true
            }
        }
    ],
    totalAmount : {
        type : Number
    },
    shippingAddress: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true }
    },
    paymentMethod : {
        type : String,
        enum : [
            'COD',
            'RAZORPAY'
        ],
        default : 'COD'
    },
    razorpayOrderId : {
        type : String
    },
    razorpayPaymentId : {
        type : String
    },
    paymentStatus : {
        type : String,
        enum : [
            'pending',
            'paid',
            'failed'
        ],
        default : 'pending'
    },
    orderStatus : {
        type : String,
        enum: [
            'pending',
            'confirmed',
            'shipped',
            'delivered',
            'cancelled'
        ],
        default : 'pending'
    }
},
    {
        timestamps : true
    
    }
);

module.exports = mongoose.model('Order',orderSchema);