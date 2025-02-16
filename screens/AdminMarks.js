import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { GLOBAL_CONFIG } from "../components/global_config";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { LogBox } from 'react-native';

const AdminMarks = ({ navigation, route }) => {
    const course = route.params.course;
    const [selectedTest, setSelectedTest] = useState('');
    const [students, setStudents] = useState([]);
    const [message, setMessage] = useState([]);
    const [stats, setStats] = useState({ highest: "-", lowest: "-", average: "-" });
    const [maxMarks, setMaxMarks] = useState({ test1: "-", test2: "-", endSem: "-" });
    const [maxMarksLocal, setMaxMarksLocal] = useState({ test1: "-", test2: "-", endSem: "-" });
    const getMaxMarks = async () => {
        try {
            const response = await axios.post(`http://${GLOBAL_CONFIG.SYSTEM_IP}:5000/maxmarks/getmaxmarks`, { classId: course });
            if (response.data.data) {
                setMaxMarks(response.data.data);
                setMaxMarksLocal(response.data.data);
            }
        } catch (e) {
            console.error("Error fetching max marks:", e);
        }
    };
    LogBox.ignoreLogs([
        'VirtualizedLists should never be nested',
    ]);
    const updateMaxMarks = async () => {
        if (!selectedTest) return Alert.alert("Error", "Please select a test.");
        try {
            await axios.post(`http://${GLOBAL_CONFIG.SYSTEM_IP}:5000/maxmarks/setmaxmarks`, {
                classId: course,
                test1: maxMarksLocal["test1"],
                test2: maxMarksLocal["test2"],
                endSem: maxMarksLocal["endSem"]
            });
            setMaxMarks(prev => ({ ...prev, [selectedTest]: maxMarksLocal[selectedTest] }));
            Alert.alert("Success", "Max Marks updated successfully!");
        } catch (e) {
            console.error("Error updating max marks:", e);
        }

    };

    const getStudents = async () => {
        try {
            const response = await axios.post(`http://${GLOBAL_CONFIG.SYSTEM_IP}:5000/marks/getmarks`, { course: course });
            setStudents(response.data.data);
            setMessage(response.data.empty);
            calculateStats(response.data.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        getStudents();
        getMaxMarks();
    }, []);

    const calculateStats = (studentsData) => {
        const testTypes = ["test1", "test2", "endSem"];
        let newStats = {};
        testTypes.forEach(test => {
            let validMarks = studentsData.map(student => student[test]).filter(mark => mark !== "-").map(Number);
            newStats[test] = validMarks.length > 0 ? {
                highest: Math.max(...validMarks),
                lowest: Math.min(...validMarks),
                average: (validMarks.reduce((sum, mark) => sum + mark, 0) / validMarks.length).toFixed(2)
            } : { highest: "-", lowest: "-", average: "-" };
        });
        setStats(newStats);
    };

    const handleMarksChange = (id, value) => {
        setStudents(prev => prev.map(student => student._id === id ? { ...student, [selectedTest]: value } : student));
    };

    useEffect(() => { if (students.length > 0) calculateStats(students); }, [students]);

    const handleSubmit = async (selectedTest) => {
        if (!selectedTest) {
            return Alert.alert("Error", "Please select a test.");
        }
        const validMarks=students.some(student=>student[selectedTest]<=maxMarks[selectedTest]&&student[selectedTest]>=0);
        if(!validMarks){
            return Alert.alert("Alert", `Some students have invalid entries for ${selectedTest}. Please verify : \n1. If Maximum marks are entered.\n2. If marks for all the students have been entered.\n3.Students' marks are not greater than Maximum marks`);
 
        }
        // Check if any student has an empty marks field for the selected test
        const hasEmptyMarks = students.some(student => 
            !student[selectedTest] || student[selectedTest].trim() === ""
        );
    
        if (hasEmptyMarks) {
            return Alert.alert("Error", `Some students have empty marks for ${selectedTest}. Please fill in all marks.`);
        }
    
        try {
            await axios.post(`http://${GLOBAL_CONFIG.SYSTEM_IP}:5000/marks/setmarks`, { students });
            Alert.alert("Marks updated");
        } catch (e) {
            console.log(e);
            Alert.alert("Error", "Failed to update marks. Try again.");
        }
    };
    
    

    const renderStudent = ({ item }) => (
        <View style={styles.studentCard}>
            <Text style={styles.studentName}>{item.name}</Text>
            <TextInput style={styles.input} keyboardType="numeric" placeholder="Marks"
                value={item[selectedTest] === "-" ? "" : item[selectedTest]}
                onChangeText={(value) => handleMarksChange(item._id, value)} />
        </View>
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.container}>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={selectedTest}
                                    onValueChange={(value) => setSelectedTest(value)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Select Test" value="" />
                                    <Picker.Item label="Test 1" value="test1" />
                                    <Picker.Item label="Test 2" value="test2" />
                                    <Picker.Item label="End Semester" value="endSem" />
                                </Picker>
                            </View>

                            {/* Max Marks Input */}
                            {selectedTest && (
                                <View style={styles.maxMarksContainer}>
                                    <Text style={styles.maxMarksTitle}>Max Marks for {selectedTest === "test1" ? "Test 1" : selectedTest === "test2" ? "Test 2" : selectedTest === "endSem" ? "End Semester" : selectedTest}</Text>
                                    <TextInput
                                        style={styles.maxMarksInput}
                                        keyboardType="numeric"
                                        placeholder="Enter Marks"
                                        value={maxMarksLocal[selectedTest] === "-" ? "" : String(maxMarksLocal[selectedTest])}
                                        onChangeText={(value) => setMaxMarksLocal(prev => ({ ...prev, [selectedTest]: value }))}
                                    />
                                    <TouchableOpacity style={styles.updateButton} onPress={updateMaxMarks}>
                                        <Text style={styles.updateButtonText}>Update Max Marks</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {/* Statistics */}
                            {selectedTest && stats[selectedTest] && (
                                <View style={styles.statsContainer}>
                                    <Text style={styles.statsTitle}>Performance Overview [ {selectedTest === "test1" ? "Test 1" : selectedTest === "test2" ? "Test 2" : selectedTest === "endSem" ? "End Semester" : selectedTest} ]</Text>
                                    <Text style={styles.statsText}>📊 Highest : {stats[selectedTest]?.highest}</Text>
                                    <Text style={styles.statsText}>📉 Lowest : {stats[selectedTest]?.lowest}</Text>
                                    <Text style={styles.statsText}>📈 Average : {stats[selectedTest]?.average}</Text>
                                    <Text style={styles.statsText}>🎯 Max Marks : {maxMarks[selectedTest]}</Text>
                                </View>
                            )}

                            {/* Students List */}
                            {!message && selectedTest && (
                                <FlatList
                                    data={students}
                                    keyExtractor={(item) => item._id}
                                    renderItem={renderStudent}
                                    contentContainerStyle={styles.list}
                                    keyboardShouldPersistTaps="handled"
                                />
                            )}
                            {message && <Text style={styles.noStudentsText}>No students joined.</Text>}

                            {/* Submit Button */}
                            <TouchableOpacity style={styles.submitButton} onPress={()=>handleSubmit(selectedTest)}>
                                <Text style={styles.submitButtonText}>Submit Marks</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>


    );
};

export default AdminMarks;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: "#4A148C",
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#4A148C",
        borderRadius: 12,
        backgroundColor: "#ECEFF1",
        marginBottom: 20,
    },
    picker: {
        height: 50,
        color: "#4A148C",
    },
    statsContainer: {
        backgroundColor: "#D1C4E9",
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,

    },
    statsTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#4A148C",
        marginBottom: 5,
        textAlign: 'center',
        paddingBottom: 6
    },
    statsText: {
        fontSize: 18,
        color: "#311B92",
        textAlign: 'center',
        paddingBottom: 6
    },
    studentCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        backgroundColor: "#D4BEE4",
        borderRadius: 10,
        marginBottom: 12,
    },
    studentName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#3C0A6B",
        flex: 1,
    },
    input: {
        width: 80,
        padding: 10,
        borderWidth: 1,
        borderColor: "#7B1FA2",
        borderRadius: 8,
        textAlign: "center",
        backgroundColor: "#FFF",
    },
    submitButton: {
        backgroundColor: "#3C0A6B",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    submitButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    noStudentsText: {
        textAlign: "center",
        fontSize: 16,
        color: "#D32F2F",
        marginVertical: 20,
    },
    maxMarksContainer: {
        backgroundColor: "#D1C4E9",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 15
    },
    maxMarksTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#4A148C"
    },
    maxMarksInput: {
        width: 100,
        padding: 10,
        borderWidth: 1,
        borderColor: "#7B1FA2",
        borderRadius: 8,
        textAlign: "center",
        backgroundColor: "#FFF",
        marginVertical: 8,
        fontSize: 15
    },
    updateButton: {
        backgroundColor: "#3C0A6B",
        padding: 10,
        borderRadius: 8,
        marginTop: 5
    },
    updateButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold"
    }
});
