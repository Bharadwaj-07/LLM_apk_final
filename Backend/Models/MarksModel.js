const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
        },
        userId: {
            type: String,
            required: true,
        },
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
        collection: 'marks',
        timestamps: true,
    }
);
// marksSchema.index({ userId: 1, classId: 1 }, { unique: true });
module.exports = mongoose.model('Marks', marksSchema);
