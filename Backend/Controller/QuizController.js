const Quiz = require("../models/Quiz");
const StudentResponse = require("../models/StudentResponse");

// 📌 GET all quizzes for a specific course
exports.getQuizzes = async (req, res) => {
  try {
    console.log("Entered getQuizzes");
    const { courseId } = req.query;
    if (!courseId) return res.status(400).json({ error: "Course ID is required" });

    const quizzes = await Quiz.find({ courseId }).sort({ quizNumber: 1 });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// 📌 POST: Submit quiz responses and calculate scores
exports.submitQuiz = async (req, res) => {
  try {
    const { studentId, quizNumber, courseId, answers } = req.body;
    console.log(studentId, quizNumber, courseId, answers);
    // Fetch the quiz using quizNumber and courseId
    const quiz = await Quiz.findOne({ quizNumber, courseId });
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // Calculate score
    let score = 0;
    answers.forEach((ans, index) => {
      if (ans.selectedOption === quiz.questions[index].answer) {
        score += 1;
      }
    });

    // Check if student has previous responses
    let studentResponse = await StudentResponse.findOne({ studentId, quizNumber, courseId });

    if (!studentResponse) {
      // First attempt
      studentResponse = new StudentResponse({
        studentId,
        quizNumber,
        courseId,
        attempts: 1,
        responses: [{ answers, score }]
      });
    } else {
      // Add new attempt
      studentResponse.responses.push({ answers, score });
      studentResponse.attempts += 1;
    }

    await studentResponse.save();

    res.json({ message: "Quiz submitted successfully", attempts: studentResponse.attempts, score });
  } catch (error) {
    res.status(500).json({ message: "Error submitting quiz", error });
  }
};

// 📌 GET: Fetch quiz and student responses
exports.studentQuiz = async (req, res) => {
  console.log("enyteres studenyquiz");
  try {
    const {  courseId,quizNumber, studentId } = req.params;
    console.log(courseId,quizNumber, studentId);
    // Fetch the quiz using quizNumber and courseId
    const quiz = await Quiz.findOne({ quizNumber, courseId });
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    console.log("quiz database good");
    // Fetch student's previous responses (if any)
    const studentResponse = await StudentResponse.findOne({ quizNumber, courseId, studentId });

    res.json({
      quiz,
      previousAttempts: studentResponse ? studentResponse.responses : [],
      totalAttempts: studentResponse ? studentResponse.attempts : 0
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching quiz", error });
  }
};
exports.QuizStats = async (req, res) => {
  console.log("enyteres studenyquiz");
  const {  courseId,quizNumber } = req.params;
  try {
    const studentResponse = await StudentResponse.find({ quizNumber, courseId });

    res.json({
      data: studentResponse ? studentResponse : [],
      
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching quiz", error });
  }
};

// 📌 POST: Create or update a quiz
exports.createQuiz = async (req, res) => {
  try {
    const { courseId, quizNumber, questions } = req.body;

    // Validate input
    if (!courseId || !quizNumber || !questions.length) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Find existing quiz using quizNumber and courseId
    const existingQuiz = await Quiz.findOne({ courseId, quizNumber });

    if (existingQuiz) {
      // Update the existing quiz
      existingQuiz.questions = questions;
      await existingQuiz.save();
      return res.status(200).json({ message: `Quiz ${quizNumber} updated successfully`, quiz: existingQuiz });
    } else {
      // Create a new quiz if it doesn't exist
      const newQuiz = new Quiz({ courseId, quizNumber, questions });
      await newQuiz.save();
      return res.status(201).json({ message: "Quiz created successfully", quiz: newQuiz });
    }
  } catch (error) {
    console.error("Error creating/updating quiz:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 📌 DELETE: Delete a quiz by `quizNumber` and `courseId`
exports.deleteQuiz = async (req, res) => {
  try {
    const { quizNumber, courseId } = req.params;
    const deletedQuiz = await Quiz.findOneAndDelete({ quizNumber, courseId });

    if (!deletedQuiz) return res.status(404).json({ error: "Quiz not found" });

    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
