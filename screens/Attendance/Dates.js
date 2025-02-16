import React, { useState, useCallback, useRef, } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, FlatList } from "react-native";
import { GLOBAL_CONFIG } from '../../components/global_config';
import { Alert, Modal, Pressable } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import API from "../../Middleware/API";
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Dates({ navigation, route }) {
  const course = route.params.course;
  console.log(route.params);
  const [dates, setDates] = useState([]);
  const getDates = async () => {
    try {
      const response = await axios.post(`http://${GLOBAL_CONFIG.SYSTEM_IP}:5000/api/Attendance/dates`, {
        course: course
      });
      console.log("Dates:", response.data); // Log actual courses data
      setDates(response.data);
    }
    catch (e) {
      console.log(e);
    }
  }
  useFocusEffect(
    useCallback(() => {
      getDates();
    }, [])
  );
  return (
    <View style={styles.container}>
      {/* FlatList inside a View with flex: 1 to avoid overlap */}
      <View style={styles.listContainer}>
        <FlatList
          data={dates}
          keyExtractor={(item) => item.date}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Present', { course: course, date: item.date })}
            >
              <Text style={styles.buttonText}>{item.date}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Take Attendance Button Stays at the Bottom Without Overlapping */}
      <View style={styles.takeAttendance}>
        <TouchableOpacity
          style={styles.buttonAttendance}
          onPress={() => navigation.navigate('Mark', { course: course })}
        >
          <Text style={styles.buttonTextAttendance}>Take Attendance</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 80,
  },
  buttonText: {
    color: '#3C0A6B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    flex: 1,
    backgroundColor: '#D4BEE4',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    marginHorizontal: 10,
    padding: 10,
  },
  takeAttendance: {
    alignSelf: 'stretch',
    padding: 10,
    backgroundColor: 'white',
  },
  buttonAttendance: {
    backgroundColor: '#3C0A6B',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    width: '95%',
    alignSelf: 'center',
  },
  buttonTextAttendance: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
