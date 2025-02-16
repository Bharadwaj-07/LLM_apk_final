import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StyleSheet, View, Text, SafeAreaView, ScrollView } from 'react-native';
import { GLOBAL_CONFIG } from '../../components/global_config';

export default function AttendanceDate({ navigation, route }) {
  const [students, setStudents] = useState([]);

  const course = route.params.course;
  const date = route.params.date;
  const getStudents = async () => {
    try {
      const response = await axios.get(
        `http://${GLOBAL_CONFIG.SYSTEM_IP}:5000/api/Attendance/attendance`,
        { params: { course, date } }
      );
      console.log("Students:", response.data);
      setStudents(response.data);
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    getStudents();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* <Text style={styles.header}>Attendance for {course}</Text> */}
      <Text style={styles.dateText}>Date : {date}</Text>

      {students.length === 0 ? (
        <Text style={styles.noStudentsText}>No attendance records found.</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.listContent}>
          {students.map((student, index) => (
            <View key={index} style={styles.itemContainer}>
              <Text style={styles.studentName}>{`${student.name} (${student.uname})`}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F9F9F9",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#3C0A6B",
  },
  dateText: {
    fontSize: 20,
    textAlign: "center",
    color: "#3C0A6B",
    marginBottom: 20,
    fontWeight: 'bold'
  },
  listContent: {
    paddingBottom: 100,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#D4BEE4",
    borderRadius: 5,
    marginVertical: 5,
    elevation: 2,
  },
  studentName: {
    fontSize: 18,
    fontWeight: "500",
    color: "#3C0A6B",
  },
  noStudentsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
});
