const express = require("express");
const {
  createProject,
  GetAllProject,
  InviteBylink,
  InviteByemails,
  getProjectData,
  GetTeamMembers,
  UpdateProject,
  deleteProject,
  getGoogleToken,
  ShareFolder,
  DriveList,
  getGoogleDriveURL,
  CalendarList,
  getGoogleCalendarURL,
  ShareCalendar,
  leaveProject,
} = require("../controllers/ProjectController");

const router = express.Router();

router.route("/").get(GetAllProject).post(createProject);
router.get("/inviteLink/:projectID", InviteBylink);
router.post("/inviteEmails", InviteByemails);
router.get("/team/:projectId", GetTeamMembers);
router.get("/googleToken/:projectID", getGoogleToken);
router.get("/drive/folders/:projectID", DriveList);
router.post("/drive/share/:projectID", ShareFolder);
router.get("/drive/url/:projectID", getGoogleDriveURL);
router.get("/calendar/list/:projectID", CalendarList);
router.post("/calendar/share/:projectID", ShareCalendar);
router.get("/calendar/url/:projectID", getGoogleCalendarURL);
router.get("/leave/:projectID", leaveProject);
router
  .route("/:projectId")
  .get(getProjectData)
  .put(UpdateProject)
  .delete(deleteProject);
module.exports = router;
