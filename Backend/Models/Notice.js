const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
    course:{type:String,required:true},
    message: { type: String, required: true },
    uname: { type: String, required: true }, // Username of the person who posted
    isAdmin: { type: Boolean, default: false }, // New field to check if the sender is an admin
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('notices', NoticeSchema);
