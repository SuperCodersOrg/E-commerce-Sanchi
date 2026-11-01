const mongoose = require('mongoose');
require('dotenv').config();

const connectDb = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log('MongoDB Connected:',conn.connection.host);
        console.log('Database:', conn.connection.name);
    }
    catch(error){
        console.log(error);
        console.log('Make sure your database is connected');
    }

}

module.exports = connectDb;