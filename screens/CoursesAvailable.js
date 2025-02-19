import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import CourseDetailsToJoin from '../components/CourseDetailsToJoin';
import { GLOBAL_CONFIG } from '../components/global_config';
import Ionicons from '@expo/vector-icons/Ionicons';

const CoursesAvailable = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    const fetchCourses = () => {
        axios.get(`https://${GLOBAL_CONFIG.SYSTEM_IP}/coursesAvailable`)
            .then((response) => {
                setCourses(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchCourses();
        }, [])
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text>Loading courses...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>Error loading courses: {error}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {courses.length > 0 ? (
                    courses.map((item) => (
                        <CourseDetailsToJoin
                            key={item._id}
                            course={item.subject}
                            instructor={item.instructor}
                            courseId={item.classId}
                        />
                    ))
                ) : (
                    <View style={styles.noCoursesContainer}>
                        <Text style={styles.noCoursesText}>No Courses Available</Text>
                    </View>
                )}
            </ScrollView>

            <View style={styles.fixedButtonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Ionicons name="book" size={22} color="white" />
                    <Text style={styles.buttonText}>Courses Enrolled</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.activeButton]}
                    onPress={() => navigation.navigate('CoursesAvailable')}
                >
                    <Ionicons name="reader-outline" size={22} color="white" />
                    <Text style={styles.buttonText}>Courses Available</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default CoursesAvailable;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    noCoursesContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    noCoursesText: { fontSize: 18, color: '#6C757D', textAlign: 'center' },
    fixedButtonContainer: {
        flexDirection: 'row',
        backgroundColor: '#D4BEE4',
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    button: { flex: 1, paddingVertical: 10, alignItems: 'center' },
    activeButton: { backgroundColor: '#3C0A6B' },
    buttonText: { color: 'white', fontSize: 12, fontWeight: 'bold', marginTop: 3 },
});
