const express = require("express");
const {
  GetModules,
  DeleteModule,
  CreateModule,
  updateModule,
} = require("../controllers/ModuleController");

const router = express.Router();

router.route("/all/:projectID").get(GetModules).post(CreateModule);
router.route("/:moduleID").delete(DeleteModule).put(updateModule);
module.exports = router;
