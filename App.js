
import React from 'react';
import { StatusBar ,View} from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './screens/Login/login'; // Adjust paths to your screens
import Signup from './screens/Login/signup';
import Details from './screens/Login/Details';
import Password from './screens/Login/Password';
import Home from './screens/Home';
import Dates from './screens/Attendance/Dates';
import Present from './screens/Attendance/Present';
import Mark from './screens/Attendance/Mark';
import UserDates from './screens/Attendance/UserDates';
import MainWindow from './screens/ClassRoom/MainWindow';
import ClassInput from './components/ClassInput';
import AdminMarks from './screens/AdminMarks';
import StudentMarks from './screens/StudentMarks';
import QuizList from './screens/QuizList';
import QuizCreator from './screens/newQuiz';
import Quiz from './screens/Quiz'
import NoticeBoard from './screens/NoticeBoard';
import InstructorStudentList from './screens/InstructorStudentList';
import QuizStats from './screens/QuizStats';
const Stack = createStackNavigator();
const App = () => {
  return (
  <View style={{flex:1}}>
    <StatusBar barStyle="dark-content" backgroundColor="#3C0A6B" />
    <NavigationContainer>     
    <Stack.Navigator initialRouteName='Login'
      screenOptions={{
        headerStyle: { backgroundColor: '#3C0A6B' },
        headerTintColor: 'white',
      }}>
      
     

      <Stack.Screen name='Login' component={LoginPage} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name='Signup' component={Signup} options={{ headerShown: false }} />
      <Stack.Screen name='Details' component={Details} options={{ headerShown: false }}  />
      <Stack.Screen name='Password' component={Password} options={{ headerShown: false }} />
      <Stack.Screen name='Classroom' component={MainWindow} />
      <Stack.Screen name='Dates' component={Dates} options={{ title: "Attendance" }} />
      <Stack.Screen name='Present' component={Present} options={{ title: "Students Present" }} />
      <Stack.Screen name='Mark' component={Mark} options={{ title: "Mark Attendance" }} />
      <Stack.Screen name='UserDates' component={UserDates} options={{ title: "Attendance" }} />
      <Stack.Screen name='AdminMarks' component={AdminMarks} options={{ title: "Admin Marks" }} />
      <Stack.Screen name='StudentMarks' component={StudentMarks} options={{ title: "Student Marks" }} />
      <Stack.Screen name='QuizList' component={QuizList} options={{ title: "All Quizzes" }} />
      <Stack.Screen name='CreateQuiz' component={QuizCreator} options={{ title: "Create Quiz" }} />
      <Stack.Screen name='Quiz' component={Quiz} />
      <Stack.Screen name="NoticeBoard" component={NoticeBoard} options={{ title: "Discussion Board" }} />
      <Stack.Screen name="Participants" component={InstructorStudentList} />
      <Stack.Screen name="QuizStats" component={QuizStats} options={{ title: "Quiz Statistics" }} />
    </Stack.Navigator>
  </NavigationContainer>
  </View>

)
  
}
export default App;



