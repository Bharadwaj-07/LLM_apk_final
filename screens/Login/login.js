import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import API from '../../Middleware/API';
import { GLOBAL_CONFIG } from '../../components/global_config';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from "axios";
export default function LoginPage({ navigation }) {
  const [UserName, setUname] = useState('');
  const [password, setPassword] = useState('');
  const [authenticate, setAuthenticate] = useState(false);
  const [failure, setFailure] = useState(false);
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const ForgotPassword = () => {
    Alert.alert("Please contact the concerned TA");
  };
 
  HandleLogin = async (UserName, password) => {
    if (password != "" && UserName != "") {
      try {
        setLoading(true);
        console.log(UserName);
        console.log(GLOBAL_CONFIG);
        const response = await API.post(`https://${GLOBAL_CONFIG.SYSTEM_IP}/api/Users/login`, { uname: UserName, passwd: password });
        console.log("response received", response.data);
        AsyncStorage.setItem('access_token', response.data.accessToken);
        AsyncStorage.setItem('refresh_token', response.data.refreshToken);

        setAuthenticate(response.data.verified);
        if (response.data.verified) {
          setUname("");
          setPassword("");
          setFailure(false);
          setUname(UserName.toLowerCase());
          AsyncStorage.setItem('uname', UserName);
          navigation.navigate("Home", UserName);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home', params: { UserName: UserName } }],
          });
        }
        if (!response.data.verified) {
          console.log(failure);
          setFailure(true);
        }
      } catch (error) {
        setStatus('Error saving data');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
  }
  return (
    <ImageBackground source={require("../../assets/IIT_Admin_Block.png")}
      style={styles.container}>
      <View style={styles.rectangle}>
        <Image source={require("../../assets/hat_icon.png")}
          style={styles.medium_icon}
        />
        <TextInput
          style={styles.input}
          placeholder="User Name"
          value={UserName}
          onChangeText={setUname}
        />
        <View style={{ width: "100%", alignItems: "center" }}>
          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            secureTextEntry={!visible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={{ alignItems: "center", position: "relative", alignItems: "left", marginBottom: 10 }} onPress={() => { setVisible(!visible) }}><Text>{visible ? 'Hide' : 'Show'}</Text></TouchableOpacity>
        </View>
        {(failure) && <Text style={styles.title}>Wrong Username or Password!!</Text>}
        <TouchableOpacity style={styles.small_button} onPress={ForgotPassword}><Text style={styles.small_text}>Forgot Password?</Text></TouchableOpacity>
        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={() => HandleLogin(UserName, password)} >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.small_button} onPress={() => navigation.navigate("Signup")}><Text style={styles.small_text}>New User? Sign Up</Text></TouchableOpacity>
      </View>
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
    backgroundColor: '#f3f2',
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
    width: '80%',
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
});
