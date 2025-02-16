const mongoose = require('mongoose');

const MaxMarksSchema = new mongoose.Schema(
    {
        classId: {
            type: String,
            required: true,
        },
        test1: {
            type: String,
            min: 0,
        },
        test2: {
            type: String,
            min: 0,
        },
        endSem: {
            type: String,
            min: 0,
        },
    },
    {
        collection: 'MaxMarks',
        timestamps: true,
    }
);
MaxMarksSchema.index({ userId: 1, classId: 1 }, { unique: true });
module.exports = mongoose.model('MaxMarks', MaxMarksSchema);
