const express = require("express");
const {
  CreateTask,
  GetTasks,
  updateTask,
  deleteTask,
} = require("../controllers/TaskController");

const router = express.Router();

router.route("/all/:projectID").get(GetTasks).post(CreateTask);
router.route("/:taskId").put(updateTask).delete(deleteTask);
module.exports = router;
