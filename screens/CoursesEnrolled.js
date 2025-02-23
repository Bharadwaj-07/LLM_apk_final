import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import CardDetails from '../components/CardDetails';
import { GLOBAL_CONFIG } from '../components/global_config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
const CoursesEnrolled = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    const fetchClasses = async () => {
        const userId = await AsyncStorage.getItem('uname');
        axios.post(`https://${GLOBAL_CONFIG.SYSTEM_IP}/createClass/user`, { userId: userId })
            .then((response) => {
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
            <View style={styles.centered}>
                <Text>Loading classes...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>Error loading classes: {error}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
             <ScrollView contentContainerStyle={[styles.scrollViewContent, { paddingBottom: 60 }]}>
                {classes.length > 0 ? (
                    classes.map((classItem) => (
                        <CardDetails
                            key={classItem._id}
                            course={classItem.className}
                            subject={classItem.subjectName}
                            instructor={classItem.instructorName}
                            id={classItem._id}
                            fetchClasses={fetchClasses}
                            navigation={navigation}
                        />
                    ))
                ) : (
                    <View style={styles.noCoursesContainer}>
                        <Text style={styles.noCoursesText}>No Courses Enrolled</Text>
                    </View>
                )}
            </ScrollView>

            {/* Floating Add Course Button */}


            {/* Fixed Bottom Navigation Buttons */}
            <View style={styles.fixedButtonContainer}>
                <View style={styles.fixedButtonContainer}>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            navigation.isFocused() ? styles.activeButton : styles.inactiveButton
                        ]}
                        onPress={() => navigation.navigate('CoursesEnrolled')}
                    >
                        <Ionicons name="book" size={22} color="white" />
                        <Text style={styles.buttonText}>Courses Enrolled</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.button,
                            navigation.isFocused() ? styles.inactiveButton : styles.activeButton
                        ]}
                        onPress={() => navigation.navigate('CoursesAvailable')}
                    >
                        <Ionicons name="reader-outline" size={22} color="white" />
                        <Text style={styles.buttonText}>Courses Available</Text>
                    </TouchableOpacity>
                </View>

            </View>

        </SafeAreaView>
    );
};

export default CoursesEnrolled;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noCoursesContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noCoursesText: {
        fontSize: 18,
        color: '#6C757D',
        textAlign: 'center',
    },
    /* Floating Add Course Button */
    floatingButton: {
        position: 'absolute',
        bottom: 90, // Adjusted to stay above the bottom nav
        right: 20,
        backgroundColor: '#007BFF',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    floatingButtonText: {
        fontSize: 30,
        color: 'white',
        fontWeight: 'bold',
    },
    /* Fixed Bottom Buttons */
    fixedButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#D4BEE4',
         // Reduced height
        borderTopWidth: 1,
        borderColor: '#ddd',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        zIndex: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    button: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        flex: 1,  // Equal width for both buttons
    },
    activeButton: {
        backgroundColor: '#3C0A6B',
        opacity: 1, // Fully visible when selected
        paddingVertical: 10, 
    },
    inactiveButton: {
        backgroundColor: 'transparent',
        opacity: 0.6, // Faded when not selected
    },
    buttonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 3, // Space between icon and text
    },
    scrollViewContent: { flexGrow: 1, paddingBottom: 60 }, // Ensure bottom spacing
});
