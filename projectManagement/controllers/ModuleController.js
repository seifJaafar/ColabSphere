const db = require("../models/index");
const { Module, Team } = db;
const { where, Op } = require("sequelize");

const GetModules = async (req, res) => {
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
        message: "Unauthorized! Only the owner can invite members.",
      });
    }
    const owner = await Team.findOne({
      where: { projectId: projectID, userId: userId },
    });
    if (!owner) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized! Only the owner can invite members.",
      });
    }
    const modules = await Module.findAll({
      where: { projectID },
    });
    return res.status(200).json({
      success: true,
      data: modules,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message || "Some error occurred while fetching modules.",
    });
  }
};
const DeleteModule = async (req, res) => {
  try {
    const { moduleID } = req.params;
    const userId = req.headers["x-user-id"];
    if (!moduleID) {
      return res.status(400).json({
        success: false,
        message: "Module ID is required!",
      });
    }
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized! Only the owner can delete module.",
      });
    }
    const module = await Module.findByPk(moduleID);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found!",
      });
    }
    const owner = await Team.findOne({
      where: { projectId: module.projectID, userId: userId },
    });
    if (!owner || !owner.roles || !owner.roles.includes("owner")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized! Only the owner can delete module.",
      });
    }
    await module.destroy();
    return res.status(200).json({
      success: true,
      message: "Module deleted successfully!",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message || "Some error occurred while deleting module.",
    });
  }
};
const CreateModule = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.headers["x-user-id"];
    const { projectID } = req.params;
    if (!projectID) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required!",
      });
    }
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required!",
      });
    }
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized! Only the owner can create module.",
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
        message: "Unauthorized! Only the owner can create module.",
      });
    }
    const previousModel = await Module.findOne({
      where: { projectID, title },
    });
    if (previousModel) {
      return res.status(400).json({
        success: false,
        message: "Module already exists!",
      });
    }
    const module = await Module.create({
      title,
      projectID,
    });
    return res.status(201).json({
      success: true,
      message: "Module created successfully!",
      data: module,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message || "Some error occurred while creating module.",
    });
  }
};
const updateModule = async (req, res) => {
  try {
    const { moduleID } = req.params;
    const { title } = req.body;
    const userId = req.headers["x-user-id"];
    if (!moduleID) {
      return res.status(400).json({
        success: false,
        message: "Module ID is required!",
      });
    }
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required!",
      });
    }
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized! Only the owner can update module.",
      });
    }
    const module = await Module.findByPk(moduleID);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found!",
      });
    }
    const owner = await Team.findOne({
      where: { projectId: module.projectID, userId: userId },
    });
    if (!owner || !owner.roles || !owner.roles.includes("owner")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized! Only the owner can update module.",
      });
    }
    module.title = title;
    await module.save();
    return res.status(200).json({
      success: true,
      message: "Module updated successfully!",
      data: module,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message || "Some error occurred while updating module.",
    });
  }
};
module.exports = {
  GetModules,
  DeleteModule,
  CreateModule,
  updateModule,
};
