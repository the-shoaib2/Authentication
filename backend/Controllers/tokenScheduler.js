// const asyncHandler = require('../utils/asyncHandler');

// const cron = require('node-cron');
// const generateVerificationToken = require('./path/to/generateVerificationToken');
// const User = require('./path/to/UserModel');

// // Define the time limit for considering a user as "logged in" (e.g., 2 minutes)
// const LOGIN_TIME_LIMIT = 2 * 60 * 1000; // 2 minutes in milliseconds

// // Schedule a task to run every 2 minutes
// cron.schedule('*/2 * * * *', asyncHandler(async () => {
//     console.log('Running token generation every 2 minutes for logged-in users');

//     const now = Date.now();
    
//     // Fetch users who have logged in within the last 2 minutes
//     const loggedInUsers = await User.find({
//         lastLogin: { $gte: new Date(now - LOGIN_TIME_LIMIT) }
//     });

//     for (const user of loggedInUsers) {
//         await generateVerificationToken(user);
//         console.log(`Generated new token for logged-in user ${user._id}`);
//     }
// }));
