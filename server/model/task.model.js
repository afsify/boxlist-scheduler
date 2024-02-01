const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    date: {
      type: Date,
    },
    list: [
      {
        title: {
          type: String,
          required: true,
        },
        time: {
          type: Date,
          required: true,
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const taskModel = mongoose.model("tasks", taskSchema);

module.exports = taskModel;
