const express = require("express");
const user_router = express.Router();
const { userAuth } = require("../middleware/auth");
const userController = require("../controller/user.controller");
const taskController = require("../controller/task.controller");

//? ============================================= Authorization =============================================

user_router.post("/send-otp", userController.sendOTP);
user_router.post("/verify-otp", userController.verifyOTP);
user_router.post("/login", userController.login);
user_router.get("/get-user", userAuth, userController.getUser);

//? ============================================ Forgot Password ============================================

user_router.post("/forgot-password", userController.forgotPassword);
user_router.post("/check-otp", userController.checkOTP);
user_router.post("/reset-password", userController.resetPassword);

//? =============================================== Todo List ===============================================

user_router.post("/insert-list", userAuth, taskController.insertList);
user_router.get("/get-list", userAuth, taskController.getList);
user_router.delete("/delete-list/:listId", userAuth, taskController.deleteList);
user_router.put("/task-status/:listId/:taskId", userAuth, taskController.taskStatus);
user_router.put("/edit-task/:listId/:taskId", userAuth, taskController.editTask);
user_router.post("/insert-task/:listId", userAuth, taskController.insertTask);
user_router.delete("/delete-task/:listId/:taskId", userAuth, taskController.deleteTask);

module.exports = user_router;
