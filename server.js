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

mongoDB();

app.use(express.static('public'));
app.use(cookieParser());
app.set("view engine","ejs");
app.use(authRoutes);
app.use(appRoutes);
app.use(cors());

app.get('/',(req,res)=>{
    res.render('index');
});

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
})