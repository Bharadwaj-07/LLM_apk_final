import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GLOBAL_CONFIG } from "../components/global_config";
import { LogBox } from 'react-native';



const StudentMarks = ({ navigation, route }) => {

    const course = route.params.course;
    const [marks, setMarks] = useState(null);
    const [stats, setStats] = useState({});
    const [maxMarks, setMaxMarks] = useState({ test1: "-", test2: "-", endSem: "-" });
    const getMaxMarks = async () => {
        try {
            const response = await axios.post(`http://${GLOBAL_CONFIG.SYSTEM_IP}:${GLOBAL_CONFIG.PORT}/maxmarks/getmaxmarks`, {
                classId: course,
            });
            console.log(response);
            if (response.data.data) {
                setMaxMarks(response.data.data);
            }
        } catch (e) {
            console.error("Error fetching max marks:", e);
        }
    };
    LogBox.ignoreLogs([
        'VirtualizedLists should never be nested',
    ]);
    const getStudents = async () => {
        try {
            let user = await AsyncStorage.getItem("uname");
            user = user.toLowerCase();
            const response = await axios.post(
                `http://${GLOBAL_CONFIG.SYSTEM_IP}:${GLOBAL_CONFIG.PORT}/marks/getmarks/student`,
                { course: course, user: user }
            );

            if (response.data && Object.keys(response.data).length > 0) {
                setMarks(response.data);
                calculateStats(response.data);
            } else {
                setMarks(null);
                setStats({});
            }
        } catch (e) {
            console.error(e);
            setMarks(null);
            setStats({});
        }
    };

    useEffect(() => {
        getMaxMarks();
        getStudents();
    }, []);

    const calculateStats = async () => {
        try {
            const response = await axios.post(
                `http://${GLOBAL_CONFIG.SYSTEM_IP}:${GLOBAL_CONFIG.PORT}/marks/getmarks`,
                { course: course }
            );
            console.log("Stats API Response:", response.data);

            if (!response.data || response.data.length === 0) {
                setStats({
                    test1: { highest: "-", minimum: "-", average: "-" },
                    test2: { highest: "-", minimum: "-", average: "-" },
                    endSem: { highest: "-", minimum: "-", average: "-" },
                });
                return;
            }

            let computedStats = {};
            ["test1", "test2", "endSem"].forEach(test => {
                const validMarks = response.data.data
                    .map((studentMarks) => Number(studentMarks[test]))
                    .filter((val) => Number.isFinite(val));

                computedStats[test] = validMarks.length > 0
                    ? {
                        highest: Math.max(...validMarks),
                        minimum: Math.min(...validMarks),
                        average: (validMarks.reduce((a, b) => a + b, 0) / validMarks.length).toFixed(2),
                    }
                    : { highest: "-", minimum: "-", average: "-" };
            });

            console.log("Computed Stats:", computedStats);
            setStats(computedStats);
        } catch (error) {
            console.error(error);
            setStats({});
        }
    };


    const getFormattedKey = (key) => {
        const keyMapping = {
            test1: "Test 1",
            test2: "Test 2",
            endSem: "End Semester"
        };

        return keyMapping[key] || key;
    };

    const renderMarks = ({ item }) => (
        <View style={styles.markCard}>
            <Text style={styles.markLabel}>{getFormattedKey(item.key)} :</Text>
            <Text style={styles.markValue}>{item.value}</Text>
            {stats[item.key] && (
                <View style={styles.statsContainer}>
                    <Text style={styles.statsText}>🎯 Total Marks : {maxMarks[item.key]}</Text>
                    <Text style={styles.statsText}>📊 Highest : {stats[item.key]?.highest}</Text>
                    <Text style={styles.statsText}>📉 Lowest : {stats[item.key]?.minimum}</Text>
                    <Text style={styles.statsText}>📈 Average : {stats[item.key]?.average}</Text>

                </View>
            )}
        </View>
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>Your Marks</Text>
                <View style={styles.border}>
                    {marks ? (
                        <FlatList
                            nestedScrollEnabled={true}
                            data={Object.entries(marks).map(([key, value]) => ({ key, value }))}
                            keyExtractor={(item) => item.key}
                            renderItem={renderMarks}
                        />
                    ) : (
                        <Text style={styles.noData}>No marks available</Text>
                    )}
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default StudentMarks;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#FFFDF0",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: "#3C0A6B",
    },
    noData: {
        textAlign: "center",
        color: "#3C0A6B",
        fontSize: 16,
    },
    markCard: {
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        marginBottom: 10,
        backgroundColor: "#E9DFF3",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    markLabel: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#3C0A6B",
    },
    markValue: {
        fontSize: 19,
        color: "#3C0A6B",
        fontWeight: 'bold'
    },
    border: {
        borderWidth: 1,
        borderColor: "#3C0A6B",
        borderRadius: 8,
        padding: 10,
    },
    statsContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: "#D4BEE4",
        borderRadius: 8,
        alignItems: "center",
        width: "100%",
    },
    statsText: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#3C0A6B",
        paddingBottom: 3
    },
});
