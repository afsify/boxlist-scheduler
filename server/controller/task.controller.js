const { body, validationResult } = require("express-validator");
const taskModel = require("../model/task.model");

//! ============================================= Create List =============================================

const insertListValidation = [
  body("name").notEmpty().trim().escape(),
  body("date").notEmpty().isISO8601().toDate(),
  body("list").isArray(),
];

const insertList = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid Input",
      });
    }
    const { name, date, list } = req.body;
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
      name,
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

//! ============================================ Edit Task ============================================

const editTask = async (req, res, next) => {
  try {
    const { title, time } = req.body;
    const listId = req.params.listId;
    const taskId = req.params.taskId;
    const list = await taskModel.findOne({ _id: listId });
    if (!list) {
      return res
        .status(404)
        .json({ success: false, message: "List Not Found" });
    }
    const task = list.list.find((task) => task._id.toString() === taskId);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task Not Found" });
    }
    task.title = title;
    task.time = time;
    await list.save();
    res.status(200).json({ success: true, message: "Task Updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" });
    next(error);
  }
};

//! ============================================ Delete Task ============================================

const deleteTask = async (req, res, next) => {
  try {
    const { listId, taskId } = req.params;

    const list = await taskModel.findOne({ _id: listId });
    if (!list) {
      return res
        .status(404)
        .json({ success: false, message: "List Not Found" });
    }
    const task = list.list.find((t) => t._id.toString() === taskId);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task Not Found" });
    }
    list.list = list.list.filter((t) => t._id.toString() !== taskId);
    await list.save();
    res.status(200).json({ success: true, message: "Task Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error occurred" });
    next(error);
  }
};

//! ============================================ Insert Task ============================================

const insertTask = async (req, res, next) => {
  try {
    const { listId } = req.params;
    const { title, time } = req.body;
    const list = await taskModel.findById(listId);
    if (!list) {
      return res
        .status(404)
        .json({ success: false, message: "List Not Found" });
    }
    list.list.push({ title, time });
    await list.save();
    return res
      .status(200)
      .json({ success: true, data: list, message: "Task Added" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error occurred" });
    next(error);
  }
};

//! ============================================= Edit List =============================================

const editList = async (req, res, next) => {
  try {
    const { listId } = req.params;
    const { name, date } = req.body;
    const updatedList = await taskModel.findByIdAndUpdate(
      listId,
      { name, date },
      { new: true }
    );
    if (!updatedList) {
      return res
        .status(404)
        .json({ success: false, message: "List Not Found" });
    }
    res.status(200).json({
      success: true,
      message: "List Updated",
      data: updatedList,
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

module.exports = {
  insertList,
  getList,
  taskStatus,
  editTask,
  deleteTask,
  insertTask,
  editList,
  deleteList,
};
