const express = require("express");
const router = express.Router();
const DetailsController=require("../Controller/DetailsController");
router.get("/:courseId/students",DetailsController.getStudentDetails);
router.get("/:course/admins",DetailsController.getAdminDetails);
module.exports = router;