import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import axios from "axios";
import { GLOBAL_CONFIG } from "../components/global_config";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QuizStats({ navigation, route }) {
    const { quizNumber, courseId } = route.params;
    const [quizStatsData, setQuizStatsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuizStats();
    }, []);

    const fetchQuizStats = async () => {
        try {
            const url = `http://${GLOBAL_CONFIG.SYSTEM_IP}:5000/quiz/${courseId}/${quizNumber}`;
            console.log("Fetching Quiz from:", url);
            const response = await axios.get(url);
            let data = response.data.data;

            console.log("Fetched Data:", data);

            // Ensure quizStatsData is always an array
            setQuizStatsData(Array.isArray(data) ? data : data ? [data] : []);
        } catch (error) {
            console.error("Error fetching quiz:", error);
            alert("Failed to load quiz stats.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("Updated quizStatsData:", quizStatsData);
    }, [quizStatsData]); // Debugging state update

    return (
        <SafeAreaView style={styles.safeArea}>
            <Text style={styles.header}>Quiz {quizNumber}</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" />
            ) : quizStatsData.length === 0 ? (
                <Text style={styles.noDataText}>No attempts found.</Text>
            ) : (
                <FlatList
                    data={quizStatsData}
                    keyExtractor={(item, index) => item._id || index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.studentIdText}>Student : {item.studentId}</Text>
                            <Text style={styles.attemptsText}>Total Attempts : {item.attempts}</Text>

                            {item.responses?.map((attempt, index) => (
                                <View key={index} style={styles.attemptCard}>
                                    <Text style={styles.attemptText}>Attempt : {index + 1}</Text>
                                    <Text style={styles.scoreText}>Score : {attempt.score}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                />
            )}

            <TouchableOpacity style={styles.refreshButton} onPress={fetchQuizStats}>
                <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#F5F5F5", padding: 20 },
    header: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: '#3C0A6B' },
    card: { backgroundColor: "#FFF", padding: 15, borderRadius: 10, marginVertical: 10, elevation: 3 },
    studentIdText: { fontSize: 18, fontWeight: "bold", color: "#3C0A6B" },
    attemptsText: { fontSize: 16, color: "#555", marginTop: 5 },
    attemptCard: { backgroundColor: "#D4BEE4", padding: 10, borderRadius: 8, marginTop: 8 },
    attemptText: { fontSize: 16, fontWeight: "bold", color: "#3C0A6B" },
    scoreText: { fontSize: 16, color: "#3C0A6B", fontWeight: "bold" },
    noDataText: { fontSize: 16, color: "#888", textAlign: "center", marginTop: 20 },
    refreshButton: { backgroundColor: "#3C0A6B", padding: 12, borderRadius: 8, marginTop: 20, alignItems: "center" },
    refreshButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
