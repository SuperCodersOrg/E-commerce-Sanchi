const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const users = require('../models/user.js');

async function createAdmin(){
    try{
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if(!adminEmail || !adminPassword){
            throw new Error('No details could be found');
        }

        try{

            await mongoose.connect(process.env.MONGODB_URL);
            console.log('Database connected successfully');

        }catch(error){

            console.log(error.message);
            console.log("MongoDB couldn't be connected");
            return;
        }

        const existingUser = await users.findOne({ email : adminEmail });

        if(existingUser){
            console.log('User already exists');
            return; 
        }
    
        await users.create({
            name : 'VELNORA Admin',
            email : adminEmail,
            password : await bcrypt.hash(adminPassword,12),
            isBuyer : false,
            isAdmin : true
        })
    
        console.log('Account created successfully');

    }catch(error){

        console.log(error.message);
        await mongoose.disconnect();
        console.log('Internal Server error');

    }
}

createAdmin();
