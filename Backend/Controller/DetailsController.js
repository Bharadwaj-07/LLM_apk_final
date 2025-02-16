const res = require("express/lib/response")
const jwt = require("jsonwebtoken");
const Profile=require("../models/Profile");
const Admin=require("../models/Admins");
const Course=require("../models/Course")
mongoose = require("mongoose");
require('dotenv').config();

exports.getStudentDetails = async (req, res) => {
    try {
      console.log("Entered getStudentDetails");
      const { courseId } = req.params;
      const courseCode=courseId;
      console.log(courseId);
      if (!courseId) {
        return res.status(400).json({ error: "Course ID is required" });
      }
  
      // Find the course by ID and populate student details
      const course_details = await Course.findOne({courseCode}).populate('students', 'uname name email college number DOB');
      console.log(course_details);
      if (!course_details) {
        return res.status(404).json({ error: "Course not found" });
      }
  
      res.json({ students: course_details.students });
    } catch (error) {
      console.error("Error fetching student details:", error);
      res.status(500).json({ error: "Server error" });
    }
  };

exports.getAdminDetails = async (req, res) => {
  try {
    console.log("Entered getAdminDetails");
    const { course } = req.params;
    console.log(course);
    if (!course) {
      return res.status(400).json({ error: "Course name is required" });
    }

    // Find the admin usernames for the given course
    const adminData = await Admin.findOne({ course });

    if (!adminData || adminData.Admins.length === 0) {
      return res.status(404).json({ error: "No admins found for this course" });
    }

    // Fetch admin details from the profiles collection
    const adminDetails = await Profile.find({ uname: { $in: adminData.Admins } });

    res.json({ admins: adminDetails });
  } catch (error) {
    console.error("Error fetching admin details:", error);
    res.status(500).json({ error: "Server error" });
  }
};
