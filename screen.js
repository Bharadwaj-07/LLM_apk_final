import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Import screens
// import DashboardScreen from './screens/DashboardScreen';
import CreateClassScreen from './screens/CreateClassScreen';
import JoinClassScreen from './screens/JoinClassScreen';
// import LoginScreen from './screens/LoginScreen';

const Stack = createStackNavigator();

export default function screen() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="CreateClass"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#f5f5f5' }
        }}
      >
        {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
        {/* <Stack.Screen name="Dashboard" component={DashboardScreen} /> */}
        <Stack.Screen name="CreateClass" component={CreateClassScreen} />
        <Stack.Screen name="JoinClass" component={JoinClassScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}