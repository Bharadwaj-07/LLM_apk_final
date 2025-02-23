
import React, { useState } from "react";
import { StyleSheet, Text, View, Image, ImageBackground, TextInput, TouchableOpacity, } from 'react-native';
import axios from 'axios';
import { GLOBAL_CONFIG } from '../../components/global_config';

export default function Password({ route, navigation }) {
    const UserDetails = route.params;
    const [password, setPassword] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [visible, setVisible] = useState(false);
    const [visible1, setVisible1] = useState(false);
    const [match, setMatch] = useState(true);
    const [Loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const Switching = async () => {
        const User = { ...UserDetails, password };
        if (password === "" || passwordInput === "") {
            return;
        }
        try {
            // Send the POST request to the backend API
            const response = await axios.post(`https://${GLOBAL_CONFIG.SYSTEM_IP}/api/Users/store`, { ...UserDetails, password: password });

            // Handle success response
            setStatus('Data saved successfully!');
            console.log(response.data);
        } catch (error) {
            // Handle error
            setStatus('Error saving data');
            console.error('Error here at saving:', error);
        }
        console.log(User)
        navigation.navigate("Login");

    }
    const Finish = () => {
        console.log(password);
        console.log(passwordInput);
        if (password === passwordInput) {
            setMatch(true);
            setLoading(true);
        }
        else {
            setMatch(false);
        }

    }
    const validatePassword = (password) => {
        const minLength = password.length >= 6;
        const uppercase = /[A-Z]/.test(password);
        const lowercase = /[a-z]/.test(password);
        const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const number = /[0-9]/.test(password);
    
        return minLength && uppercase && lowercase && specialChar && number;
    };
    
    return (
        <ImageBackground style={styles.container} source={require('../../assets/iit_tp.jpg')}>
            {!Loading && (
                <View style={styles.rectangle}>
                    <View style={{ flexDirection: 'row', padding: 10, alignItems: "center", justifyContent: "space-between" }}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Password"
                            secureTextEntry={!visible}
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                setMatch(text === passwordInput);
                            }}
                        />
                        <TouchableOpacity style={{ alignItems: "center" }} onPress={() => setVisible(!visible)}>
                            <Text>{visible ? 'Hide' : 'Show'}</Text>
                        </TouchableOpacity>
                    </View>
    
                    <View style={{ flexDirection: 'row', padding: 10, alignItems: "center", justifyContent: "space-between" }}>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            secureTextEntry={!visible1}
                            value={passwordInput}
                            onChangeText={(text) => {
                                setPasswordInput(text);
                                setMatch(text === password);
                            }}
                        />
                        <TouchableOpacity style={{ alignItems: "center" }} onPress={() => setVisible1(!visible1)}>
                            <Text>{visible1 ? 'Hide' : 'Show'}</Text>
                        </TouchableOpacity>
                    </View>
    
                    {/* Show password validation errors */}
                    {!validatePassword(password) && password.length > 0 && (
                        <Text style={styles.passwordRequirements}>
                            Password must be at least 6 characters long and contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.
                        </Text>
        
                    )}
                    
                    {/* Show error if passwords don't match */}
                    {!match && passwordInput.length > 0 && <Text style={{ color: 'red' }}>Passwords do not match</Text>}
    
                    <TouchableOpacity
                        style={styles.button}
                        onPress={Finish}
                        disabled={!match || !validatePassword(password)}
                    >
                        <Text style={styles.buttonText}>Finish</Text>
                    </TouchableOpacity>
                </View>
            )}
    
            {Loading && (
                <View style={styles.rectangle}>
                    <Text style={styles.title}>User Created.</Text>
                    <TouchableOpacity style={styles.button} onPress={Switching}>
                        <Text style={styles.buttonText}>Login Page</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ImageBackground>
    );
}




const styles = StyleSheet.create({
    small_button: {
        fontSize: 12,
        padding: 10,
    },
    small_text: {
        fontSize: 14,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',

    },
    medium_icon: {
        opacity: 1,
        width: 70,
        height: 70,
        resizeMode: "contain",
        border: 5,
        padding: 10,
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        marginInline: 5,
        paddingHorizontal: 10,
        width: '85%',
        backgroundColor: 'white',
        opacity: 0.6,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        width: '60%'

    },
    buttonText: {
        color: 'rgba(255,255,255,1)',
        fontSize: 16,
        fontWeight: 'bold',
    },
    passwordRequirements : {
        color: 'red',
        fontSize: 12,
        marginVertical: 10,
        marginBottom:8
,        textAlign: 'center',
    }
});
