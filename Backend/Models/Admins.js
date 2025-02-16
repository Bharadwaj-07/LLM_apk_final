const { type } = require('express/lib/response');
const mongoose = require('mongoose')
const Admins = new mongoose.Schema({
    course:{
        type:String,
        required:true,
    },
    Admins:[{
        type:String,
        required:true,
    }]
});
Admins.index({course:1},{unique:true});
module.exports = mongoose.model('Admins', Admins);