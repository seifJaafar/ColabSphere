const express = require("express");
const {
  CreateTask,
  GetTasks,
  updateTask,
  deleteTask,
  AssignTask,
  getMyTasks,
} = require("../controllers/TaskController");

const router = express.Router();

router.route("/all/:projectID").get(GetTasks).post(CreateTask);
router.get("/myTasks/:projectID", getMyTasks);
router.route("/assign/:taskID").post(AssignTask);
router.route("/:taskId").put(updateTask).delete(deleteTask);
module.exports = router;
