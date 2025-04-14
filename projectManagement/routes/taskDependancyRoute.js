const express = require("express");
const {
  getProjectDependencies,
  removeDependency,
  addDependency,
} = require("../controllers/TaskDependanciesController");

const router = express.Router();

router.route("/project/:projectId").get(getProjectDependencies);
router.route("/").post(addDependency);
router.route("/:id").delete(removeDependency);

module.exports = router;
