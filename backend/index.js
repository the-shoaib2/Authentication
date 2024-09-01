// backend/index.js

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
require('./Config/db');
const PORT = process.env.PORT || 8080;

const AuthRouter = require('./Routes/AuthRouter');
const UsersRouter = require('./Routes/UsersRouter');
// const VerificationRouter = require('./Routes/VerificationRouter');

app.get('/ping', (req, res) => {
    res.send('Server is Running...😍');
});

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Define routes
app.use('/auth', AuthRouter);
app.use('/users', UsersRouter);
// app.use('/verification', VerificationRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
