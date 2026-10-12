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
        const Products = await Product.find()
                    .sort({ _id : 1 })
                    .limit(4);

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

router.get('/prod/:id',async (req,res)=>{
    try{
        const ids = req.params.id;
        const product = await Product.findOne({ _id : ids });
        res.render('productDetails' , { product });
    }catch(error){
        return res.status(500).send(error);
    }   
});

router.get('/all',async (req,res)=>{
    try{
        const product = await Product.find();
        res.render('category',{ products : product });
    }catch(error){
        return res.status(500).send(error);
    }
});

router.get('/men',async (req,res)=>{
    try{
        const product = await Product.find({ category : 'Men' });
        res.render('category',{ products : product });
    }catch(error){
        return res.status(500).send(error);
    }
});

router.get('/women',async (req,res)=>{
    try{
        const product = await Product.find({ category : 'Women' });
        res.render('category',{ products : product });
    }catch(error){
        returnres.status(500).send(error);
    }
});

router.get('/unisex',async (req,res)=>{
    try{
        const product = await Product.find({ category : 'Unisex' });
        res.render('category',{ products : product });
    }catch(error){
        returnres.status(500).send(error);
    }
});

router.get('/footwear',async (req,res)=>{
    try{
        const product = await Product.find({ category : 'Shoes' });
        res.render('category',{ products : product });
    }catch(error){
        returnres.status(500).send(error);
    }
});


module.exports = router;