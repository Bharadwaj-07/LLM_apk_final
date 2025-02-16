import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
// import data from '../env.js'
import { FontAwesome } from '@expo/vector-icons';
import { GLOBAL_CONFIG } from '../components/global_config';
import AsyncStorage from '@react-native-async-storage/async-storage';
const JoinClass = () => {
    const [classId, setClassId] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);

    

    const join = async () => {
       const userId = await AsyncStorage.getItem('uname');
        console.log("UserID",userId);
        console.log("Trying to join a class");
        if (!classId || !username) {
            Alert.alert('Error', 'Please enter all fields!');
            return;
        }
        console.log("Trying to join a class");
        setLoading(true);
        let course=classId;
        let user=userId;
        const response = await axios.post(`http://${GLOBAL_CONFIG.SYSTEM_IP}:5000/api/Attendance/Admin`, {
            course,
            user,
        });
        console.log("response admin",response);
        if(!response.data.admin){
        try {
            console.log("not admin and Trying to join a class");
            const response = await axios.post(`http://${GLOBAL_CONFIG.SYSTEM_IP}:5000/joinClass/join`, {
                classId, username, userId
            });
            console.log(response.data);
            if(!response.data.data){
                Alert.alert('Error', 'You are already part of the class!');
                setClassId('');
                setUsername('');
            return;  }
            Alert.alert('Success', 'You have successfully joined the class!');
            setClassId('');
            setUsername('');
        } catch (error) {
            Alert.alert('Error', 'Unable to join the class. Please try again.');
        } finally {
            setLoading(false);
        }}
        else{
            Alert.alert(`You are admin of this course ${classId}`);
            setClassId('');
            setUsername('');
        }
    };

    return (

        <View style={styles.container}>
            <Text style={styles.title}>Join Classroom</Text>

            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Course ID</Text>
                <View style={styles.inputContainer}>
                    <FontAwesome name="building" size={20} color="#3C0A6B" />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Class Code"
                        value={classId}
                        onChangeText={setClassId}
                        keyboardType="default"
                    />
                </View>
            </View>

            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Name</Text>
                <View style={styles.inputContainer}>
                    <FontAwesome name="building" size={20} color="#3C0A6B" />
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        value={username}
                        onChangeText={setUsername}
                        keyboardType="default"
                    />
                </View>
            </View>


           <TouchableOpacity style={styles.button} onPress={join}>
                   <Text style={styles.buttonText}>Join</Text>
                 </TouchableOpacity>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    fieldContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    input: {
        flex: 1,
        padding: 10,
        fontSize: 16,
        color: '#333',
    },
    button: {
        backgroundColor: '#3C0A6B',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default JoinClass;
