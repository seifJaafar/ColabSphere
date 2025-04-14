const db = require("../models/index");
const { Project, Team, Task } = db;
const {
  sendProjectCreatedMessage,
  InviteMembers,
  createChatroom,
} = require("../config/kafkaProducer");
const { where, Op, Sequelize } = require("sequelize");
const driveController = require("../config/googleDriveService");
const CalendarController = require("../config/googleCalendarService");
const { MemberLeftProject } = require("../config/kafkaProducer");
const leaveProject = async (req, res) => {
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
    const member = await Team.findOne({
      where: { projectId: projectID, userId },
    });
    if (!member) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized!",
      });
    }
    await Team.destroy({
      where: { projectId: projectID, userId },
    });
    MemberLeftProject(projectID, userId);
    return res.status(200).json({
      success: true,
      message: "You have left the project successfully.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Some error occurred while leaving the project.",
    });
  }
};
const getGoogleToken = async (req, res) => {
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
    const member = await Team.findOne({
      where: { projectId: projectID, userId },
    });
    if (!member || !member.roles.includes("owner")) {
      {
        return res.status(401).json({
          success: false,
          message: "Unauthorized!",
        });
      }
    }
    res.status(200).json({
      success: true,
      message: "Authorized!",
      googleToken: member.googleaccesstoken,
    });
  } catch (error) {
    console.error("Error fetching Google token:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const CalendarList = async (req, res) => {
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
    const member = await Team.findOne({
      where: { projectId: projectID, userId },
    });
    if (!member || !member.roles.includes("owner")) {
      {
        return res.status(401).json({
          success: false,
          message: "Unauthorized!",
        });
      }
    }
    const calendars = await CalendarController.listCalendars(
      member.googleaccesstoken,
      userId,
      member.googlerefreshtoken
    );

    res.status(200).json({
      success: true,
      message: "Authorized!",
      calendars: calendars,
    });
  } catch (err) {
    console.error("Error fetching Google token:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const DriveList = async (req, res) => {
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
    const member = await Team.findOne({
      where: { projectId: projectID, userId },
    });
    if (!member || !member.roles.includes("owner")) {
      {
        return res.status(401).json({
          success: false,
          message: "Unauthorized!",
        });
      }
    }
    const folders = await driveController.listTopLevelFolders(
      member.googleaccesstoken,
      userId,
      member.googlerefreshtoken
    );

    res.status(200).json({
      success: true,
      message: "Authorized!",
      folders: folders,
    });
  } catch (err) {
    console.error("Error fetching Google token:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const getGoogleCalendarURL = async (req, res) => {
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
    const member = await Team.findOne({
      where: { projectId: projectID, userId },
    });
    if (!member) {
      {
        return res.status(401).json({
          success: false,
          message: "Unauthorized!",
        });
      }
    }
    const project = await Project.findByPk(projectID);
    const embedUrl = project.calendarurl;
    res.status(200).json({
      success: true,
      message: "Authorized!",
      calendarLink: embedUrl,
    });
  } catch (err) {
    console.error("Error fetching Google token:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const getGoogleDriveURL = async (req, res) => {
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
    const member = await Team.findOne({
      where: { projectId: projectID, userId },
    });
    if (!member) {
      {
        return res.status(401).json({
          success: false,
          message: "Unauthorized!",
        });
      }
    }
    const project = await Project.findByPk(projectID);

    const embedUrl = project.driveurl;
    res.status(200).json({
      success: true,
      message: "Authorized!",
      folderLink: embedUrl,
    });
  } catch (err) {
    console.error("Error fetching Google token:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const ShareCalendar = async (req, res) => {
  try {
    const { projectID } = req.params;
    const userId = req.headers["x-user-id"];
    const { calendarID } = req.body;
    if (!calendarID) {
      return res.status(400).json({
        success: false,
        message: "calendar ID is required!",
      });
    }
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
    const member = await Team.findOne({
      where: { projectId: projectID, userId },
    });
    if (!member || !member.roles.includes("owner")) {
      {
        return res.status(401).json({
          success: false,
          message: "Unauthorized!",
        });
      }
    }
    const { embedUrl } = await CalendarController.setPublicSharing(
      member.googleaccesstoken,
      userId,
      calendarID,
      member.googlerefreshtoken
    );
    const project = await Project.findByPk(projectID);
    project.calendarurl = embedUrl;
    await project.save();
    res.status(200).json({
      success: true,
      message: "Authorized!",
      calendarLink: embedUrl,
    });
  } catch (err) {
    console.error("Error fetching Google token:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const ShareFolder = async (req, res) => {
  try {
    const { projectID } = req.params;
    const userId = req.headers["x-user-id"];
    const { folderID } = req.body;
    if (!folderID) {
      return res.status(400).json({
        success: false,
        message: "Folder ID is required!",
      });
    }
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
    const member = await Team.findOne({
      where: { projectId: projectID, userId },
    });
    if (!member || !member.roles.includes("owner")) {
      {
        return res.status(401).json({
          success: false,
          message: "Unauthorized!",
        });
      }
    }
    const { embedUrl } = await driveController.setPublicSharing(
      member.googleaccesstoken,
      folderID,
      userId,
      member.refreshtoken
    );
    const project = await Project.findByPk(projectID);
    project.driveurl = embedUrl;
    await project.save();
    res.status(200).json({
      success: true,
      message: "Authorized!",
      folderLink: embedUrl,
    });
  } catch (err) {
    console.error("Error fetching Google token:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const GetTeamMembers = async (req, res) => {
  try {
    const projectID = req.params.projectId;
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
    const member = await Team.findOne({
      where: { projectId: projectID, userId },
    });
    if (!member) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized!",
      });
    }
    const teamMembers = await Team.findAll({
      where: { projectId: projectID },
      attributes: ["userId", "email", "avatar", "username", "roles"],
    });
    const teamMembersWithAssigneeCount = await Promise.all(
      teamMembers.map(async (member) => {
        // Count the number of assignees for the user in the current project
        const assigneeCount = await Task.count({
          where: { projectID: projectID, assignedTo: member.userId },
        });
        return {
          ...member.toJSON(),
          totalTasks: assigneeCount, // Add assignee count to the member object
        };
      })
    );
    res.status(200).json({
      success: true,
      teamMembers: teamMembersWithAssigneeCount,
    });
  } catch (error) {
    console.error("Error fetching team members:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
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
    await createChatroom(createdProject.id, createdProject.title, userId);
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
    const formattedProjects = await Promise.all(
      initialProjects.map(async (project) => {
        const teams = project.teams || [];

        const owner =
          teams.find((member) => member.userId === project.ownerID) || null;

        const userRoles =
          teams.find((member) => member.userId === userId)?.roles || null;

        const totalTasks = await Task.count({
          where: { projectID: project.id },
        });

        const totalCompletedTasks = await Task.count({
          where: { projectID: project.id, status: "completed" },
        });

        const projectData = project.toJSON();
        delete projectData.ownerID;

        return {
          ...projectData,
          totalTasks,
          totalCompletedTasks,
          owner,
          roles: userRoles,
          teams,
        };
      })
    );

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
const UpdateProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const { title, DueDate } = req.body;
    const userId = req.headers["x-user-id"];
    if (!projectId) {
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
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found!",
      });
    }
    const member = await Team.findOne({
      where: { projectId, userId },
    });
    if (
      !member ||
      (!member.roles.includes("owner") && !member.roles.includes("admin"))
    ) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized!",
      });
    }
    project.title = title || project.title;
    project.dueDate = DueDate || project.dueDate;
    await project.save();
    return res.status(200).json({
      success: true,
      message: "Project updated successfully!",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Some error occurred while updating project.",
    });
  }
};
const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const userId = req.headers["x-user-id"];
    if (!projectId) {
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
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found!",
      });
    }
    const member = await Team.findOne({
      where: { projectId, userId },
    });
    if (
      !member ||
      (!member.roles.includes("owner") && !member.roles.includes("admin"))
    ) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized!",
      });
    }
    await Project.destroy({ where: { id: projectId } });
    return res.status(200).json({
      success: true,
      message: "Project deleted successfully!",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Some error occurred while deleting project.",
    });
  }
};

module.exports = {
  GetAllProject,
  createProject,
  InviteBylink,
  InviteByemails,
  getProjectData,
  GetTeamMembers,
  UpdateProject,
  deleteProject,
  getGoogleToken,
  DriveList,
  ShareFolder,
  ShareCalendar,
  getGoogleDriveURL,
  CalendarList,
  getGoogleCalendarURL,
  leaveProject,
};
