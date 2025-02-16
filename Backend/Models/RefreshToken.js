const mongoose = require("mongoose")
const RefreshToken = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: String,
        required: true, ref: "LoginDetails"
    },
    expiresAt: {
        type: Date,
        required: true
    },

});
RefreshToken.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
module.exports = mongoose.model('RefreshToken', RefreshToken);