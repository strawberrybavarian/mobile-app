import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import RNPickerSelect from 'react-native-picker-select';
import Entypo from "@expo/vector-icons/Entypo";
import { LinearGradient } from 'expo-linear-gradient';

const OvalLabelTextInput = ({ label, value, onChangeText, onTouch }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={(text) => onChangeText(text)}
      onTouchStart={onTouch}
    />
  </View>
);

const ProfileForm = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false); // Add this line

  const handleSaveProfile = () => {
    console.log('Full Name:', fullName);
    console.log('Date of Birth:', selectedDate);
    console.log('Email:', email);
    console.log('Phone Number:', phoneNumber);
    console.log('Gender:', gender);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={() => navigation.goBack()}
          >
            <Entypo name="chevron-thin-left" size={14} />
          </TouchableOpacity>
          <View style={{ justifyContent: 'center', width: "83%" }}>
            <Text style={styles.title}>Fill Profile</Text>
          </View>
        </View>

        {/* Profile Picture */}
        <Image
          style={styles.profilePicture}
          source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD29ZbwcUoURx5JZQ0kEwp6y4_NmjEJhh2Z6OdKRkbUw&s' }}  // Replace with your profile picture link
        />

        <OvalLabelTextInput label="Full Name" value={fullName} onChangeText={setFullName} />

        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <OvalLabelTextInput
            label="Date of Birth"
            value={selectedDate ? selectedDate.toDateString() : ''}
            onTouch={() => setShowDatePicker(true)}
          />
        </TouchableOpacity>

        {showDatePicker && (
          <View style={styles.calendarContainer}>
            <Text style={styles.subtitle}>Select a Date</Text>
            <CalendarPicker
              onDateChange={handleDateChange}
              selectedDayColor="#92a3fd"
              selectedDayTextColor="white"
              todayBackgroundColor="transparent"
              todayTextStyle={{ color: '#000' }}
              textStyle={{ color: '#000' }}
              customDatesStyles={[
                {
                  date: selectedDate,
                  style: { backgroundColor: '#92a3fd' },
                  textStyle: { color: 'white' },
                },
              ]}
              dayShape="square"
              width={300}
              height={300}
              hideDayNames={true}
            />
          </View>
        )}

        <OvalLabelTextInput label="Email" value={email} onChangeText={setEmail} />

        <OvalLabelTextInput label="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} />

        <View style={styles.pickerContainer}>
          <RNPickerSelect
            placeholder={{ label: 'Select Gender', value: null }}
            onValueChange={(value) => setGender(value)}
            items={[
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
              { label: 'Other', value: 'other' },
            ]}
            style={{
              inputIOS: styles.picker,
              inputAndroid: styles.picker,
            }}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
          <LinearGradient
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 2 }}
            colors={["#92A3FD", "#9DCEFF"]}
            style={{
              width: "100%",
              height: 40,
              borderRadius: 40,
              justifyContent: "center",
              alignItems: "center"
            }}>
            <Text style={styles.buttonText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  arrowButton: {
    padding: 10,
  },
  arrowText: {
    fontSize: 20,
    color: '#007BFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
   
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    position: 'absolute',
    top: 8,
    marginBottom: 5,
    left: 14,
    zIndex: 1,
    color: 'gray',
    backgroundColor: 'transparent',
    paddingHorizontal: 4,
  },
  input: {
    height: 65,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 15,
    paddingLeft: 18,
    paddingTop: 15,
  },
  calendarContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  pickerContainer: {
    marginBottom: 12,
    position: 'relative',
  },
  picker: {
    height: 65,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: 'transparent',
    zIndex: 1,
    paddingLeft: 13,
    paddingTop: 15,
    paddingRight: 15,
  },
  pickerLabel: {
    fontSize: 12,
    position: 'absolute',
    top: 8,
    left: 14,
    zIndex: 1,
    color: 'gray',
    backgroundColor: 'transparent',
    paddingHorizontal: 4,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "",
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileForm;
