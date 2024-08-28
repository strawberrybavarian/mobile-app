import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import RNPickerSelect from 'react-native-picker-select';
import Entypo from "@expo/vector-icons/Entypo";
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { getData } from '../../storageUtility';
import { ip } from '../../../ContentExport';
import { StyleSheet } from 'react-native';

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
  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getData('userId');
        if (id) {
          console.log("userId: " + id);
          setUserId(id);
        } else {
          console.log('User not found');
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchData = () => {
        axios.get(`${ip.address}/patient/api/onepatient/${userId}`)
          .then(res => {
            console.log(res.data.thePatient);
            const patient = res.data.thePatient;
            setFirstName(patient.patient_firstName);
            setLastName(patient.patient_lastName);
            setSelectedDate(new Date(patient.patient_dob));
            setEmail(patient.patient_email);
            setPhoneNumber(patient.patient_contactNumber);
          })
          .catch(err => {
            console.log(err);
          });
      };

      fetchData();
    }
  }, [userId]);

  const handleSaveProfile = () => {
    axios.put(`${ip}/patient/api/${userId}/updatedetails`, {
      patient_firstName: firstName || '',
      patient_lastName: lastName || '',
      patient_dob: selectedDate || '',
      patient_email: email || '',
      patient_contactNumber: phoneNumber || '',
      patient_gender: gender || '',
    })
      .then((res) => {
        console.log('Profile updated successfully:', res.data);
        navigation.goBack();
      })
      .catch((err) => {
        console.log('Error updating profile:', err);
      });
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
            <Text style={styles.title}>Edit Profile</Text>
          </View>
        </View>
  
        <Image
          style={styles.profilePicture}
          source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD29ZbwcUoURx5JZQ0kEwp6y4_NmjEJhh2Z6OdKRkbUw&s' }}
        />
  
        {/* Display current data */}
        <View style={styles.currentDataContainer}>
          <Text style={styles.currentDataTitle}>Current Data</Text>
          <Text style={styles.currentDataText}>First Name: {firstName}</Text>
          <Text style={styles.currentDataText}>Last Name: {lastName}</Text>
          <Text style={styles.currentDataText}>
            Date of Birth: {selectedDate ? selectedDate.toDateString() : 'Not set'}
          </Text>
          <Text style={styles.currentDataText}>Email: {email}</Text>
          <Text style={styles.currentDataText}>Phone Number: {phoneNumber}</Text>
          <Text style={styles.currentDataText}>Gender: {gender}</Text>
        </View>
  
        <OvalLabelTextInput label="First Name" value={firstName} onChangeText={setFirstName} />
        <OvalLabelTextInput label="Last Name" value={lastName} onChangeText={setLastName} />
  
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
            value={gender}
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
            <Text style={styles.buttonText}>Save Changes</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

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
