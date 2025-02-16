import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GLOBAL_CONFIG } from '../../components/global_config';
import { createNativeWrapper } from 'react-native-gesture-handler';

export default function MainWindow({ navigation, route }) {
    const course = route.params;
    console.log(course);
    const [userId, setUserId] = useState(null);

    // Fetch user ID from AsyncStorage when the component mounts
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('uname');
                setUserId(storedUserId);
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        };
        fetchUserId();
    }, []);
    const handleNoticeBoard = async () => {
        if (!userId) {
            Alert.alert("Error", "User ID not found!");
            return;
        }
        try {
            const user = userId.toLowerCase();
            console.log(userId, course);
            const response = await axios.post(`http://${GLOBAL_CONFIG.SYSTEM_IP}:${GLOBAL_CONFIG.PORT}/api/Attendance/Admin`, {
                course,
                user,
            });

            navigation.navigate('NoticeBoard', { admin: response.data.admin, course: course });

        } catch (error) {
            console.error("Error fetching attendance data:", error);
            Alert.alert("Error", "Unable to fetch attendance data.");
        }
    };
    const handleProgress = async () => {
        if (!userId) {
            Alert.alert("Error", "User ID not found!");
            return;
        }
        try {
            const user = userId.toLowerCase();
            console.log(userId, course);
            const response = await axios.post(`http://${GLOBAL_CONFIG.SYSTEM_IP}:${GLOBAL_CONFIG.PORT}/api/Attendance/Admin`, {
                course,
                user,
            });
            if (response.data.admin) {
                navigation.navigate('AdminMarks', { course: course });
            } else {
                navigation.navigate('StudentMarks', { course: course });
            }
        } catch (error) {
            console.error("Error fetching attendance data:", error);
            Alert.alert("Error", "Unable to fetch attendance data.");
        }
    };
    const handleAttendance = async () => {
        if (!userId) {
            Alert.alert("Error", "User ID not found!");
            return;
        }
        try {
            const user = userId.toLowerCase();
            console.log(userId, course);
            const response = await axios.post(`http://${GLOBAL_CONFIG.SYSTEM_IP}:${GLOBAL_CONFIG.PORT}/api/Attendance/Admin`, {
                course,
                user,
            });
            if (response.data.admin) {
                navigation.navigate('Dates', { course: route.params });
            } else {
                navigation.navigate('UserDates', { course });
            }
        } catch (error) {
            console.error("Error fetching attendance data:", error);
            Alert.alert("Error", "Unable to fetch attendance data.");
        }
    };
    const handleDetails = async () => {
        navigation.navigate('Participants', { courseId: course });
    };
    const handleQuiz = async () => {
        if (!userId) {
            Alert.alert("Error", "User ID not found!");
            return;
        }
        try {
            const user = userId.toLowerCase();
            console.log(userId, course);
            const response = await axios.post(`http://${GLOBAL_CONFIG.SYSTEM_IP}:${GLOBAL_CONFIG.PORT}/api/Attendance/Admin`, {
                course,
                user,
            });
            if (response.data.admin) {
                navigation.navigate('QuizList', { courseId: route.params, userId: userId, admin: true });
            } else {
                navigation.navigate('QuizList', { courseId: route.params, userId: userId, admin: false });
            }
        } catch (error) {
            console.error("Error fetching attendance data:", error);
            Alert.alert("Error", "Unable to fetch attendance data.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.modalView,]}
                    onPress={handleAttendance}
                >
                    <Text style={styles.buttonText}>Attendance</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalView]} onPress={handleProgress}>
                    <Text style={styles.buttonText}>Progress</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalView]} onPress={handleQuiz}>
                    <Text style={styles.buttonText} >Quiz</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalView]} onPress={handleNoticeBoard}>
                    <Text style={styles.buttonText}>Discussion Board</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalView]} onPress={handleDetails}>
                    <Text style={styles.buttonText}>Participants</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F6F4',
    },
    heading: {
        padding: 8,
    },
    headingText: {
        textAlign: 'center',
        color: '#3C0A6B',
        fontWeight: 'bold',
        fontSize: 45,
        fontFamily: 'Times New Roman',
        paddingLeft: 30,
        paddingRight: 30,
        textShadowColor: 'white',
        textShadowOffset: { width: 5, height: 5 },
        textShadowRadius: 10,
    },
    buttonContainer: {
        flex: 1,
        paddingTop: 30
    },
    modalView: {
        padding: 25,
        margin: 15,
        borderRadius: 8,
        backgroundColor: '#3C0A6B'
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        margin: 10,
        width: 200,
        backgroundColor: '#2196F3',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 21,
    },
});
