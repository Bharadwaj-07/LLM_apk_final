const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');

// Fetch all notices
router.get('/:course', async (req, res) => {
    const {course}=req.params;
    try {
        const notices = await Notice.find({course}).sort({ timestamp: 1 }); // Latest first
        res.json(notices);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching notices' });
    }
});

// Post a new notice
router.post('/add/:course', async (req, res) => {
    const { message, uname,isAdmin } = req.body;
    const {course}=req.params;
    if (!message || !uname) {
        return res.status(400).json({ error: 'Message and username are required' });
    }

    try {
        const newNotice = new Notice({ course,message, uname,isAdmin });
        await newNotice.save();
        res.json({ success: true, notice: newNotice });
    } catch (error) {
        res.status(500).json({ error: 'Error adding notice' });
    }
});

module.exports = router;
