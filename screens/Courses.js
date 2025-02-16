import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, TextInput, TouchableOpacity, } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
export default function CourseDetails(courseCode,courseName,Instructor,Credits,Description,Department) {
    return (
        <SafeAreaProvider>
            <ScrollView
            style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.rectangle}>
                <Text style={styles.text}>Course Code: {courseCode}</Text>
                <Text style={styles.text}>Course Name: {courseName}</Text>
                <Text style={styles.text}>Instructor: {Instructor}</Text>
                <Text style={styles.text}>Credits: {Credits}</Text>
                <Text style={styles.text}>Description: {Description}</Text>
                <Text style={styles.text}>Department: {Department}</Text>
            </View>
            </ScrollView>
        </SafeAreaProvider>
    );

}
styles=StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    rectangle: {
        backgroundColor: '#ff9',
        padding: 10,
        margin: 10,
        borderRadius: 10,
        opacity: 0.8,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        padding: 5,
    },
});