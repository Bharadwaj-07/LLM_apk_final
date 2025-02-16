import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, TextInput, TouchableOpacity, } from 'react-native';
import SubjectToAvailability from '../../components/SubjectToAvailability';
import { ValidateAge, ValidateEmail, ValidateName, ValidatePhoneNumber, ValidateUserName } from "../../components/Validations";
// import { set } from 'monisValidose';
import { GLOBAL_CONFIG } from '../../components/global_config';
import DTimePicker from '../../components/DatePicker';

export default function Details({ route, navigation }) {
  const Rules = "1. Name should contain alphabets, only white spaces and . allowed\n2. Email should be in the proper format with domain name and @ symbol\n3.Phone Number should be a 10 digit number\n4. Age should be a number\n5. College should contain alphabets, white spaces and . symbols\n6. Date of Birth (AtLeast 17 years old) should match with Age(Alright)";
  const [set, setDateSet] = useState(false);
  const { Uname } = route.params;
  const [email, setEmail] = useState('');
  const [ValidEmail, setVEmail] = useState(true);
  const [Name, setName] = useState("");
  const [ValidName, setVName] = useState(true);
  // const [Age, setAge] = useState("");
  const [error, seterror] = useState(false);
  const [ValidAge, setVAge] = useState(true);
  const [College, setCollege] = useState("");
  const [ValidCollege, setVCollege] = useState(true);
  const [Number, setNumber] = useState("");
  const [ValidNumber, setVNumber] = useState(true);
  const [ValidUser, setVUser] = useState(false);
  const [Inputs, setInputs] = useState(false);
  const valid = () => { setVUser(true); }
  const [DOB, setDate] = useState(new Date());
  const handleDetails = () => {
    const validateAge = (selectedDate, Age) => {
      const today = new Date();
      selectedDate = new Date(selectedDate);

      const age = today.getFullYear() - selectedDate.getFullYear();
      const birthMonth = selectedDate.getMonth();
      const birthDay = selectedDate.getDate();

      const isBirthdayPassedThisYear =
        today.getMonth() > birthMonth ||
        (today.getMonth() === birthMonth && today.getDate() >= birthDay);

      const correctedAge = isBirthdayPassedThisYear ? age : age - 1;
      console.log(Age);
      console.log(correctedAge >= 17 && Age == correctedAge);
      return (correctedAge >= 17 && Age == correctedAge); // Return true if the corrected age is 17 or above
    };

    const findAge = (selectedDate) => {
      const today = new Date();
      selectedDate = new Date(selectedDate);

      const age = today.getFullYear() - selectedDate.getFullYear();
      const birthMonth = selectedDate.getMonth();
      const birthDay = selectedDate.getDate();

      const isBirthdayPassedThisYear =
        today.getMonth() > birthMonth ||
        (today.getMonth() === birthMonth && today.getDate() >= birthDay);

      const correctedAge = isBirthdayPassedThisYear ? age : age - 1;
      return correctedAge
    };
    let Age = (findAge(DOB));

    console.log("Clicked");
    let isValid = true;
    const UserDetails = {
      Uname,
      email,
      Age,
      College,
      Number,
      Name,
      DOB,
    }

    setVUser(true);
    () => { valid };
    if (!ValidateEmail(email)) {

      setVEmail(false);
      {/**state update cycle is the issue for delayed click */ }
      isValid = false;
    }
    else {
      setVEmail(true);

    }
    if (!ValidateAge(Age)) {
      setVAge(false);
      isValid = false;
    }
    else {
      setVAge(true);
    }
    if (!ValidateName(College)) {
      setVCollege(false);
      isValid = false;
    }
    else {
      setVCollege(true);
    }
    if (!ValidatePhoneNumber(Number)) {
      setVNumber(false);
      isValid = false;
    }
    else {
      setVNumber(true);
    }
    if (!ValidateName(Name)) {
      setVName(false);
      isValid = false;
    }
    else {
      setVName(true);
    }
    if (!validateAge(DOB, Age)) {
      seterror(true);
      isValid = false;
    }
    else { seterror(false); }
    console.log(UserDetails);
    console.log(ValidUser);
    setVUser(isValid);
    if (isValid) {
      navigation.navigate("Password", UserDetails);
    }
    else {
      setInputs(true);
    }
  }

  return (

    <ImageBackground source={require("../../assets/IIT_Admin_Block.png")}
      style={styles.container}>

      <View style={styles.rectangle}>
        <Image source={require("../../assets/hat_icon.png")}
          style={styles.medium_icon}
        />
        {(!ValidUser && Inputs) && <Text style={[styles.text, { color: "red" }]}>Invalid Inputs</Text>}
        {/**Name Input */}
        <TextInput style={[styles.input, { borderColor: ValidName ? 'white' : 'red' }]}
          placeholder='Name'
          value={Name}
          onChangeText={setName}>
        </TextInput>

        {/* email Input */}
        <SubjectToAvailability
          Name={email}
          setName={setEmail}
          fieldName="email"
          placeholder="Email"
          Color={ValidEmail}>
        </SubjectToAvailability>

        <SubjectToAvailability style={styles.input}
          Name={Number}
          setName={setNumber}
          fieldName="number"
          placeholder="Phone Number"
          Color={ValidNumber}></SubjectToAvailability>


        <TextInput style={[styles.input, { borderColor: ValidCollege ? 'white' : 'red' }]}
          placeholder='College'
          value={College}
          onChangeText={setCollege}></TextInput>
        <View style={[styles.input, { borderColor: !error ? 'white' : 'red' }]}>
          <View style={[{ flexDirection: 'row', paddingHorizontal: 5, alignItems: "center", justifyContent: "space-between", }]}>
            <Text style={[{ paddingVertical: 0, borderRadius: 5, alignItems: 'center', width: '70%', }]}>
              {(!set) ? "Date of Birth" : DOB.toLocaleDateString('en-IN', { year: 'numeric', month: 'numeric', day: 'numeric' })}
            </Text>
            <DTimePicker
              date={DOB}
              setDate={setDate}
              set={set}
              state={setDateSet}
              validateAge={ValidateAge}
              seterror={seterror}></DTimePicker></View>
        </View>
        <TouchableOpacity style={styles.small_button} onPress={() => { alert(Rules) }}>
          <Image source={require("../../assets/help-icon.png")} style={styles.medium_icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}
          onPress={handleDetails}><Text style={styles.buttonText}>Next</Text></TouchableOpacity>
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
    width: 40,
    height: 40,
    resizeMode: "contain",
    border: 5,
    padding: 10,
  },
  rectangle: {
    width: '90%', // Adjust as needed
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.7)",
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
    marginBottom: 5,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    opacity: 0.6,
    width: "89%",
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
