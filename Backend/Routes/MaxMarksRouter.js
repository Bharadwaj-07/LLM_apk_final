const express = require("express");
const router = express.Router();
const MaxMarks = require("../models/MaxMarks");

// Set maximum marks for a course
router.post("/setmaxmarks", async (req, res) => {
    try {
        const { classId, test1, test2, endSem } = req.body;
        console.log(req.body,"maxMarks");
        const existingRecord = await MaxMarks.findOne({ classId });

        if (existingRecord) {
            existingRecord.test1 = test1;
            existingRecord.test2 = test2;
            existingRecord.endSem = endSem;
            await existingRecord.save();
        } else {
            await MaxMarks.create({ classId, test1, test2, endSem });
        }

        res.status(200).json({ message: "Max marks updated successfully." });
    } catch (error) {
        console.error("Error setting max marks:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get maximum marks for a course
router.post("/getmaxmarks", async (req, res) => {
    try {
        const { classId } = req.body;
        const maxMarks = await MaxMarks.findOne({ classId });
        console.log(classId,"Class");
        if (!maxMarks) {
            return res.status(404).json({ message: "No max marks found." });
        }

        res.status(200).json({ data: maxMarks });
    } catch (error) {
        console.error("Error retrieving max marks:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
