const mongoose = require('mongoose')
const LoginDetails = new mongoose.Schema({
    Username: {
        type: String,
        required: true,
        unique: true,
        ref:"profiles"
    },
    Password: {
        type: String,
        required: true
    },

});
LoginDetails.index({Username:1},{unique:true});
module.exports = mongoose.model('LoginDetails', LoginDetails);