const express  = require("express");
const { registerController, loginController, verifyEmailController } = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register",registerController);
router.post("/login",loginController);
router.post("/verifyEmail",verifyEmailController);
router.get("/fecthuser",authMiddleware,verifyEmailController);

module.exports = router;