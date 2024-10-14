import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); 

const mongo_url = process.env.MONGO_CONN; 

if (!mongo_url) {
    console.error('MongoDB connection string is not defined.');
    process.exit(1); 
}

export const Database = mongoose.connect(mongo_url)
    .then(() => {
        console.log('MongoDB is Connected...☘️');
    })
    .catch((err) => {
        console.log('MongoDB Connection Error: 😭', err);
    });


export default Database;
