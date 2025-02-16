import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import QuizList from './screens/QuizList'; 
import QuizCreator from './screens/newQuiz';
import Quiz from './screens/Quiz';

// Create a stack navigator
const Stack = createStackNavigator();

// Main App component
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='QuizList'>
        <Stack.Screen name='QuizList' component={QuizList}/>
        <Stack.Screen name='CreateQuiz' component={QuizCreator}/>
        <Stack.Screen name='Quiz' component={Quiz}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
  // return (<ClassInput></ClassInput>);
}

export default App;
