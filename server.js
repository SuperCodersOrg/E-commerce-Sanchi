const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const path = require('path');
require('dotenv').config();
const mongoDB = require('./config/database');
app.use(express.static(path.join(__dirname, 'public')));
const { router : authRoutes } = require('./routes/authRoutes.js');
const  appRoutes  = require('./routes/appRoutes.js');
const Product = require('./models/products.js');

mongoDB();

app.use(express.static('public'));
app.use(cookieParser());
app.set("view engine","ejs");
app.use(authRoutes);
app.use(appRoutes);
app.use(cors());

app.get('/',async (req,res)=>{
    try{
        const Products = await Product.find()
                    .sort({ _id : 1 });
        res.render('mainDash' ,  { 
            Products
        });
    }catch(error){
        console.log(error);
        res.send(500).send('Unable to fetch products');
    } 
});

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
})