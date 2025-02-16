const express = require("express");
const router = express.Router();
const quizController = require("../controller/QuizController");

router.get("/", quizController.getQuizzes);

router.post("/", quizController.createQuiz);
router.delete("/:id", quizController.deleteQuiz);
router.get('/:courseId/:quizNumber/:studentId',quizController.studentQuiz);
router.get('/:courseId/:quizNumber',quizController.QuizStats);
router.post('/submitQuiz',quizController.submitQuiz);
module.exports = router;
