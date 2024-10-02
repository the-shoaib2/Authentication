// backend/index.js

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
require('./Config/Database');
const http = require('http');
const socketIo = require('socket.io');
const PORT = process.env.PORT || 8080;

const AuthRouter = require('./Routes/AuthRouter');
const UsersRouter = require('./Routes/UsersRouter');
const VerificationRouter = require('./Routes/VerificationRouter');
const ChatRouter = require('./Services/ChatServices/ChatRouters/ChatRouter'); 

const server = http.createServer(app);
const io = require('./Config/Socket')(server); // Pass server to socket config

app.get('/ping', (req, res) => {
    res.send('Server is Running...😍');
});

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
app.use(process.env.AUTH_ROUTE, AuthRouter);
app.use(process.env.USERS_ROUTE, UsersRouter);
app.use(process.env.VERIFICATION_ROUTE, VerificationRouter);

// Services API
app.use(process.env.CHAT_SERVICES_ROUTE, ChatRouter(io));

// Start the server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
