const mongoose = require('mongoose');

const joinClassSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        classId: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            trim: true,
        },
        joinedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        collection: 'joinClasses',
        timestamps: true,
    }
);
// joinClassSchema.index({ userId: 1, classId: 1 }, { unique: true });
module.exports = mongoose.model('JoinClass', joinClassSchema);
