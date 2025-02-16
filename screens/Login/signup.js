
import React, { use, useState } from 'react';
import axios from 'axios'
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, ImageBackground, Text, TouchableOpacity, TextInput, } from 'react-native';
import debounce from 'lodash.debounce';
import { GLOBAL_CONFIG } from '../../components/global_config';

{/**arguments must be passed in parenthesis else it will not recognize */ }
export default function Signup({ route, navigation }) {
    const [Uname, setUname] = useState("");
    var [Status, setStatus] = useState("");
    const [available, setAvailable] = useState(false);

    const handlePress = () => {
        if (available) {
            navigation.navigate("Details", { Uname });
        }
        else {
            setStatus("Please Pick a User Name");
        }
    }
    const availability = async (Uname) => {
        try {
            // Sending a POST request to check username availability
            console.log(Uname);
            const response = await axios.post(`http://${GLOBAL_CONFIG.SYSTEM_IP}:${GLOBAL_CONFIG.PORT}/api/Users/check`, { Name: Uname, fieldName: "uname" });

            // Log the full response for debugging (optional)
            console.log('Server Response:', response);

            // Handle response based on the data received
            if (response.data.available) {
                setStatus("Username is available");
                setAvailable(true);
            } else {
                setStatus("Username is unavailable");
                setAvailable(false);
            }
        } catch (error) {
            // Log error details for debugging
            console.error('Error occurred while checking username availability:', error.message);


        }

    }
    const delayCheckAvailability = debounce((Uname) => {
        availability(Uname);
    }, 0);
    const checkUname = (text) => {
        {
            setUname(text);


            if (text == "") {
                setStatus('');
                setAvailable(false);
            }
            else {
                availability(text);
            }
        }
    }

    return (<ImageBackground style={styles.container}
        source={require('../../assets/iit_tp.jpg')}>
        <View style={{
            width: "80%",
            alignItems: "center",
        }}>
            <TextInput style={styles.input}
                placeholder='New User Name'
                value={Uname}
                onChangeText={checkUname}></TextInput>

            {(Status != '') &&
                <Text style={[styles.text, { color: available ? "green" : "red" }]}>{Status}</Text>}
        </View>
        <TouchableOpacity style={[styles.button]} onPress={() => handlePress(available)}><Text style={styles.title}>Continue</Text></TouchableOpacity>
    </ImageBackground>
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
        fontSize: 16,
        backgroundColor: "white",
        opacity: 0.6,
        fontWeight: 'bold',
        padding: 10,
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
        marginBottom: 15,
        paddingHorizontal: 10,
        width: '85%',
        backgroundColor: 'white',
        opacity: 0.6,
    },
    buttonText: {
        color: 'rgba(255,255,255,1)',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
