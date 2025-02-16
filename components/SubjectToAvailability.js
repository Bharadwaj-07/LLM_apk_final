
import React, { use, useState } from 'react';
import axios from 'axios'
import { StyleSheet, View, ImageBackground, Text, TouchableOpacity, TextInput, } from 'react-native';
import debounce from 'lodash.debounce';
import { GLOBAL_CONFIG } from './global_config';
export default function SubjectToAvailability({ Name, setName, fieldName,placeholder, Color }) {
    const handlePress = () => {

    }
    const [Status, setStatus] = useState("");
    const [available, setAvailable] = useState(false);
    if(placeholder=="") {placeholder=fieldName;} 
    const availability = async (Name) => {

        try {
            // Sending a POST request to check username availability
            setAvailable(false);

            const response = await axios.post(`http://${GLOBAL_CONFIG.SYSTEM_IP}:${GLOBAL_CONFIG.PORT}/api/Users/check`, { Name, fieldName });

            // Log the full response for debugging (optional)


            // Handle response based on the data received
            if (response.data.available) {
                setAvailable(true);
                 setStatus("");;

            } else {
                setStatus(`${fieldName} already exists`);
                setAvailable(false);
            }
        } catch (error) {
            // Log error details for debugging
            console.error('Error occurred while checking username availability:', error.message);


        }

    }
    const checkName = (text, Color) => {
        {
            Color = true;
            setName(text);
            if (text != "") {
                availability(text);
            }
        }
    }

    return (
        <View style={{
            width: "90%",
            alignItems: "center",
            borderColor: Color ? 'white' : 'red',
        }}>
            <TextInput style={[styles.input, { borderColor: Color ? 'white' : 'red' },]}
                placeholder={placeholder}
                value={Name}
                onChangeText={checkName}></TextInput>
            {(Status != '') &&
                <Text style={[styles.text, { color: available ? "green" : "red" }]}>{Status}</Text>}
        </View>
    );
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f3f2',

    },
    text: {
        textAlign: "center",
        fontSize: 10,
        backgroundColor: "white",
        opacity: 0.6,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    button: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        width: '50%',
        margin: 5,

    }, input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 5,
        paddingHorizontal: 10,
        width: '99%',
        backgroundColor: 'white',
        opacity: 0.6,
    },
    buttonText: {
        color: 'rgba(255,255,255,1)',
        fontSize: 16,
        fontWeight: 'bold',
    },
});