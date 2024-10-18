// backend/index.js

// Importing required modules
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

// Load environment variables
dotenv.config();
import './Config/Database.js';

// Set up the server
const app = express();
const PORT = process.env.PORT || 8080;
const server = http.createServer(app);
const io = new Server(server); // Pass server to socket config

// Set io instance in app
app.set('io', io);

// Initialize chat service
import chatService from './Services/ChatServices/ChatService.js';
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

// Importing Routes
// Authentication Routes
import AuthRouter from './Authentication/Routes/AuthRouter.js'; // Use default import
import UsersRouter from './Authentication/Routes/UsersRouter.js';

// Account Management Routes
import AccountRouter from './AccountManagement/AccountRoutes/AccountRoutes.js'; // Use default import

// Verification Routes
import VerificationRouter from './Authentication/Verification/Routes/VerificationRouter.js';

// Services Routes
// Chat Routes
import ChatRouter from './Services/ChatServices/Routers/ChatRouter.js'; 
// Message Routes
import MessageRouter from './Services/ChatServices/Routers/MessageRouter.js'; 

// Friend Routes
import FriendRoutes from './FriendshipManagement/FriendshipRoutes/FriendRoutes.js';

// Define routes using environment variables
const routes = [
    { path: process.env.AUTH_ROUTE, router: AuthRouter },
    { path: process.env.USERS_ROUTE, router: UsersRouter },
    { path: process.env.ACCOUNT_ROUTE, router: AccountRouter },
    { path: process.env.VERIFICATION_ROUTE, router: VerificationRouter },
    { path: process.env.CHAT_SERVICES_ROUTE, router: ChatRouter },
    { path: process.env.MESSAGE_SERVICES_ROUTE, router: MessageRouter },
    { path: process.env.FRIEND_SERVICES_ROUTE, router: FriendRoutes },
];

routes.forEach(({ path, router }) => {
    if (path) {
        app.use(path, router);
    } else {
        console.warn(`Warning: Route for ${router.name} is not defined in environment variables.`);
    }
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
