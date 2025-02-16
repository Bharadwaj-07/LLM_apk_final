import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, Platform, TouchableOpacity,Image } from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

export default function DTimePicker({ date, setDate, set,state,ValidateAge,seterror }) {
  const [isPickerShow, setIsPickerShow] = useState(false);
  // const [date, setDate] = useState(new Date(Date.now()));

  const showPicker = () => {
    setIsPickerShow(true);
  };

  const onChange = (event, value) => {
    // seterror(ValidateAge(value));
    setDate(value);
    state(true);
    // console.log(value);
    if (Platform.OS === 'android') {
      setIsPickerShow(false);
    }
  };

  return (
    <View>
      {/* Display the selected date */}
      {/* <View style={styles.input}>
        <Text style={[styles.pickedDate,{paddingVertical:10}]}>
          {date.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })}
        </Text>

      </View> */}

      {/* The button that used to trigger the date picker */}
      {!isPickerShow && (
        <View style={
          {alignSelf: 'center', width: '100%', alignItems: 'center', justifyContent: 'center', padding: 10, backgroundColor: 'white', opacity:1, borderRadius: 5,}
        }>
          <TouchableOpacity onPress={showPicker} ><Image source={require("../assets/calendar.png")} style={styles.medium_icon} /></TouchableOpacity>
        </View>
      )}

      {/* The date picker */}
      {isPickerShow && (
        <DateTimePicker
          value={date}
          mode={'date'}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          is24Hour={true}
          onChange={onChange}
          style={styles.datePicker}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 30,
  },medium_icon: {
    opacity: 1,
    width: 25,
    height: 25,
    resizeMode: "contain",
    border: 5,
    padding: 10,
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
  pickedDateContainer: {
    padding: 20,
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  pickedDate: {
    fontSize: 18,
    color: 'black',
  },
  btnContainer: {
    padding: 30,
  },
  // This only works on iOS
  datePicker: {
    width: 320,
    height: 260,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

});
