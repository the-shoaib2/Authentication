// Importing Mongoose to interact with MongoDB
const mongoose = require('mongoose');

// Retrieving the MongoDB connection URL from environment variables
const mongo_url = process.env.MONGO_CONN;

// Establishing a connection to the MongoDB database using Mongoose
mongoose.connect(mongo_url)
    .then(() => {
        // If the connection is successful, this block will execute
        console.log('MongoDB is Connected...😍');  // Logs a message indicating that the connection was successful
    })
    .catch((err) => {
        // If there is an error during the connection, this block will execute
        console.log('MongoDB Connection Error: 😭', err);  // Logs the error message
    });
