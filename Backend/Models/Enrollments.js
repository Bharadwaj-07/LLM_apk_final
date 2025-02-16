const mongoose = require('mongoose')
const Enrollment = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        ref: "LoginDetails",
        unique:true,
    },
    courses: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"courses"
    }]

});
Enrollment.index({user:1},{unique:true});
module.exports = mongoose.model('Enrollments', Enrollment);