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
const socketIo = require('socket.io');

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

// Friend Routes
const FriendRoutes = require('./FriendshipManagement/FriendshipRoutes/FriendRoutes');

// Creating Server
const server = http.createServer(app);
const io = socketIo(server); // Pass server to socket config

// Set io instance in app
app.set('io', io);

// Initialize chat service
const chatService = require('./Services/ChatServices/ChatService');
chatService(io); // Pass the io instance to the chat service

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
app.use(process.env.CHAT_SERVICES_ROUTE, ChatRouter);

// Friend Services
app.use(process.env.FRIEND_SERVICES_ROUTE, FriendRoutes);
// app.use('/friend-services', FriendRoutes);

// Start the server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
