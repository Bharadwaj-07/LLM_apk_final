const express = require('express');
const router = express.Router();
const JoinClass = require('../models/JoinClassModel');
const Profile = require('../models/Profile');
const CourseModel = require('../models/Course');
const MarksModel = require('../models/MarksModel')
router.post('/join', async (req, res) => {
    let { userId, classId, username } = req.body;
    console.log("join post router");
    console.log(req.body);
    console.log(userId);
     userId = userId.toLowerCase();
    if (!userId || !classId || !username) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        console.log("hello");

        // Create a new JoinClass instance
        const mark=await JoinClass.findOne({userId,classId});
        if (mark!==null) {  
            return res.json({ message: "Already Joined", data: false });
        }
        const newJoin = new JoinClass({ userId, classId, username });
        console.log(newJoin);
        
        const user = userId.toLowerCase();

        const student=await Profile.findOne({uname:user});
        console.log(student);
        console.log(student._id);
        console.log(classId);
        const marked=await MarksModel.findOne({userId:userId});
        console.log(marked);
       {
        const marks = new MarksModel({
                    name:username,
                    userId: user,
                    classId: classId,
                    test1:"-",
                    test2:"-",
                    endSem:"-"
                });
                const savedMarks=await marks.save();
            }
        
        // Update the students array in the Course model
        const updatedCourse = await CourseModel.findOneAndUpdate(
            { courseCode: classId }, 
            { $addToSet: { students: student._id } }, 
            { new: true }
        );
        const savedJoin = await newJoin.save();
        console.log(updatedCourse);
        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found for the given classId' });
        }

        res.status(201).json({
            message: 'User successfully joined the class and added to the course',
            data: true,
        });
    } catch (error) {
        console.error('Error joining class:', error);
        res.status(500).json({ message: 'Failed to join class', error: error.message });
    }
});

router.get('/class/:classId', async (req, res) => {
    const { classId } = req.params;

    try {
        const usersInClass = await JoinClass.find({ classId }).populate('userId', 'username');
        if (!usersInClass || usersInClass.length === 0) {
            return res.status(404).json({ message: 'No users found in this class' });
        }

        res.status(200).json({
            message: 'Users retrieved successfully',
            data: usersInClass,
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
});

module.exports = router;
