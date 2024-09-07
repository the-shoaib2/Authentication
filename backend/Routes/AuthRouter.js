const { signup, login, logout, refreshAccessToken, deleteUser } = require("../Controllers/AuthController");
const { signupValidation, loginValidation } = require("../Middlewares/AuthValidation");
const ensureAuthenticated = require('../Middlewares/Auth');

const router = require("express").Router();

router.post("/login", loginValidation, login);
router.post("/signup", signupValidation, signup);
router.post("/logout", logout);
router.post("/refresh-token", refreshAccessToken);
router.delete("/delete/:id", ensureAuthenticated, deleteUser);

module.exports = router;

