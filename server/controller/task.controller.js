const taskModel = require("../model/task.model");

//! ============================================= Create List =============================================

const insertList = async (req, res, next) => {
  try {
    const { date, list } = req.body;
    const user = req.userId;
    const taskExists = await taskModel.findOne({ user, date });
    if (taskExists) {
      return res.status(200).json({
        message: "Date Already Exists",
        success: false,
      });
    }
    const newTask = new taskModel({
      user,
      date,
      list,
    });
    const savedTask = await newTask.save();
    res.status(200).json({
      message: "List Created",
      success: true,
      data: savedTask,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! ============================================== Get List ==============================================

const getList = async (req, res, next) => {
  try {
    const user = req.userId;
    const lists = await taskModel.find({ user });
    res.status(200).json({
      message: "Lists Fetched",
      success: true,
      data: lists,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! ============================================ Delete List ============================================

const deleteList = async (req, res, next) => {
  try {
    const listId = req.params.listId;
    const list = await taskModel.findOneAndDelete({ _id: listId });
    if (!list) {
      return res
        .status(404)
        .json({ success: false, message: "List not found" });
    }
    res.status(200).json({ success: true, message: "List Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! ============================================ Task Status ============================================

const taskStatus = async (req, res, next) => {
  try {
    const { listId, taskId } = req.params;
    const { completed } = req.body;
    const list = await taskModel.findOneAndUpdate(
      { _id: listId, "list._id": taskId },
      { $set: { "list.$.completed": completed } },
      { new: true }
    );
    if (!list) {
      return res
        .status(404)
        .json({ success: false, message: "Task Not Found" });
    }
    res.status(200).json({ success: true, message: "Status Updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

module.exports = {
  insertList,
  getList,
  deleteList,
  taskStatus,
};
