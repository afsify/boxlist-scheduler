const express = require("express");
const user_router = express.Router();
const { userAuth } = require("../middleware/auth");
const userController = require("../controller/user.controller");

//? ============================================= Authorization =============================================

user_router.post("/send-otp", userController.sendOTP);
user_router.post("/verify-otp", userController.verifyOTP);
user_router.post("/login", userController.login);
user_router.get("/get-user", userAuth, userController.getUser);

//? ============================================ Forgot Password ============================================

user_router.post("/forgot-password", userController.forgotPassword);
user_router.post("/check-otp", userController.checkOTP);
user_router.post("/reset-password", userController.resetPassword);

module.exports = user_router;
