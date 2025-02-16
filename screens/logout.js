import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Logout = ({ navigation }) => {
  useEffect(() => {
    const performLogout = async () => {
      try {
        // await axios.post(`http://${GLOBAL_CONFIG.SYSTEM_IP}:5000/api/Users/logout`);
        await AsyncStorage.clear(); // Clears all stored data
        navigation.replace("Login"); // Redirect to login screen
      } catch (error) {
        console.error("Error clearing AsyncStorage:", error);
      }
    };

    performLogout();
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#3C0A6B" />
    </View>
  );
};

export default Logout;
