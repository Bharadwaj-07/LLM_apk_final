import * as React from 'react';
import { View, ScrollView, Text, StyleSheet, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';
import {
    Card,
    Button,
    Title,
    Paragraph,
} from 'react-native-paper';

const CourseDetailsToJoin = ({ course, instructor, courseId }) => {

    const handlePress = () => {
        Clipboard.setStringAsync(courseId);
        Alert.alert("Copied!", "Course ID copied to clipboard.");
    };

    const handleLongPress = () => {
        console.log('Card long-pressed');
    };

    // Extract the subject code before "i-phun"
    const subjectCode = courseId.split('-')[0] || 'Unknown';

    return (
        <View>
            <ScrollView>
                <Card
                    mode="elevated"
                    // onPress={handlePress}
                    onLongPress={handleLongPress}
                    style={styles.card}>
                    <Card.Content>
                        <Title style={styles.title}>{course}</Title>
                        <Paragraph style={styles.instructor}>{instructor}</Paragraph>
                        <Paragraph style={styles.text}>
                            CourseId To Join: <Text style={styles.boldText}>{courseId}</Text>
                        </Paragraph>
                        {/* <Paragraph style={styles.text}>
                            Class Name: <Text style={styles.boldText}>{subjectCode}</Text>
                        </Paragraph> */}
                    </Card.Content>
                    <Card.Actions>
                        <Button onPress={handlePress} style={styles.button}>
                            <Ionicons name="copy-outline" color='white' size={20} />
                        </Button>
                    </Card.Actions>
                </Card>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        margin: 10,
        borderWidth: 1,
        borderColor: '#3C0A6B',
        borderRadius: 10,
        shadowColor: '#3C0A6B',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 10,
    },
    title: { fontSize: 30, fontWeight: 'bold', marginBottom: 10 },
    instructor: { fontSize: 21, marginBottom: 10, fontWeight: '500' },
    text: { fontSize: 18, marginBottom: 5, fontWeight: '400' },
    boldText: { fontSize: 15, fontWeight: 'bold' },
    button: { backgroundColor: '#3C0A6B' },
});

export default CourseDetailsToJoin;
