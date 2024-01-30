import { userAxiosInstance } from "../axios";

//? ============================================= Authorization =============================================

export const userLogin = (values) => {
  return userAxiosInstance.post("/login", values);
};

export const sendOTP = (values) => {
  return userAxiosInstance.post("/send-otp", values);
};

export const verifyOTP = (values) => {
  return userAxiosInstance.post("/verify-otp", values);
};

export const getUser = () => {
  return userAxiosInstance.get("/get-user");
};

//? ============================================ Forget Password ============================================

export const forgotPassword = (values) => {
  return userAxiosInstance.post("/forgot-password", values);
};

export const checkOTP = (values) => {
  return userAxiosInstance.post("/check-otp", values);
};

export const resetPassword = (values) => {
  return userAxiosInstance.post("/reset-password", values);
};
