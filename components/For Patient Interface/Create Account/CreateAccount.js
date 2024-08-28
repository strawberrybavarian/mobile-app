import React, { useEffect, useState } from 'react';
import { View, Text, Platform, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import PickerSelect from 'react-native-picker-select';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import {ip} from '../../../ContentExport'
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CreateAccount = ({ navigation }) => {

  // arrays
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [middleinitial, setMiddleInitial] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [role, setRole] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState(new Date());
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [showSpecialty, setShowSpecialty] = useState(false)

  const [firstnameError, setfirstnameError] = useState('');
  const [lastnameError, setlastnameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [contactNumberError, setContactNumberError] = useState('');
  const [existingEmail, setExistingEmail] = useState([]);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [specialtyError, setSpecialtyError] = useState('');
  const [roleError, setRoleError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [dobError, setDobError] = useState('')
  
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(Platform.OS === 'ios');
    setDob(currentDate);
  };

  useEffect(() => { //for email check
    if (role === 'Patient'){
      axios.get(`${ip.address}/patient/api/allemail`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setExistingEmail(res.data); // Set the response if it's an array
          console.log('Emails set:', res.data); // Log the array being set
        } else {
          console.error('Expected an array but got:', typeof res.data, res.data);
        }
      })
      .catch((err) => {
        console.log('error here');
      });
    }
    else if (role === 'Doctor') {
      axios.get(`${ip.address}/doctor/api/allemail`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setExistingEmail(res.data); // Set the response if it's an array
          console.log('Emails set:', res.data); // Log the array being set
        } else {
          console.error('Expected an array but got:', typeof res.data, res.data);
        }
      })
      .catch((err) => {
        console.log('error here');
      });
    }

  },[email, role])

  useEffect(() => { //for specialty visibility
      if (role === 'Doctor') {
        setShowSpecialty(true)
      }
      else {
        setShowSpecialty(false)
      }
    
  }, [role])

  const checkIfEmailExists = (email) => {
    // Check if the email exists in the existingEmail array
    
    return existingEmail.some(existing => existing === email);
  };

  const registerUser = async (e) => {
    e.preventDefault();

    if (firstname.length == 0 || lastname.length == 0 || email.length == 0 || password.length == 0 || confirmPassword.length == 0) {
        alert('Please fill in all required fields.');
        return;
    }

    if (checkIfEmailExists(email)) {
        setEmailError('Email already exists.');
        alert('Email already exists.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    if (
        firstnameError === '' &&
        lastnameError === '' &&
        emailError === '' &&
        passwordError === '' &&
        confirmPasswordError === ''
    ) {
        try {
            if (role === "Doctor") {
                const doctorUser = {
                    dr_firstName: firstname,
                    dr_lastName: lastname,
                    dr_middleInitial: middleinitial,
                    dr_email: email,
                    dr_password: password,
                    dr_specialty: specialty,
                    // dr_dob: uBirth,
                    dr_contactNumber: contactNumber,
                    dr_gender: gender, 
                };
                const response = await axios.post(`${ip.address}/doctor/api/signup`, doctorUser);
                if (response.status === 200) {
                    console.log(response.data);
                    window.alert("Successfully registered Doctor");
                    navigation.navigate('SigninPage');
                } else {
                    console.error(response.data);
                    window.alert('Registration failed. Please try again.');
                }
            } else if (role === "Patient") {
                const patientUser = {
                    patient_firstName: firstname,
                    patient_middleInitial: middleinitial,
                    patient_lastName: lastname,
                    patient_email: email,
                    patient_password: password,
                    // patient_dob: uBirth,
                    patient_contactNumber: contactNumber,
                    patient_gender: gender,
                };
                console.log(patientUser);
                const response = await axios.post(`${ip.address}/patient/api/signup`, patientUser);
                if (response.status === 200) {
                    console.log(response.data);
                    window.alert("Successfully registered Patient");
                    navigation.navigate('SigninPage');
                } else {
                    console.error(response.data);
                    window.alert('Registration failed. Please try again.');
                }
            }
        } catch (err) {
            console.error(err);
            window.alert('An error occurred during registration. Please try again.');
        }
    } else {
        window.alert('There are some errors in the form.');
    }
};


  const validateFirstName = (text) => {
    if (!text) {
      setfirstnameError("First name cannot be empty");
    } else {
      setfirstnameError("");
    }
    setFirstName(text);
  };
  
  const validateLastName = (text) => {
    if (!text) {
      setlastnameError("Last name cannot be empty.");
    } else {
      setlastnameError("");
    }
    setLastName(text);
  };

  const validateEmail = (text) => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(text)) {
      setEmailError("Email format invalid. Example of valid format: xyz@abc.com");
    }
    else {
      setEmailError("");
    }
    setEmail(text);
  };

  const validateContactNumber = (text) => {
    if (!text || text.length == 0) {
      setContactNumberError("Contact number cannot be empty.");
    }
    else if (text.length < 11) {
      setContactNumberError("Contact number must be at least 11 characters.");
    }
    else {
      setContactNumberError("");
    }
    setContactNumber(text);
  }

  const validatePassword = (text) => {
    if (!text || text.length < 8) {
      setPasswordError("Password must be at least 8 characters");
    } else {
      setPasswordError("");
    }
    setPassword(text);
  };

  const validateConfirmPassword = (text) => {
    if (password !== text) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
    setConfirmPassword(text);
  };

  const validateRole = (value) => {
    if (!value || value == "") {
      setRoleError("Please select a role");
    } else {
      setRoleError("");
    }
    setRole(value);
    console.log(value)
  }

  const validateSpecialty = (value) => {
    if (role === 'Doctor') {
      if (!value || value == "") {
        setSpecialtyError("Please select a specialty");
      }
      else {
        setSpecialtyError("");
      }
      setSpecialty(value);
    }
  }

  const validateGender = (value) => {
    if (!value || value == "") {
      setGenderError("Please select a gender.")
    }
    else {
      setGenderError("");
    }
    setGender(value);
    console.log(value)
  }

  const validateDob = (selectedDate) => {
    if (!selectedDate) {
      setDobError("Date of Birth cannot be empty.");
      return false;
    }

    const today = new Date();
    const minimumValidDate = new Date(
      today.getFullYear() - 16, 
      today.getMonth(),
      today.getDate()
    );

    if (selectedDate > minimumValidDate) {
      setDobError("You must be at least 16 years old.");
      console.log("You must be at least 16 years old.");
      return false;
    }

    setDobError('');
    setDob(selectedDate);
    return true;
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid
      extraHeight={Platform.OS === 'android' ? -20 : 0} // Adjust based on your UI
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <FontAwesome5 name="chevron-left" size={15} />
        </TouchableOpacity>
        <View style={styles.con1}>
          <Text style={styles.title}>Sign In</Text>
        </View>
      </View>

      <View style={styles.textcon}>
        <Text style={styles.text1}>Create Your</Text>
        <Text style={styles.text1}>Account</Text>
      </View>

      <View style={styles.container1}>

        {/* First Name Input */}
        <TextInput
          style={styles.textInput}
          placeholder="First Name"
          value={firstname}
          onChangeText={validateFirstName}
        />
          {firstnameError ? (
                <Text style={styles.errorMessage}>{firstnameError}</Text>
          ) : null}

        {/* Middle Name Input */}
        <TextInput
          style={styles.textInput}
          placeholder="Middle Initial"
          value={middleinitial}
          onChangeText={setMiddleInitial}
        />

          {/* Last Name Input */}
        <TextInput
          style={styles.textInput}
          placeholder="Last Name"
          value={lastname}
          onChangeText={validateLastName}
        />
          {lastnameError ? (
                <Text style={styles.errorMessage}>{lastnameError}</Text>
          ) : null}

        {/* Email Input */}
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          value={email}
          onChangeText={validateEmail}
        />
          {emailError ? (
                <Text style={styles.errorMessage}>{emailError}</Text>
          ) : null}
        
        {/* Contact Number Input */}
        <TextInput
          style={styles.textInput}
          placeholder="Contact Number"
          value={contactNumber}
          onChangeText={validateContactNumber}
        />
          {contactNumberError ? (
                <Text style={styles.errorMessage}>{contactNumberError}</Text>
          ) : null}

        {/* Gender Input */}
        <View style={styles.pickerContainer}>
          <RNPickerSelect
            placeholder={{ label: 'Select Gender', value: '' }}
            onValueChange={validateGender}
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
          {genderError ? (
                <Text style={styles.errorMessage}>{genderError}</Text>
          ) : null}

        {/* Date of Birth Input */}
        {/* <TouchableOpacity onPress={(e) => setShowDatePicker(e)} style={styles.dateInput}>
        <Text style={styles.dateText}>
          {dob.toDateString()}
        </Text>
      </TouchableOpacity> */}

      <Text>
        Date of Birth:
      </Text>

      {showDatePicker && Platform.OS !== 'web' && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dob}
          mode="date"
          display="default"
          onChange={setDob}
        />
      )}

      {Platform.OS === 'web' && (
        <DatePicker
          selected={dob}
          onChange={validateDob}
          dateFormat="MMMM d, yyyy"
          showYearDropdown
          showMonthDropdown
          dropdownMode='select'
        />
      )}
        {dobError ? (
                <Text style={styles.errorMessage}>{dobError}</Text>
          ) : null}

        {/* Password Input */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry={showPassword}
            value={password}
            onChangeText={validatePassword}
          />
          <TouchableOpacity onPress={handleTogglePasswordVisibility} style={styles.eyeIconContainer}>
            <FontAwesome5 name={showPassword ? 'eye-slash' : 'eye'} size={15} />
          </TouchableOpacity>     
        </View>
          {passwordError ? (
                  <Text style={styles.errorMessage}>{passwordError}</Text>
              ) : null}

        {/* Confirm Password Input */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm Password"
            secureTextEntry={showPassword}
            value={confirmPassword}
            onChangeText={validateConfirmPassword}
          />
          <TouchableOpacity onPress={handleTogglePasswordVisibility} style={styles.eyeIconContainer}>
            <FontAwesome5 name={showPassword ? 'eye-slash' : 'eye'} size={15} />
          </TouchableOpacity>
        </View>
          {confirmPasswordError ? (
                  <Text style={styles.errorMessage}>{confirmPasswordError}</Text>
              ) : null}

        {/* Role Input */}
        <View style={styles.pickerContainer}>
            <PickerSelect
                  placeholder={{ label: 'Select Role', value: "" }}
                  onValueChange={validateRole}
                  items={[
                  { label: 'Patient', value: 'Patient' },
                  { label: 'Doctor', value: 'Doctor' },

                ]}
                style={{
                  inputIOS: styles.pickerItem,
                  inputAndroid: styles.pickerItem,
                }}
                />
        </View>
                {roleError ? (
                  <Text style={styles.errorMessage}>{roleError}</Text>
              ) : null}

        <View style={[styles.pickerContainer, {display: showSpecialty ? 'flex' : 'none'}]}>
            <PickerSelect
                  placeholder={{ label: 'Select Specialty', value: "" }}
                  onValueChange={validateSpecialty}
                  items={[
                  { label: 'Primary Care & General Medicine', value: 'PrimaryCare' },
                  { label: 'OB-GYN', value: 'Obgyn' },
                  { label: 'Pediatrics', value: 'Pedia' },
                  { label: 'Cardiology', value: 'Cardio' },
                  { label: 'Opthalmology', value: 'Opthal' },
                  { label: 'Dermatology', value: 'Derma' },
                  { label: 'Neurology', value: 'Neuro' },
                  { label: 'Internal Medicine', value: 'InternalMed' },

                ]}
                style={{
                  inputIOS: styles.pickerItem,
                  inputAndroid: styles.pickerItem,
                }}
                />
        </View>
                {specialtyError ? (
                  <Text style={styles.errorMessage}>{specialtyError}</Text>
              ) : null}

        <LinearGradient
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 2 }}
          colors={['#92A3FD', '#9DCEFF']}
          style={{
            width: '100%',
            height: 45,
            borderRadius: 40,
            marginTop: 10,
          }}
        >
          <TouchableOpacity
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            onPress={(e) => {registerUser(e)}}
          >
            <Text style={styles.textButton}>SIGN UP</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

    
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 15,
    color: '#92A3FD',
    fontFamily: 'Poppins-SemiBold',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#d9d9d9',
    marginVertical: 10,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 14,
    fontFamily: 'Poppins',
    left: 10,
    top: 2,
    paddingLeft: 10,
  },
  eyeIconContainer: {
    padding: 10,
  },
  textcon: {
    paddingLeft: 30,
    marginTop: 50,
  },
  textButton: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 1,
    fontFamily: 'Poppins',
  },
  text1: {
    fontSize: 45,
    fontFamily: 'Poppins-SemiBold',
    lineHeight: 55,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    marginTop: 55,
  },
  container1: {
    flexDirection: 'column',
    marginTop: 25,
    paddingLeft: 30,
    paddingRight: 30,
  },
  textInput: {
    height: 50,
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#d9d9d9',
    marginVertical: 10,
    paddingLeft: 10,
    fontSize: 14,
    fontFamily: 'Poppins',
  },
  pickerContainer: {
    height: 50,
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#d9d9d9",
    marginVertical: 10,
    fontSize: 13,
    fontFamily: "Poppins",
    alignItems: "center",
    justifyContent: "center",
  },
  picker: {
    flex: 1,
    height: 50,
    fontSize: 15,
    fontFamily: 'Poppins',
    right: 4,
    bottom: 2,
  },
  pickerItem: {
    fontFamily: "Poppins",
    fontSize: 15,
    paddingLeft: 10,
  },
  logo: {
    width: 150,
    height: 100,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  errorMessage: {
    color: "red",
    fontSize: 12,
    marginLeft: 5,
    fontFamily: "Poppins",
  },
});

export default CreateAccount;