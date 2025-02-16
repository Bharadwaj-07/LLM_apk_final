import React, { useState, useEffect, useRef, } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView,TextInput } from "react-native";
import { GLOBAL_CONFIG } from '../components/global_config';
import { Alert, Modal, Pressable } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import axios from "axios";
import UserClass from "../components/classTab";
import SubjectToAvailability from "./SubjectToAvailability";
export default function ClassInput() {
    const [modalVisible, setModalVisibility] = useState(true);
    const [join, setJoin] = useState(false);
    const [classCode, setClassCode] = useState("");
    const [ValidCode, setValidCode] = useState(true);
    return (<Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisibility(!modalVisible);
        }}>
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <ScrollView  contentContainerStyle={{ flexGrow: 0.8
                
             }}>
                <Text style={styles.title}>Enter Class Code</Text>
                <SubjectToAvailability
                    fieldName="ClassCode"
                    placeholder="Enter Class Code"
                    Name={classCode}
                    setName={setClassCode}
                    Color={ValidCode}       
                ></SubjectToAvailability>
                <TouchableOpacity style={styles.button} onPress={console.log("Joining Class")}>
                    <Text style={styles.buttonText}>Join Class</Text>
                </TouchableOpacity>
            </ScrollView></View>
            {(!join) && <TouchableOpacity style={styles.addIcon} onPress={setModalVisibility}><Image source={require("../assets/back_arrow.jpg")} style={styles.addIcon}></Image></TouchableOpacity>
            }

        </View>
    </Modal>);
}

const styles = StyleSheet.create({
    buttonText: {
        color: 'rgba(255,255,255,1)',
        fontSize: 16,
        fontWeight: 'bold',
    },  input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
        width: '85%',
        backgroundColor: 'white',
        opacity: 0.6,
      },
    container: {
        flex: 1,
        // Ensure parent is relatively positioned
        backgroundColor: 'gray',
    },
    button: {
        backgroundColor: '#005d5f',
        paddingVertical: 5,
        borderRadius: 5,
        alignSelf: 'center',
        alignItems: 'center',
        width: '60%',
        marginBottom: 10,

    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        alignSelf: 'center',
    },
    containerModal: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        // Ensure parent is relatively positioned
        backgroundColor: 'gray',
    }, centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rectangle: {
        flex: 1,
        width: '80%', // Adjust as needed   
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
    },
    addIcon: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 50,
        height: 70,
        resizeMode: 'contain',// Android-specific shadow
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        width: "90%",
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    rectangle: {
        width: '80%', // Adjust as needed
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: "rgba(255,255,255,0.7)",
        borderRadius: 10,
    },
    medium_icon: {
        fontSize: 40,
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
});

