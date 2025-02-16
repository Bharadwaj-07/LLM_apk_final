const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
    courseId: { type: String, required: true },
    quizNumber: { type: Number, required: true },
    questions: [
        {
            questionText: { type: String, required: true },
            options: { type: [String], required: true },
            answer: { type: String, required: true }
        }
    ]
});

module.exports = mongoose.model("Quiz", QuizSchema);
