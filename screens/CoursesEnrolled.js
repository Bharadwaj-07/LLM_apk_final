import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import CardDetails from '../components/CardDetails';
import { GLOBAL_CONFIG } from '../components/global_config';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import data from '../env.js'


const CoursesEnrolled = ({ navigation }) => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [admin, setAdminData] = useState({});


    const fetchClasses = async () => {
        const userId = await AsyncStorage.getItem('uname');
        axios.post(`http://${GLOBAL_CONFIG.SYSTEM_IP}:5000/createClass/user`, { userId: userId })
            .then((response) => {
                console.log(response.data)
                setClasses(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchClasses();
        }, [])
    );


    if (loading) {
        return (
            <View style={styles.message}>
                <Text>Loading classes...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.message}>
                <Text>Error loading classes: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {classes.length > 0 ? (
                <ScrollView>
                    {classes.map((classItem) => (
                        <CardDetails
                            key={classItem._id}
                            course={classItem.className}
                            subject={classItem.subjectName}
                            instructor={classItem.instructorName}
                            id={classItem._id}
                            fetchClasses={fetchClasses}
                            navigation={navigation}
                        />
                    ))}
                </ScrollView>
            ) : (
                <View style={styles.noCoursesContainer}>
                    <Text style={styles.noCoursesText}>No Courses Enrolled</Text>
                </View>
            )}
        </View>
    );

}

export default CoursesEnrolled;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    noCoursesContainer: {
        flex: 1,  // Make it take full screen height
        justifyContent: 'center',
        alignItems: 'center',
    },
    noCoursesText: {
        fontSize: 18,
        color: '#6C757D',
        textAlign: 'center',
    },
});
