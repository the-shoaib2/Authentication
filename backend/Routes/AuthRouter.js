const { signup, login, logout, refreshAccessToken, deleteUser } = require("../Controllers/AuthController");
const { verifyTokenValidity, verifyEmail } = require("../Controllers/VerificationController");
const { signupValidation, loginValidation } = require("../Middlewares/AuthValidation");
const { verifyToken } = require("../Middlewares/VerificationMiddleware");
const ensureAuthenticated = require('../Middlewares/Auth');

const router = require("express").Router();

router.post("/login", loginValidation, login);
router.post("/signup", signupValidation, signup);
router.post("/logout", logout);
// router.post('/verify-token', verifyTokenValidity); 
// router.post('/verify-email', verifyToken, verifyEmail);  
router.post("/refresh-token", refreshAccessToken);
router.delete("/delete/:id", ensureAuthenticated, deleteUser);

module.exports = router;

