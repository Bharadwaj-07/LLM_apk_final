const mongoose = require('mongoose')
const Attendance = new mongoose.Schema({
    date: {
        type: String,
        required: [true, "Date is required"],
    },
    course:{
        type:String,
        required:true,
    },
    attendance:{
        type:Array,
        required:true,
    }
});
Attendance.index({date:1,course:1},{unique:true});
module.exports = mongoose.model('Attendance', Attendance);