import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { GLOBAL_CONFIG } from '../components/global_config';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import data from '../env'

const CreateClass = () => {
  const [className, setClassName] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [instructorName, setInstructorName] = useState('');

  // code to extract userID

  const handleSubmit = async () => {
    if (!className || !subjectName || !instructorName) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }
    const user = await AsyncStorage.getItem('uname');
    const userId = user.toLowerCase();
    console.log("Uname", userId);
    const payload = {
      className,
      subjectName,
      instructorName,
      userId
    };

    try {
      console.log("Entering to create class", userId);
      const response = await axios.post(`http://${GLOBAL_CONFIG.SYSTEM_IP}:${GLOBAL_CONFIG.PORT}/createClass`, payload);
      if (response.status === 201) {
        Alert.alert('Success', 'Classroom created successfully!');
        setClassName('');
        setSubjectName('');
        setInstructorName('');
      } else {
        Alert.alert('Error', 'Failed to create classroom. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong!');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Classroom</Text>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Course Code</Text>
        <View style={styles.inputContainer}>
          <FontAwesome name="building" size={20} color="#3C0A6B" />
          <TextInput
            style={styles.input}
            placeholder="Enter Course Code"
            value={className}
            onChangeText={setClassName}
          />
        </View>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Subject Name</Text>
        <View style={styles.inputContainer}>
          <MaterialIcons name="menu-book" size={20} color="#3C0A6B" />
          <TextInput
            style={styles.input}
            placeholder="Enter subject name"
            value={subjectName}
            onChangeText={setSubjectName}
          />
        </View>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Instructor Name</Text>
        <View style={styles.inputContainer}>
          <FontAwesome name="user" size={20} color="#3C0A6B" />
          <TextInput
            style={styles.input}
            placeholder="Enter instructor name"
            value={instructorName}
            onChangeText={setInstructorName}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Create</Text>
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

export default CreateClass;
