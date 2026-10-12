const express = require('express');
const router = express.Router();
const cookie_parser = require('cookie-parser');
require('dotenv').config();
const Product = require('../models/products.js');

router.use(express.json());
router.use(express.urlencoded({ extended : true }));
router.use(cookie_parser());

const authenticated = require('../middlewares/protected_route_middleware');

router.get('/dashboard/:name', authenticated, async (req,res)=>{
    try{
        const Products = await Product.find().sort({ _id : 1 }).limit(4);
        res.render('dashboard' ,  { 
            name : req.params.name,
            Products
        });
    }catch(error){
        console.log(error);
        res.send(500).send('Unable to fetch products');
    } 
});

router.post('/fetch',async (req,res)=>{
    console.log(req.body);
    console.log(req.body._id);   
    const product = await Product.find({ _id : { $gt : req.body._id } }).sort({ _id : 1 }).limit(4);
    // res.render('../partials/after_prod',{ product : product });
});

router.get('/prod/:id',async (req,res)=>{
    const ids = req.params.id;
    const product = await Product.findOne({ _id : ids });
    res.render('productDetails' , { product });
});

// router.get('/men',async (req,res)=>{
//     const product = await Product.find({ category : 'Men' });
//     res.render('category',{ product });
// });

module.exports = router;