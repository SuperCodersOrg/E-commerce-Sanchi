const express = require('express');
const router = express.Router();
const cookie_parser = require('cookie-parser');
require('dotenv').config();
const crypto = require('crypto');
const Razorpay = require('razorpay');
const multer = require('multer');
const Product = require('../models/products.js');
const cartProducts = require('../models/cart.js');
const order = require('../models/order.js');
const Users = require('../models/user.js');

router.use(express.static('public'));
router.use(express.json());
router.use(express.urlencoded({ extended : true }));
router.use(cookie_parser());

const razorpay = new Razorpay({
    key_id : process.env.RAZORPAY_KEY_ID,
    key_secret : process.env.RAZORPAY_KEY_SECRET
})

const authenticated = require('../middlewares/protected_route_middleware');

const storage = multer.diskStorage({
    destination : function (req,file,cb){
        cb(null,'uploads')
    }
});

const upload = multer({ storage: storage });

router.get('/dashboard', authenticated, async (req,res)=>{
    try{
        const products = await Product.find()
                    .sort({ _id : 1 })
                    .limit(4);

        res.render('dashboard' ,  { 
            
            Products : products
        });
    }catch(error){
        console.log(error);
        res.send(500).send('Unable to fetch products');
    } 
});

router.post('/fetch',authenticated,async (req,res)=>{
    try{
        const products = await Product.find({ _id : { $gt : req.body._id } })
                    .sort({ _id : 1 })
                    .limit(4) ;

        if(products.length === 0 ){
            return res.send('');
        }
        res.render('partials/after_prod',{ product : products });
    }catch(error){
        return res.status(500).send(error);
    }
});

router.get('/prod/:id',authenticated,async (req,res)=>{
    try{
        const ids = req.params.id;
        const product = await Product.findOne({ _id : ids });
        res.render('productDetails' , { product });
    }catch(error){
        return res.status(500).send(error);
    }   
});

router.get('/all',authenticated,async (req,res)=>{
    try{
        const product = await Product.find();
        res.render('category',{ products : product });
    }catch(error){
        return res.status(500).send(error);
    }
});

router.get('/men',authenticated,async (req,res)=>{
    try{
        const product = await Product.find({ category : 'Men' });
        res.render('category',{ products : product });
    }catch(error){
        return res.status(500).send(error);
    }
});

router.get('/women',authenticated,async (req,res)=>{
    try{
        const product = await Product.find({ category : 'Women' });
        res.render('category',{ products : product });
    }catch(error){
        return res.status(500).send(error);
    }
});

router.get('/unisex',authenticated,async (req,res)=>{
    try{
        const product = await Product.find({ category : 'Unisex' });
        res.render('category',{ products : product });
    }catch(error){
        return res.status(500).send(error);
    }
});

router.get('/footwear',authenticated,async (req,res)=>{
    try{
        const product = await Product.find({ category : 'Shoes' });
        res.render('category',{ products : product });
    }catch(error){
        return res.status(500).send(error);
    }
});

router.post('/add-to-cart',authenticated,async (req,res)=>{
    const cardId = req.body._id;
    
    try{
        const card = await Product.findOne({ _id : cardId });
        const alreadyInCart = await cartProducts.exists({
            userId : cardId
        });
        if(!alreadyInCart){
            await cartProducts.create({
            userId : card._id,
            image : card.image,
            name : card.name,
            description : card.description,
            price : card.price,
            category : card.category,
            quantity : 1
        })
        res.status(200).send('Success');
        }
    }
    catch(error){
        return res.status(500).send(error);
    }

});

router.get('/cart-page',authenticated,async (req,res)=>{
    try{
        const cart_prods = await cartProducts.find();
        res.render('cart',{ products : cart_prods });
    }catch(error){
        res.status(500).send(error);
    }
});

router.post('/removeCart',authenticated,async (req,res)=>{
    let id = req.body.userId;
    try{
        const result = await cartProducts.deleteOne({ userId : id });
        res.status(200).send('Deleted successfully');
    }catch(error){
        res.status(404).send('Unable to remove');
    }
});

router.post('/add-quantity',authenticated,async (req,res)=>{
    const id = req.body.userId;
    try{
        const result = await cartProducts.findOneAndUpdate(
            { userId : id },
            { $inc : { quantity : 1 } },
            { new : true }
        );
        res.status(200).json({ quantity : result.quantity });
    }catch(error){
        res.status(500).send('Unable to update quantity');
    }
});

router.post('/dec-quantity',authenticated,async (req,res)=>{
    const id = req.body.userId;
    try{
        const result = await cartProducts.findOneAndUpdate(
            { userId : id },
            { $inc : { quantity : -1 } },
            { new : true }
        );
        if(result.quantity <= 0){
            await cartProducts.deleteOne({ userId : id });
            res.status(200).json({quantity : 0});
        }else{
            res.status(200).json({quantity : result.quantity});
        }
    }catch(error){
        res.status(500).send('Unable to update quantity');
    }
});

router.get('/address-page',authenticated,async(req,res)=>{
    try{
        res.render('placeOrder');
    }catch(error){
        res.status(500).send('Page not found');
    }
});

router.post('/bill',authenticated,async(req,res)=>{
    try{
        const cartFull = await cartProducts.find();
        console.log(cartFull);
        const shippingAddress = {
            fullName : req.body.order_name,
            phone : req.body.order_phone,
            address : req.body.address,
            pincode : req.body.pincode,
            city : req.body.city,
            state : req.body.state,
        }
        res.render("orders",{ cart : cartFull , shippingAddress });
    }catch(error){
        res.status(500).send("Internal Server Error");
    }
});

router.post('/place-order',authenticated,async (req,res)=>{
    try {
        const { fullName , phone , address , city , pincode , state } = req.body;

        const cartProduct = await cartProducts.find();
        const items = cartProduct.map((item)=>({
            productId : item.userId,
            quantity : item.quantity,
            price : item.price
        }));

        const subtotal = items.reduce((sum,item)=>{return sum + item.quantity * item.price},0);

        const handling = 200;
        const delivery = subtotal >= 1000 ? 0 : 50;
        const gst = 0.05*subtotal;
        const total = handling + delivery + gst + subtotal;

        console.log("JWT user:", req.user);
        console.log("User ID:", req.user._id);
        
        await order.create({
            userId : req.user._id,
            items : items,
            totalAmount : total,
            shippingAddress : {
                fullName,
                phone,
                address,
                city,
                pincode,
                state
            },
            paymentMethod : 'COD',
            paymentStatus : 'pending',
            orderStatus : 'confirmed'
        });

        await cartProducts.deleteMany({});

        res.status(200).send('Order Confirmed');

    }catch(error){
        console.log("Place order error",error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/create-razorpay-order',authenticated,async(req,res)=>{
    try {
        const { fullName , phone , address , city , pincode , state } = req.body.shippingAddress;

        const cartProduct = await cartProducts.find();

        const items = cartProduct.map((item)=>({
            productId : item.userId,
            quantity : item.quantity,
            price : item.price
        }));

        const subtotal = items.reduce((sum,item)=>{return sum + item.quantity * item.price},0);

        const handling = 200;
        const delivery = subtotal >= 1000 ? 0 : 50;
        const gst = 0.05*subtotal;
        const total = handling + delivery + gst + subtotal;

        const razorpayOrder = await razorpay.orders.create({
            amount : Math.round(total * 100),
            currency : 'INR',
            receipt : `receipt_${Date.now()}`
        });

        await order.create({
            userId : req.user._id,
            items : items,
            totalAmount : total,
            shippingAddress : {
                fullName,
                phone,
                address,
                city,
                pincode,
                state
            },
            paymentMethod : 'RAZORPAY',
            razorpayOrderId : razorpayOrder.id,
            paymentStatus : 'pending',
            orderStatus : 'pending'
        });

        res.status(200).json({
            orderId : razorpayOrder.id,
            amount : razorpayOrder.amount,
            currency : razorpayOrder.currency,
            key : process.env.RAZORPAY_KEY_ID
        });

    }catch(error){
        console.log('Razorpay order error:',error);
        res.status(500).json({
            message : 'Unable to create payment order'
        });
    }
});

router.post('/verify-razorpay-payment', authenticated, async (req, res) => {
    try {
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature
        } = req.body;

        const savedOrder = await order.findOne({
            userId : req.user._id,
            razorpayOrderId : razorpay_order_id
        });

        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment signature'
            });
        }

        savedOrder.razorpayPaymentId = razorpay_payment_id;
        savedOrder.paymentStatus = 'paid';
        savedOrder.orderStatus = 'confirmed';

        await savedOrder.save();

        await cartProducts.deleteMany({});

        return res.status(200).json({
            success: true,
            message: 'Payment verified successfully'
        });

    } catch (error) {
        console.log('Payment verification error:', error);

        return res.status(500).json({
            success: false,
            message: 'Payment verification failed'
        });
    }
});

router.get('/order-history',authenticated,async(req,res)=>{
    try{
        const orders = await order.find({
            userId : req.user._id
        });
        res.render("history",{orders});
    }catch(error){
        res.status(500).send('Internal server error');
    }
});

router.get('/admin-dashboard',authenticated,async (req,res)=>{
    
    try{

        res.render('adminDashboard', { page: 'overview' });

    }catch(error){

        console.log(error.message);
        return res.status(500).send('Server Error');

    }
});

router.get('/buyers-details',authenticated,async (req,res)=>{
    try{

        const buyerLists = await Users.find({ isBuyer : true })
                                        .select('name email');

        
        return res.render('adminDashboard' , {  page : 'buyers' , buyerLists });

    }catch(error){

        console.log(error.message);
        return res.status(500).send('Server Error');

    }
});

router.get('/orders-review',authenticated,async (req,res)=>{
    try{

        const ordersLists = await order.find();
        
        return res.render('adminDashboard' , {  page : 'orders' , ordersLists });

    }catch(error){

        console.log(error.message);
        return res.status(500).send('Server Error');

    }
});

router.get('/admin-profile',authenticated,async (req,res)=>{
    try{

        const admin = await Users.find({ isAdmin : true });
        
        return res.render('adminDashboard' , {  page : 'profile' , admin });

    }catch(error){

        console.log(error.message);
        return res.status(500).send('Server Error');

    }
});

router.get('/analytics',authenticated,async (req,res)=>{
    try{
        const range = req.query.range;

        const startDate = new Date();
        const endDate = new Date();

        if(range === 'week'){
            startDate.setDate(startDate.getDate() - 7);
        }else if(range === 'days'){
            startDate.setDate(startDate.getDate() - 30);
        }else if(range === 'months'){
            startDate.setMonth(startDate.getMonth() - 6);
        }else if(range === 'years'){
            startDate.setDate(startDate.getFullYear() - 1);
        }else if(range == '0'){
            startDate.setFullYear(startDate.getDate() - 0);
        }

        const dateFilter = {
            createdAt : {
                $gte : startDate,
                $lte : endDate
            }
        };

        const totalOrders = await order.countDocuments({
            createdAt : {
                $gte : startDate,
                $lte : endDate
            }
        });
        console.log(totalOrders);

        const totalBuyers = await Users.aggregate([
            {
                $match : {
                    ...dateFilter,
                    isBuyer : true
                }
            },
            {
                $count : "count"
            }
        ]);
        console.log(totalBuyers);
        const count = totalBuyers.length !== 0 ? totalBuyers[0].count : 0;
        console.log(count);

        // const products  = await order.find({ paymentStatus : 'paid' });
        // console.log(products);
        const totalProducts = await order.aggregate([
            {
                $match : {
                    ...dateFilter,
                    paymentStatus : 'paid'
                }
            },
            {
                $unwind : "$items"
            },
            {
                $group : {
                    _id : null,
                    total : {
                        $sum : "$items.quantity"
                    }
                }
            }
        ]);
        // console.log(totalProducts);
        const total = totalProducts.length !== 0 ?  totalProducts[0].total : 0;
        console.log(total);

        const totalRevenue = await order.aggregate([
            {
                $match : {
                    ...dateFilter,
                    paymentStatus : 'paid'
                }
            },
            {
                $group : {
                    _id : null,
                    amount : {
                        $sum : "$totalAmount"
                    }
                }
            }
        ]);
        const amount = totalRevenue.length !== 0 ? totalRevenue[0].amount : 0;
        console.log(amount);

        const topSellingProducts = await order.aggregate([
            {
                $unwind : "$items"
            },
            {
                $group : {
                    _id : "$items.productId",
                    totalQuantitySold : {
                        $sum : "$items.quantity"
                    }
                }
            },
            {
                $sort : {
                    totalQuantitySold : -1
                }
            },
            {
                $limit : 3
            }
        ]);

        console.log(topSellingProducts);

        res.render('adminDashboard' , { page : 'stats' , amount , totalOrders , count , total , topSellingProducts })

    }catch(error){
        console.log(error.message);
        res.status(500).send('Server Error');
    }
});

router.post('/add-product',authenticated,upload.single('file'),async (req,res)=>{
    try {
        console.log("Body:", req.body);
        console.log("File:", req.file);
        const {
            productName ,
            productTitle ,
            productDescription ,
            productPrice ,
            productBrand ,
            productCategory ,
            sizes
        } = req.body;

        const image = req.file;

        await Product.create({
            name : productName ,
            title : productTitle ,
            description : productDescription ,
            price : productPrice ,
            brand : productBrand ,
            category : productCategory ,
            size: JSON.parse(sizes),
            image: image ? image.filename : null
        })

        console.log("Added");
        return res.status(201).json({
            message: "Product added successfully"
        });

    }catch(error){
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
})

module.exports = router;