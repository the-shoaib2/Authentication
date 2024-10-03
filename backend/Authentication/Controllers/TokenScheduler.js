// const asyncHandler = require('../utils/asyncHandler');
// const cron = require('node-cron');
// const generateVerificationToken = require('./path/to/generateVerificationToken');
// const User = require('./path/to/UserModel');

// // Convert LOGIN_TIME_LIMIT from minutes to milliseconds
// const LOGIN_TIME_LIMIT = parseInt(process.env.LOGIN_TIME_LIMIT) * 60 * 1000;

// // Use the cron schedule from the environment variable
// cron.schedule(process.env.TOKEN_GENERATION_CRON, asyncHandler(async () => {
//     console.log('Running token generation for logged-in users');

//     const now = Date.now();
    
//     // Fetch users who have logged in within the last LOGIN_TIME_LIMIT
//     const loggedInUsers = await User.find({
//         lastLogin: { $gte: new Date(now - LOGIN_TIME_LIMIT) }
//     });

//     for (const user of loggedInUsers) {
//         await generateVerificationToken(user);
//         console.log(`Generated new token for logged-in user ${user._id}`);
//     }
// }));
