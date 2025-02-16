import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { GLOBAL_CONFIG } from '../components/global_config';

export default function InstructorStudentList({ route }) {
    const { courseId } = route.params;
    console.log(courseId);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [admins, setAdmins] = useState([]);
    const course = courseId;

    const fetchAdminDetails = async () => {
        try {
            const response = await axios.get(`http://${GLOBAL_CONFIG.SYSTEM_IP}:${GLOBAL_CONFIG.PORT}/details/${course}/admins`);
            setAdmins(response.data.admins || []); // ✅ Corrected to set `admins`
        } catch (error) {
            console.error("Error fetching instructor list:", error); // ✅ Updated error message
        } finally {
            setLoading(false);
        }
    };

    const fetchStudentDetails = async () => {
        try {
            const response = await axios.get(`http://${GLOBAL_CONFIG.SYSTEM_IP}:${GLOBAL_CONFIG.PORT}/details/${courseId}/students`);
            setStudents(response.data.students || []);
        } catch (error) {
            console.error("Error fetching student list:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchStudentDetails();
        fetchAdminDetails();

    }, []);
    if (loading) {
        return <ActivityIndicator size="large" color="#3C0A6B" style={styles.loader} />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.teacher}>
                {/* Instructors Section */}
                <Text style={styles.header}>Teacher</Text>
                {admins.length > 0 ? (
                    <FlatList
                        data={admins}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <View style={[styles.userItem, styles.adminItem]}>
                                <Text style={styles.boldText}>{item.name}  ( Username : {item.uname} )</Text>
                                <Text style={styles.subText}>Email : {item.email}</Text>
                            </View>
                        )}
                    />
                ) : (
                    <Text style={styles.noData}>No instructors assigned.</Text>
                )}
            </View>
            <View>
                {/* Students Section */}
                <Text style={styles.header}>Students Enrolled</Text>
                {students.length > 0 ? (
                    <FlatList
                        data={students}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <View style={styles.userItem}>
                                <Text style={styles.boldText}>{item.name}  ( Username : {item.uname} )</Text>
                                <Text style={styles.subText}>Email : {item.email}</Text>
                            </View>
                        )}
                    />
                ) : (
                    <Text style={styles.noData}>No students enrolled.</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F6F4',
        padding: 20,
    },
    teacher: {
        marginBottom: 20,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#3C0A6B',
    },
    userItem: {
        padding: 10,
        backgroundColor: '#D4BEE4', // Light blue for students
        marginBottom: 5,
        borderRadius: 8,
    },
    adminItem: {
        backgroundColor: '#D0E8FF', // Yellow for instructors
    },
    boldText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    subText: {
        fontSize: 14,
        color: 'purple',
        paddingTop: 5,
    },
    noData: {
        fontSize: 16,
        fontStyle: 'italic',
        color: 'gray',
        textAlign: 'center',
        marginVertical: 10,
    },
    loader: {
        marginTop: 50,
    },
});