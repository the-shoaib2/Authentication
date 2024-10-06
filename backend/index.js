// backend/index.js

// Importing required modules
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
require('./Config/Database');
const http = require('http');
const PORT = process.env.PORT || 8080;

// Importing Routes
// Authentication Routes
const AuthRouter = require('./Authentication/Routes/AuthRouter');
const UsersRouter = require('./Authentication/Routes/UsersRouter');

// Account Management Routes
const AccountRouter = require('./AccountManagement/AccountRoutes/AccountRoutes');

// Verification Routes
const VerificationRouter = require('./Authentication/Verification/Routes/VerificationRouter');

// Services Routes
const ChatRouter = require('./Services/ChatServices/ChatRouters/ChatRouter'); 



// Creating Server
const server = http.createServer(app);
const io = require('./Config/Socket')(server); // Pass server to socket config

// Ping Route
app.get('/ping', (req, res) => {
    res.send('Server is Running...😍');
});

// Middlewares
app.use(express.json());
app.use(cookieParser());

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:3000', // Allow your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the methods you want to allow
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions)); // Use the CORS middleware with the specified options

// Define routes using environment variables

// Authentication Routes
app.use(process.env.AUTH_ROUTE, AuthRouter);
app.use(process.env.USERS_ROUTE, UsersRouter);

// Account Management Routes
app.use(process.env.ACCOUNT_ROUTE, AccountRouter);

// Verification Routes
app.use(process.env.VERIFICATION_ROUTE, VerificationRouter);

// Services API
app.use(process.env.CHAT_SERVICES_ROUTE, ChatRouter(io));

// Start the server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
