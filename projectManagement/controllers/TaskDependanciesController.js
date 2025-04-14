const db = require("../models/index");
const { Task, TaskDependency, Team } = db;
const { where, Op, Sequelize } = require("sequelize");
const getProjectDependencies = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const member = await Team.findOne({
      where: { projectId, userId },
    });
    if (!member) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const tasks = await Task.findAll({
      where: { projectID: projectId },
      include: [
        {
          association: "dependencies",
          include: [{ association: "dependsOn" }],
        },
        {
          association: "dependents",
          include: [{ association: "task" }],
        },
      ],
    });

    // Flatten dependencies
    const dependencies = [];
    tasks.forEach((task) => {
      task.dependencies.forEach((dep) => {
        dependencies.push({
          id: dep.id,
          taskId: dep.taskId,
          dependsOnId: dep.dependsOnId,
          dependencyType: dep.dependencyType,
        });
      });
    });

    res.json({ tasks, dependencies, roles: member.roles });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
const removeDependency = async (req, res) => {
  try {
    const { id } = req.params;
    await TaskDependency.destroy({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to remove dependency" });
  }
};
const addDependency = async (req, res) => {
  try {
    const {
      taskId,
      dependsOnId,
      dependencyType = "finish_to_start",
    } = req.body;
    if (taskId === dependsOnId) {
      return res.status(400).json({ error: "A task cannot depend on itself" });
    }

    // Check if dependency already exists
    const existing = await TaskDependency.findOne({
      where: { taskId, dependsOnId },
    });
    if (existing) {
      return res.status(400).json({ error: "Dependency already exists" });
    }

    const dependency = await TaskDependency.create({
      taskId,
      dependsOnId,
      dependencyType,
    });
    res.status(201).json(dependency);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  getProjectDependencies,
  removeDependency,
  addDependency,
};
