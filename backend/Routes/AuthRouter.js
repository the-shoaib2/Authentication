
// // backend/Routes/AuthRouter.js

// const { signup, login, logout, refreshAccessToken} = require("../Controllers/AuthController");
// const { signupValidation, loginValidation} = require("../Middlewares/AuthValidation");

// const router = require("express").Router();

// router.post("/login", loginValidation, login);
// router.post("/signup", signupValidation, signup);

// router.post("/logout", logout);
// router.post("/refresh-token", refreshAccessToken);


// module.exports = router;



// // backend/Routes/AuthRouter.js

// const { signup, login, logout  } = require("../Controllers/AuthController");
// const { verifyEmail ,refreshAccessToken} = require("../Controllers/VerificationController");
// const { signupValidation, loginValidation } = require("../Middlewares/AuthValidation");
// const { verifyToken } = require("../Middlewares/VerificationMiddleware");

// const router = require("express").Router();

// router.post("/login", loginValidation, login);
// router.post("/signup", signupValidation, signup);

// router.post("/logout", logout);

// router.post('/verify-email', verifyToken, verifyEmail);
// router.post("/refresh-token", refreshAccessToken);

// module.exports = router;







// backend/Routes/AuthRouter.j

const { signup, login, logout,refreshAccessToken } = require("../Controllers/AuthController");
const { verifyTokenValidity,verifyEmail} = require("../Controllers/VerificationController");
const { signupValidation, loginValidation } = require("../Middlewares/AuthValidation");
const { verifyToken } = require("../Middlewares/VerificationMiddleware");

const router = require("express").Router();

router.post("/login", loginValidation, login);
router.post("/signup", signupValidation, signup);
router.post("/logout", logout);
router.post('/verify-token', verifyTokenValidity); 
router.post('/verify-email', verifyToken, verifyEmail);  
router.post("/refresh-token", refreshAccessToken);

module.exports = router;

