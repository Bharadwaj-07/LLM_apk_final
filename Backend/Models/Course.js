const mongoose = require('mongoose');
const { refresh } = require('../Controller/ProfileController');
const SchemaCourse = new mongoose.Schema({
    courseCode: {
        type: String,
        required: [true, "Course Code missing"],
        unique: true,  // Custom error message for validation
    },
    courseName: {
        type: String,
        required: [true, "Course Name missing"],
    },
    instructors: {
        type: Array,
        required: [true, "Instructor missing"],
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'profiles'
    }]
});
SchemaCourse.index({ courseCode: 1 }, { unique: true });
// Create the model based on the schema
module.exports = mongoose.model('courses', SchemaCourse);



