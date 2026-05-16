const express  = require("express");
const { registerController, loginController, verifyEmailController } = require("../controllers/user.controller");

const router = express.Router();

router.post("/register",registerController);
router.post("/login",loginController);
router.post("/verifyEmail",verifyEmailController);

module.exports = router;