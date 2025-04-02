const db = require("../models/index");
const { Project, Team } = db;
const {
  sendProjectCreatedMessage,
  InviteMembers,
} = require("../config/kafkaProducer");
const { where, Op, Sequelize } = require("sequelize");
const InviteByemails = async (req, res) => {
  try {
    const { emails, projectID } = req.body;
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
    const owner = await Project.findOne({
      where: { id: projectID, ownerID: userId },
    });

    if (!owner) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized! Only the owner can invite members.",
      });
    }
    if (!emails || emails.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Emails are required!",
      });
    }

    await InviteMembers(emails, projectID);
    return res.status(201).json({
      success: true,
      message: "Invites sent successfully!",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message || "Some error occurred while sending invite.",
    });
  }
};
const InviteBylink = async (req, res) => {
  try {
    const { projectID } = req.params;
    const userId = req.headers["x-user-id"];

    const project = await Project.findByPk(projectID);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found!",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized!",
      });
    }

    const Member = await Team.findOne({
      where: { projectId: projectID, userId },
    });
    if (Member) {
      return res.status(400).json({
        success: false,
        message: "User is already a member of the project!",
      });
    }

    const roles = ["member"];
    await sendProjectCreatedMessage(userId, projectID, roles);

    return res.status(201).json({
      success: true,
      message: "Welcome to the team!",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message || "Some error occurred while sending invite.",
    });
  }
};

const createProject = async (req, res) => {
  try {
    const { title, DueDate } = req.body;
    const userId = req.headers["x-user-id"];
    const existingProject = await Project.findOne({
      where: { title, ownerID: userId },
    });

    if (existingProject) {
      return res.status(400).send({ message: "Project already exists!" });
    }

    // Create the new project
    const newProject = {
      title,
      dueDate: DueDate,
      ownerID: userId,
    };

    const createdProject = await Project.create(newProject);
    const roles = ["owner"];
    await sendProjectCreatedMessage(userId, createdProject.id, roles);

    res.status(201).send({ message: "Project created successfully!" });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Project.",
    });
  }
};

const GetAllProject = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    // Step 1: Get all projects where the user is either the owner or a team member
    const initialProjects = await Project.findAll({
      where: {
        [Op.or]: [
          { ownerID: userId }, // User is the owner
          {
            id: {
              [Op.in]: Sequelize.literal(
                `(SELECT "projectId" FROM "team" WHERE "userId" = '${userId}')`
              ),
            },
          }, // User is a team member
        ],
      },
      include: [
        {
          model: Team,
          as: "teams",
          attributes: ["userId", "email", "avatar", "username", "roles"],
          required: false, // Include all team members
        },
      ],
    });

    // Step 2: Format the response
    const formattedProjects = initialProjects.map((project) => {
      const teams = project.teams || [];

      // Find the owner in the teams array
      const owner =
        teams.find((member) => member.userId === project.ownerID) || null;

      // Get the logged-in user's roles
      const userRoles =
        teams.find((member) => member.userId === userId)?.roles || null;
      const projectData = project.toJSON();
      delete projectData.ownerID;
      return {
        ...projectData,
        owner, // Owner details extracted from teams array
        roles: userRoles,
        teams, // All team members
      };
    });

    res.status(200).send({ projects: formattedProjects });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving projects.",
      projects: [],
    });
  }
};
const getProjectData = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const project = await Project.findByPk(projectId, {
      attributes: ["id", "title", "dueDate", "ownerID"],
    });
    const userId = req.headers["x-user-id"];
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found!",
      });
    }
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized!",
      });
    }
    const member = await Team.findOne({
      attributes: ["roles"],
      where: { projectId, userId },
    });
    if (!member) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized!",
      });
    }
    const data = project.toJSON();
    data.roles = member.roles;
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message:
        err.message || "Some error occurred while fetching project data.",
    });
  }
};

module.exports = {
  GetAllProject,
  createProject,
  InviteBylink,
  InviteByemails,
  getProjectData,
};
