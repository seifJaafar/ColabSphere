const db = require("../models/index");
const { Team, Task } = db;
const { where, Op, Sequelize } = require("sequelize");

const updateTask = async (req, res) => {
  try {
    const { title, dueDate, difficulty, priority, status, module, assignTo } =
      req.body.task;
    const { taskId } = req.params;
    const userId = req.headers["x-user-id"];
    console.log("dueDate", dueDate);
    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: "Task ID is required!",
      });
    }
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const task = await Task.findOne({
      where: { taskID: taskId },
    });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const owner = await Team.findOne({
      where: { projectId: task.projectID, userId: userId },
    });
    if (
      !owner ||
      !owner.roles ||
      (!owner.roles.includes("owner") && !owner.roles.includes("manager"))
    ) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized! Only a manager or owner can update task.",
      });
    }
    if (title && title !== task.title) {
      task.title = title;
    }
    if (dueDate && dueDate !== task.dueDate) {
      console.log(dueDate);
      task.dueDate = dueDate;
    }
    if (difficulty && difficulty !== task.difficulty) {
      task.difficulty = difficulty;
    }
    if (priority && priority !== task.priority) {
      task.priority = priority;
    }
    if (status && status !== task.status) {
      task.status = status;
    }
    if (module && module !== task.module) {
      task.module = module;
    }
    await task.save();
    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message || "Some error occurred while updating task.",
    });
  }
};
const CreateTask = async (req, res) => {
  try {
    const { projectID } = req.params;
    const userId = req.headers["x-user-id"];
    const { task } = req.body;

    if (!projectID) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required!",
      });
    }
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized! Only a member can create task.",
      });
    }
    const owner = await Team.findOne({
      where: { projectId: projectID, userId: userId },
    });
    if (
      !owner ||
      !owner.roles ||
      (!owner.roles.includes("owner") && !owner.roles.includes("manager"))
    ) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized! Only a manager or owner can create task.",
      });
    }
    if (!task) {
      return res.status(400).json({
        success: false,
        message: "Task details are required!",
      });
    }

    const taskData = {
      ...task,
      projectID,
    };
    const newTask = await Task.create(taskData);
    return res.status(200).json({
      success: true,
      data: newTask,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message || "Some error occurred while creating task.",
    });
  }
};
const GetTasks = async (req, res) => {
  try {
    const { projectID } = req.params;
    const userId = req.headers["x-user-id"];
    if (!projectID) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required!",
      });
    }
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized!",
      });
    }
    const owner = await Team.findOne({
      where: { projectId: projectID, userId: userId },
    });
    if (!owner) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized! Only a member can get tasks.",
      });
    }
    const tasks = await Task.findAll({
      where: { projectID },
      order: [
        [
          Sequelize.literal(`ABS(EXTRACT(EPOCH FROM ("dueDate" - NOW())))`),
          "ASC",
        ],
      ],
    });
    const roles = owner.roles;
    return res.status(200).json({
      success: true,
      data: tasks,
      roles,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message || "Some error occurred while fetching tasks.",
    });
  }
};
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.headers["x-user-id"];
    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: "Task ID is required!",
      });
    }
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const task = await Task.findOne({
      where: { taskID: taskId },
    });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }
    const owner = await Team.findOne({
      where: { projectId: task.projectID, userId: userId },
    });
    if (
      !owner ||
      !owner.roles ||
      (!owner.roles.includes("owner") && !owner.roles.includes("manager"))
    ) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized! Only a manager or owner can delete task.",
      });
    }
    await task.destroy();
    return res.status(200).json({
      success: true,
      message: "Task deleted successfully!",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message || "Some error occurred while deleting task.",
    });
  }
};
module.exports = {
  CreateTask,
  GetTasks,
  updateTask,
  deleteTask,
};
