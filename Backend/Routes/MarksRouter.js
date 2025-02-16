const express = require('express');
const router = express.Router();
const Marks = require('../models/MarksModel');

router.post('/setmarks', async (req, res) => {
    const marksList = req.body.students; // Assuming this is an array of marks objects
    console.log("marks",marksList);
    if ( marksList.length === 0) {
        return res.status(400).json({ message: 'Marks list is required and should not be empty.' });
    }

    try {
        // Use `Promise.all` to handle multiple updates in parallel
        console.log("Entering updation");
        const updatedMarks = await Promise.all(
            marksList.map(async (marks) => {
                const { userId, classId, test1, test2, endSem } = marks;
                console.log("User",userId, classId, test1, test2, endSem)
                if (!userId || !classId) {
                    throw new Error('userId and classId are required for each entry.');
                }

                // Update or insert each entry
                return await Marks.findOneAndUpdate(
                    { userId, classId }, // Find by userId and classId
                    { $set: { test1, test2, endSem } }, // Update the marks fields
                    { new: true, upsert: true } // Return updated doc, create if not exists
                );
            })
        );

        res.status(201).json({
            message: 'Marks added/updated successfully for all students.',
            data: updatedMarks,
        });
    } catch (error) {
        console.error('Error posting marks:', error);
        res.status(500).json({ message: 'Failed to add/update marks', error: error.message });
    }
});

router.post('/getmarks/student',async(req,res)=>{
    const classId=req.body.course;
    const userId=req.body.user;
    console.log(classId,userId,"user");
    try{
        const marks = await Marks.findOne({ classId:classId,userId:userId });
        console.log(marks.test1);
        res.status(200).json({test1:marks.test1,test2:marks.test2,endSem:marks.endSem});
    }
    catch(e){
        console.log(e);
    }
})
// GET: Get all marks for a specific class
router.post('/getmarks', async (req, res) => {
    console.log("Hello");
    const classId  = req.body.course;
    console.log(req.body)
    
    console.log(classId)


    try {
        const marks = await Marks.find({ classId:classId });
        console.log(marks,"marks");
        if (!marks || marks.length === 0) {
            return res.status(200).json({ message: 'No marks found for this class',empty:true,data:[] });
        }

        res.status(200).json({
            message: 'Marks retrieved successfully',
            data: marks,
            empty:false,
        });
    } catch (error) {
        console.error('Error fetching marks:', error);
        res.status(500).json({ message: 'Failed to fetch marks', error: error.message });
    }
});

// GET: Get marks for a specific student
router.get('/student/:userId/:classId', async (req, res) => {
    const { userId, classId } = req.params;

    try {
        const marks = await Marks.find({ userId, classId });

        if (!marks || marks.length === 0) {
            return res.status(404).json({ message: 'No marks found for this student' });
        }

        res.status(200).json({
            message: 'Marks retrieved successfully',
            data: marks,
        });
    } catch (error) {
        console.error('Error fetching marks:', error);
        res.status(500).json({ message: 'Failed to fetch marks', error: error.message });
    }
});

module.exports = router;
