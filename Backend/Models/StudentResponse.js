const StudentResponseSchema = new mongoose.Schema({
    studentId: String,
    quizNumber:String,
    courseId: String,  // Added course ID
    attempts: Number,  // Number of attempts
    responses: [
        {
            answers: [
                {
                    questionId: String,
                    selectedOption: String
                }
            ],
            score: Number
        }
    ]
});

module.exports = mongoose.model('StudentResponse', StudentResponseSchema);
