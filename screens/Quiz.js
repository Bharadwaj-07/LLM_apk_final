import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import axios from "axios";
import { RadioButton } from "react-native-paper";
import { GLOBAL_CONFIG } from "../components/global_config";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

const Quiz = ({ route, navigation }) => {
    const { quizNumber, courseId, admin, userId } = route.params;
    const studentId = userId;

    const [quiz, setQuiz] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [previousAttempts, setPreviousAttempts] = useState([]);
    const [totalAttempts, setTotalAttempts] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        fetchQuiz();
    }, []);

    const shuffleOptions = (options) => {
        return options.sort(() => Math.random() - 0.5);
    };

    const fetchQuiz = async () => {
        try {
            const url = `http://${GLOBAL_CONFIG.SYSTEM_IP}:5000/quiz/${courseId}/${quizNumber}/${studentId}`;
            console.log("Fetching Quiz from:", url);

            const response = await axios.get(url);
            const quizData = response.data.quiz;

            // Shuffle options for each question
            const shuffledQuiz = {
                ...quizData,
                questions: quizData.questions.map((q) => ({
                    ...q,
                    shuffledOptions: shuffleOptions([...q.options]),
                })),
            };

            setQuiz(shuffledQuiz);
            setPreviousAttempts(response.data.previousAttempts);
            setTotalAttempts(response.data.totalAttempts);
        } catch (error) {
            console.error("Error fetching quiz:", error);
            Alert.alert("Error", "Failed to load quiz.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAnswer = (questionId, option) => {
        setSelectedAnswers({ ...selectedAnswers, [questionId]: option });
    };

    const submitQuiz = async () => {
        try {
            const formattedAnswers = quiz.questions.map((q, index) => ({
                questionId: index,
                selectedOption: selectedAnswers[index] || "",
            }));

            console.log(formattedAnswers);

            const response = await axios.post(`http://${GLOBAL_CONFIG.SYSTEM_IP}:5000/quiz/submitQuiz`, {
                studentId,
                quizNumber,
                courseId,
                answers: formattedAnswers,
            });

            Alert.alert("Submitted!", `Your score: ${response.data.score}`);
            setSubmitted(true); // Set submitted to true after submitting
            fetchQuiz();
        } catch (error) {
            console.error("Error submitting quiz:", error);
            Alert.alert("Error", "Failed to submit quiz.");
        }
    };

    if (loading) return <ActivityIndicator size="large" color="#007bff" />;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5", padding: 15 }}>
            <ScrollView>
                <View style={{ padding: 15 }}>
                    <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>{quiz.title}</Text>

                    <TouchableOpacity
                        style={{
                            backgroundColor: "#3C0A6B",
                            padding: 15,
                            borderRadius: 5,
                            marginTop: 20,
                        }}
                        onPress={() => navigation.navigate("QuizStats", { quizNumber, courseId })}
                    >
                        <Text style={{ color: "white", fontSize: 18, textAlign: "center" }}>Quiz Stats</Text>
                    </TouchableOpacity>

                    {previousAttempts.length > 0 && (
                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ fontSize: 18, marginBottom: 10 }}>Total Attempts : {totalAttempts}</Text>
                            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Previous Scores :</Text>
                            {previousAttempts.map((attempt, index) => (
                                <Text key={index} style={{ fontSize: 16, color: "green" }}>
                                    Attempt {index + 1} : {attempt.score} / {quiz.questions.length}
                                </Text>
                            ))}
                        </View>
                    )}

                    {quiz.questions.map((question, index) => (
                        <View
                            key={index}
                            style={{
                                backgroundColor: "#FFF",
                                padding: 15,
                                borderRadius: 10,
                                marginVertical: 10,
                                elevation: 3,
                            }}
                        >
                            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                                Question : {index + 1}
                                {"\n\n"}
                                {question.questionText}
                            </Text>

                            {question.shuffledOptions.map((option, optionIndex) => {
                                const isSelected = selectedAnswers[index] === option;
                                const isCorrect = option === question.correctAnswer;
                                const isWrong = isSelected && !isCorrect;

                                return (
                                    <TouchableOpacity
                                        key={optionIndex}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            marginTop: 5,
                                            padding: 10,
                                            borderRadius: 8,
                                            backgroundColor: isSelected
                                                ? isCorrect
                                                    ? "#D4EDDA" // Green for correct answer
                                                    : "#F8D7DA" // Red for wrong answer
                                                : "#E8F0FE", // Default color
                                        }}
                                        onPress={() => handleSelectAnswer(index, option)}
                                    >
                                        <RadioButton
                                            value={option}
                                            status={isSelected ? "checked" : "unchecked"}
                                            onPress={() => handleSelectAnswer(index, option)}
                                        />
                                        <Text style={{ fontSize: 16 }}>{option}</Text>
                                    </TouchableOpacity>
                                );
                            })}

                            {/* Show correct answer if admin OR quiz has been submitted */}
                            {(admin || submitted) && (
                                <Text style={{ fontSize: 16, color: "green", marginTop: 5, paddingTop: 3 }}>
                                    Correct Answer : {question.answer}
                                </Text>
                            )}
                        </View>
                    ))}

                    {!admin && (
                        <TouchableOpacity
                            onPress={submitQuiz}
                            style={{
                                backgroundColor: "#3C0A6B",
                                padding: 15,
                                borderRadius: 5,
                                marginTop: 20,
                            }}
                        >
                            <Text style={{ color: "white", fontSize: 18, textAlign: "center" }}>Submit Quiz</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Quiz;
