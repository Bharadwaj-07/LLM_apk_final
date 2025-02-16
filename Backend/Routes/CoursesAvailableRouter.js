const express = require('express');
const Course = require('../models/CoursesAvailableModel')

const router = express.Router();

const storeCourseData = async (req, res) => {
    const { classId, instructor, subject} = req.body;

    try {
        const newCourse = new Course({ classId, instructor, subject });
        await newCourse.save();
        res.status(201).json({ message: 'Course created successfully', course: newCourse });
    } catch (err) {
        res.status(400).json({ message: 'Error creating course', error: err.message });
    }
}

router.post('/', storeCourseData);

router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching courses', error: err.message });
    }
});

module.exports = { router, storeCourseData };
