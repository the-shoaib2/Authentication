const { signup, login, logout, refreshAccessToken, deleteUser } = require("../Controllers/AuthController");
const { signupValidation, loginValidation } = require("../Middlewares/AuthValidation");
const ensureAuthenticated = require('../Middlewares/Auth');
const router = require("express").Router();

router.post(process.env.ROUTER_LOGIN, loginValidation, login);
router.post(process.env.ROUTER_SIGNUP, signupValidation, signup);
router.post(process.env.ROUTER_LOGOUT, logout);
router.post(process.env.ROUTER_REFRESH_TOKEN, refreshAccessToken);
router.delete(process.env.ROUTER_DELETE_USER, ensureAuthenticated, deleteUser);

module.exports = router;

