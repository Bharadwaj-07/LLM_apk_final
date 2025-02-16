import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useFocusEffect } from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import { GLOBAL_CONFIG } from './global_config';
// import data from '../env.js'
import {
    PaperProvider,
    Card,
    Button,
    Title,
    Paragraph,
} from 'react-native-paper';


const CardDetails = ({ subject, course, instructor, id, fetchClasses, navigation }) => {
    const handlePress = () => {
        console.log('Card pressed');
        navigation.navigate('Classroom', course);
    };
    const [admin, setAdminData] = React.useState(false);
    const findAdmin = async () => {

        const userId = await AsyncStorage.getItem('uname');
        const user = userId.toLowerCase();
        console.log("User", user);
        try {
            const response = await axios.post(`http://${GLOBAL_CONFIG.SYSTEM_IP}:${GLOBAL_CONFIG.PORT}/api/Attendance/Admin`, {
                course,
                user,
            });
            console.log(response.data.admin);
            setAdminData(response.data.admin);
            return (response.data.admin);
        }
        catch (error) {
            console.error("Error fetching admin data:", error);
            Alert.alert("Error", "Unable to fetch admin data.");
        }
        return false;

    }

    findAdmin();
    const handleLongPress = () => {
        console.log('Card long-pressed');
    };




    const deleteClass = async (classId) => {
        try {

            let userId = await AsyncStorage.getItem('uname');
            console.log(classId, userId);
            const response = await axios.delete(`http://${GLOBAL_CONFIG.SYSTEM_IP}:${GLOBAL_CONFIG.PORT}/createClass/${classId}/${userId}/${admin}/${instructor}`);

            console.log(response.data.message);
            Alert.alert('Success', 'Classroom deleted successfully!');
            fetchClasses()
        } catch (error) {
            console.error('Error deleting class:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <View>
            <ScrollView>
                <Card
                    mode="elevated"
                    onPress={handlePress}
                    onLongPress={handleLongPress}
                    style={{
                        flex: 1, margin: 10, borderWidth: 1,
                        borderColor: '#3C0A6B',
                        borderRadius: 10,
                        shadowColor: '#3C0A6B',
                        shadowOffset: { width: 2, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 10,
                        elevation: 10,
                    }}>
                    < Card.Content >
                        <Title style={{ fontSize: 30, fontWeight: 'bold', marginBottom: '10' }}>{subject}</Title>
                        <Paragraph style={{ fontSize: 21, marginBottom: '10', fontWeight: '500' }}>{instructor}</Paragraph>
                        {admin ? <Paragraph style={{ fontSize: 18, marginBottom: '5', fontWeight: '400' }}>[Admin]</Paragraph> : <Paragraph style={{ fontSize: 18, marginBottom: '5', fontWeight: '400' }}>[Student]</Paragraph>}
                    </Card.Content>
                    <Card.Actions>
                        <Button onPress={() => deleteClass(course)} style={{
                            backgroundColor: '#3C0A6B',
                        }}>
                            <Ionicons name="trash-outline" color='white' size={20} />
                        </Button>
                    </Card.Actions>
                </Card>
            </ScrollView >
        </View >
    );
};

export default CardDetails;

