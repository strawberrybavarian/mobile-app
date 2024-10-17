import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, Alert, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import { ip } from '../../../ContentExport';
import { Dropdown } from 'react-native-element-dropdown';
import styles from './CreateAccountStyles';
import sd from '../../../utils/styleDictionary';
import * as Validation from './Validations.js';
import * as Progress from 'react-native-progress';
import { Divider } from 'react-native-paper';

const CreateAccount = ({ navigation }) => {

  const [currentStep, setCurrentStep] = useState(1);
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [middleinitial, setMiddleInitial] = useState('');
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [nationality, setNationality] = useState('');
  const [civilStatus, setCivilStatus] = useState('');
  const civilStatusOptions = [
    { label: 'Single', value: 'Single' },
    { label: 'Married', value: 'Married' },
    { label: 'Widowed', value: 'Widowed' },
    { label: 'Separated', value: 'Separated' },
    { label: 'Divorced', value: 'Divorced' },
  ]
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const[image, setImage] = useState(null);
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  // Validation states
  const [firstnameError, setfirstnameError] = useState('');
  const [middleInitialError, setMiddleInitialError] = useState('');
  const [lastnameError, setlastnameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [contactNumberError, setContactNumberError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [dobError, setDobError] = useState('');
  

  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const [showPassword, setShowPassword] = useState(true);

  // Populate years from current year to past (e.g., last 100 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, index) => {
    const year = new Date().getFullYear() - index;
    return { label: String(year), value: year };
  });

  // Populate months (1 to 12)
  const months = [
    { label: 'January', value: 1 },
    { label: 'February', value: 2 },
    { label: 'March', value: 3 },
    { label: 'April', value: 4 },
    { label: 'May', value: 5 },
    { label: 'June', value: 6 },
    { label: 'July', value: 7 },
    { label: 'August', value: 8 },
    { label: 'September', value: 9 },
    { label: 'October', value: 10 },
    { label: 'November', value: 11 },
    { label: 'December', value: 12 },
  ];
  
  // Populate days (1 to 31 based on selected month and year)
  const length = (() => {
    if (selectedMonth === 2 && selectedYear % 4 === 0) {
      return 29; // February in a leap year
    } else if (selectedMonth === 2) {
      return 28; // February in a non-leap year
    } else if ([4, 6, 9, 11].includes(selectedMonth)) {
      return 30; // April, June, September, November have 30 days
    } else {
      return 31; // All other months have 31 days
    }
  })();
  
  const days = Array.from({ length: length }, (_, index) => {
    const day = index + 1;
    return { label: String(day), value: day };
  });

  // Combine selected year, month, and day into a Date object
  useEffect(() => {
    if (selectedYear && selectedMonth && selectedDay) {
      const dob = new Date(selectedYear, selectedMonth - 1, selectedDay);
      setDob(dob);
    }
  }, [selectedYear, selectedMonth, selectedDay]);

  useEffect(() => {
    if (!selectedDay || !selectedMonth || !selectedYear) {
      setDobError("Invalid date of birth");
    } else {
      const selectedDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
      const age = currentYear - selectedDate.getFullYear();
      
      // Check if the user is younger than 18
      if (age < 18 || (age === 18 && new Date() < selectedDate.setFullYear(currentYear))) {
        setDobError("You must be at least 18 years old.");
      } else {
        setDobError(""); // Clear the error when valid
      }
    }
  }, [selectedDay, selectedMonth, selectedYear, currentYear]);


  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    setfirstnameError(Validation.validateFirstName(firstname) || ''); // Set error if exists
    setMiddleInitialError(Validation.validateMiddleInitial(middleinitial) || '');
    setlastnameError(Validation.validateLastName(lastname) || '');
  }, [firstname, middleinitial, lastname]);

  useEffect(() => {
    setEmailError(Validation.validateEmail(email) || '');
    setContactNumberError(Validation.validateContactNumber(contactNumber) || '');
    setPasswordError(Validation.validatePassword(password) || '');
    setConfirmPasswordError(Validation.validateConfirmPassword(password, confirmPassword) || '');
  }, [email, contactNumber, password, confirmPassword]);

  useEffect(() => {
    setGenderError(Validation.validateGender(gender) || '');
    setDobError(Validation.validateDob(selectedDay, selectedMonth, selectedYear, currentYear) || '');
  }, [dob, gender])

  const handleNextStep = () => {

    if (currentStep === 1) {
        
        // Check if there are any errors
        if (firstnameError || middleInitialError || lastnameError) {
            alert("Please fill in all required fields.");
            setIsErrorVisible(true);
            return;
        } else {
            setIsErrorVisible(false);
            setCurrentStep(currentStep + 1);
        }
    } 
    else if (currentStep === 2) {
        if (dobError || genderError) {
            alert("Please fill in all required fields.");
            setIsErrorVisible(true);
            return;
        } else {
            setIsErrorVisible(false);
            setCurrentStep(currentStep + 1);
        }
    } 
    else if (currentStep === 3) {
        // Check for errors
        if (emailError || contactNumberError || passwordError || confirmPasswordError) {
            alert("Please fill in all required fields.");
            setIsErrorVisible(true);
            return;
        } else {
            setIsErrorVisible(false);
            registerUser(); // Only proceed to register if no errors
        }
    }
};

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const registerUser = async (e) => {
    e.preventDefault();

    console.log('Registering user...');
    console.log('First Name:', firstname);
    console.log('Middle Initial:', middleinitial);
    console.log('Last Name:', lastname);
    console.log('Email:', email);
    console.log('Contact Number:', contactNumber);

    console.log('errors:', firstnameError, middleInitialError, lastnameError, emailError, contactNumberError, passwordError, confirmPasswordError, genderError, dobError);

    if (
        firstnameError === '' &&
        lastnameError === '' &&
        emailError === '' &&
        passwordError === '' &&
        confirmPasswordError === '' &&
        genderError === '' &&
        dobError === '' 
    ) {
        try {
          const patientUser = {
              patient_firstName: capitalizeWords(firstname),
              patient_middleInitial: capitalizeWords(middleinitial),
              patient_lastName: capitalizeWords(lastname),
              patient_email: email.trim().toLocaleLowerCase(),
              patient_password: password,
              patient_dob: dob,
              patient_contactNumber: contactNumber.trim(),
              patient_gender: gender,
              patient_civilstatus: civilStatus,
              patient_address: address,
              patient_nationality: nationality,
              
          };
          console.log(patientUser);
          const response = await axios.post(`${ip.address}/api/patient/api/signup`, patientUser);
          if (response.status === 201) {
              console.log(response.data);
              Alert.alert("Successfully registered Patient");
              navigation.navigate('SigninPage');
          } else {
              console.error(response.data);
              Alert.alert('Registration failed. Please try again.');
          }
        }
         catch (err) {
            console.error(err);
            Alert.alert('An error occurred during registration. Please try again.');
        }
    } else {
        Alert.alert('There are some errors in the form.');
        setIsErrorVisible(true);
    }
};


  const capitalizeWords = (text) => {
    return text
      
      .replace(/\s+/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  const stepText = (title, subtitle) => {
    return (
      <View style={styles.stepText}>
        <Text style={{ fontSize: sd.fontSizes.xl, fontFamily: sd.fonts.bold, color: sd.colors.blue }}>{title}</Text>
        <Text style={{ fontSize: sd.fontSizes.large, fontFamily: 'Poppins', color: '#666' }}>{subtitle}</Text>
      </View>
    );
  };

  const progress = currentStep / 3;

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <Progress.Bar 
          progress={progress} 
          width={null}
          color= {sd.colors.blue} 
          style={styles.progressBar}
          visible = {true}
          borderRadius = {10}
          />
      </View>

      {/* Step 1: Names */}
      {currentStep === 1 && (
        <View style={styles.formContainer}>
          {stepText('Tell us your name.', "We'll use this information to create your account.")}
          <TextInput
            style={styles.textInput}
            placeholder="First Name"
            placeholderTextColor={sd.colors.grey}
            value={firstname}
            onChangeText={setFirstName}
          />
          {firstnameError && isErrorVisible ? <Text style = { styles.errorText }>{firstnameError}</Text> : null}
          <TextInput
            style={styles.textInput}
            placeholder="Middle Initial"
            placeholderTextColor={sd.colors.grey}
            value={middleinitial}
            onChangeText={setMiddleInitial}
          />
          {middleInitialError && isErrorVisible ? <Text style = { styles.errorText }>{middleInitialError}</Text> : null}
          
          <TextInput
            style={styles.textInput}
            placeholder="Last Name"
            placeholderTextColor={sd.colors.grey}
            value={lastname}
            onChangeText={setLastName}
          />
          {lastnameError && isErrorVisible ? <Text style = { styles.errorText }>{lastnameError}</Text> : null}
        </View>
      )}

      {/* Step 2: DOB and Gender */}
      {currentStep === 2 && (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.formContainer}>
            {stepText('Share more about yourself.', "This will help us personalize your experience.")}

            {/* Date of Birth Dropdowns */}
            <View style={styles.datePickerContainer}>
              <Dropdown
                data={years}
                placeholder="Year"
                placeholderTextColor={sd.colors.grey}
                value={selectedYear}
                onChange={item => {
                  console.log("Selected Year:", item.value);
                  setSelectedYear(item.value);
                }}
                labelField="label"
                valueField="value"
                selectedTextStyle={styles.dropdownText}
                style={styles.dropdown}
              />

              <Dropdown
                data={months}
                placeholder="Month"
                placeholderTextColor={sd.colors.grey}
                value={selectedMonth}
                onChange={item => {
                  console.log("Selected Month:", item.value);
                  setSelectedMonth(item.value);
                }}
                labelField="label"
                valueField="value"
                selectedTextStyle={styles.dropdownText}
                style={styles.dropdown}
              />

              <Dropdown
                data={days}
                placeholder="Day"
                placeholderTextColor={sd.colors.grey}
                value={selectedDay}
                onChange={item => {
                  console.log("Selected Day:", item.value);
                  setSelectedDay(item.value);
                }}
                labelField="label"
                valueField="value"
                selectedTextStyle={styles.dropdownText}
                style={styles.dropdown}
              />
            </View>

            {dobError && isErrorVisible ? <Text style={styles.errorText}>{dobError}</Text> : null}

            <Divider bold />

            {/* Gender Picker */}
            <View style={styles.pickerContainer}>
              <Dropdown
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownText}
                containerStyle={styles.dropdownContainer}
                data={genderOptions}
                labelField="label"
                valueField="value"
                placeholderTextColor={sd.colors.grey}
                placeholder="Select Gender"
                value={gender}
                onChange={item => setGender(item.value)}
              />
            </View>

            {genderError && isErrorVisible ? <Text style={styles.errorText}>{genderError}</Text> : null}

            {/* Civil Status Picker */}
            <View style={[styles.pickerContainer, { marginTop: 0 }]}>
              <Dropdown
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownText}
                containerStyle={styles.dropdownContainer}
                data={civilStatusOptions}
                labelField="label"
                valueField="value"
                placeholderTextColor={sd.colors.grey}
                placeholder="Select Civil Status"
                value={civilStatus}
                onChange={item => setCivilStatus(item.value)}
              />
            </View>

            <Divider bold />

            {/* Address Fields */}
            <View style={[styles.formContainer, { marginTop: 15 }]}>
              <TextInput
                style={styles.textInput}
                placeholder="Street"
                placeholderTextColor={sd.colors.darkGray}
                value={address.street}
                onChangeText={text => setAddress({ ...address, street: text })}
              />

              <TextInput
                style={styles.textInput}
                placeholder="Municipality"
                placeholderTextColor={sd.colors.darkGray}
                value={address.municipality}
                onChangeText={text => setAddress({ ...address, municipality: text })}
              />

              <TextInput
                style={styles.textInput}
                placeholder="State"
                placeholderTextColor={sd.colors.darkGray}
                value={address.state}
                onChangeText={text => setAddress({ ...address, state: text })}
              />

              <TextInput
                style={styles.textInput}
                placeholder="Zipcode"
                placeholderTextColor={sd.colors.darkGray}
                value={address.zipcode}
                onChangeText={text => setAddress({ ...address, zipcode: text })}
              />

              <TextInput
                style={styles.textInput}
                placeholder="Country"
                placeholderTextColor={sd.colors.darkGray}
                value={address.country}
                onChangeText={text => setAddress({ ...address, country: text })}
              />
            </View>
          </View>
        </ScrollView>
      )}

 

      {/* Step 3: Contact Information and Password */}
      {currentStep === 3 && (
        <View style={styles.formContainer}>
          {stepText('Almost done!', "Please enter your email and password.")}
          <TextInput
            style={styles.textInput}
            placeholder="Email"
            placeholderTextColor={sd.colors.grey}
            value={email}
            onChangeText={setEmail}
          />
          {emailError && isErrorVisible ? <Text style = { styles.errorText }>{emailError}</Text> : null}
          <TextInput
            style={styles.textInput}
            placeholder="Contact Number"
            placeholderTextColor={sd.colors.grey}
            value={contactNumber}
            onChangeText={setContactNumber}
          />
          {contactNumberError && isErrorVisible ? <Text style = { styles.errorText }>{contactNumberError}</Text> : null}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor={sd.colors.grey}
              secureTextEntry={showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={handleTogglePasswordVisibility}>
              <FontAwesome5 name={showPassword ? 'eye-slash' : 'eye'} size={15} />
            </TouchableOpacity>
          </View>
          {passwordError && isErrorVisible ? <Text style = { styles.errorText }>{passwordError}</Text> : null}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm Password"
              placeholderTextColor={sd.colors.grey}
              secureTextEntry={showPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={handleTogglePasswordVisibility}>
              <FontAwesome5 name={showPassword ? 'eye-slash' : 'eye'} size={15} />
            </TouchableOpacity>
          </View>
          {confirmPasswordError  && isErrorVisible ? <Text style = { styles.errorText }>{confirmPasswordError}</Text> : null}
        </View>
      )}

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        {/* Back Button - If on Step 1, go back to the previous screen */}
        {currentStep === 1 ? (
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        ) : (
          /* Back Button for other steps within the form */
          <TouchableOpacity style={styles.backButton} onPress={handlePrevStep}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        )}

        {/* Next/Submit Button */}
        {currentStep < 3 ? (
          <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.submitButton} onPress={registerUser}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        )}
      </View>

    </KeyboardAwareScrollView>
  );
};



export default CreateAccount;
