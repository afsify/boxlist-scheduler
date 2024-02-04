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

//? ============================================== Todo List ==============================================

export const insertList = (values) => {
  return userAxiosInstance.post("/insert-list", values);
};

export const getList = () => {
  return userAxiosInstance.get("/get-list");
};

export const taskStatus = (listId, taskId, data) => {
  return userAxiosInstance.put(`/task-status/${listId}/${taskId}`, data);
};

export const editTask = (listId, taskId, data) => {
  return userAxiosInstance.put(`/edit-task/${listId}/${taskId}`, data);
};

export const deleteTask = (listId, taskId) => {
  return userAxiosInstance.delete(`/delete-task/${listId}/${taskId}`);
};

export const insertTask = (listId, data) => {
  return userAxiosInstance.post(`/insert-task/${listId}`, data);
};

export const editList = (listId, data) => {
  return userAxiosInstance.put(`/edit-list/${listId}`, data);
};

export const deleteList = (listId) => {
  return userAxiosInstance.delete(`/delete-list/${listId}`);
};
