const express = require("express");
const {
  createProject,
  GetAllProject,
  InviteBylink,
  InviteByemails,
  getProjectData,
} = require("../controllers/ProjectController");

const router = express.Router();

router.route("/").get(GetAllProject).post(createProject);
router.get("/inviteLink/:projectID", InviteBylink);
router.post("/inviteEmails", InviteByemails);
router.route("/:projectId").get(getProjectData);
module.exports = router;
