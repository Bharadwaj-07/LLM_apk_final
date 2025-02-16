import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { GLOBAL_CONFIG } from '../../components/global_config';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Dates({ navigation, route }) {
  const { course } = route.params;
  const [dates, setDates] = useState([]);
  const [attendedDates, setAttendedDates] = useState([]);

  const getDates = async () => {
    try {
      let user = await AsyncStorage.getItem('uname');
      user = user.toLowerCase();
      const response = await axios.post(`http://${GLOBAL_CONFIG.SYSTEM_IP}:${GLOBAL_CONFIG.PORT}/api/Attendance/dates`, {
        course: course
      });
      const attendanceData = response.data;
      const attended = await axios.post(`http://${GLOBAL_CONFIG.SYSTEM_IP}:${GLOBAL_CONFIG.PORT}/api/Attendance/UserAttendance`,
        { course: course, user: user }
      );
      const dateArray = attendanceData.map(entry => entry.date);
      setDates(dateArray);

      setAttendedDates(attended);
      console.log("Dates:", dates);
      console.log("Attended dates", attended)
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getDates();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          data={dates}
          keyExtractor={(item) => item}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.button,
                attendedDates.data.includes(item) ? styles.attendedTab : styles.missedTab
              ]}
            >
              <Text style={styles.buttonText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
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
    color: 'white',
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
  attendedTab: {
    backgroundColor: '#3CB371',
  },
  missedTab: {
    backgroundColor: '#E97451',
  },
});
