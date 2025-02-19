// App.js
import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './screen';

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <AppNavigator />
    </>
  );
}