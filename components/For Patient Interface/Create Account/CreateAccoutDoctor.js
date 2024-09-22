import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import { ip } from '../../../ContentExport';
import { Dropdown } from 'react-native-element-dropdown';
import styles from './CreateAccountStyles';

const CreateAccount = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [existingEmail, setExistingEmail] = useState([]);

  // Validation states
  const [firstnameError, setfirstnameError] = useState('');
  const [lastnameError, setlastnameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [contactNumberError, setContactNumberError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [dobError, setDobError] = useState('');

  //get all emails
  useEffect(() => {
    axios.get(`${ip.address}/doctor/api/allemail`)
    .then((res) => {
      if (Array.isArray(res.data)) {
        setExistingEmail(res.data); 
        console.log('Emails set:', res.data); 
      } else {
        console.error('Expected an array but got:', typeof res.data, res.data);
      }
    })
    .catch((err) => {
      console.log('error here');
    });
  },[email])

  const checkIfEmailExists = (email) => {
    return existingEmail.some(existing => existing === email);
  };

  // Step 1: Names
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [middleinitial, setMiddleInitial] = useState('');

  // Step 2: DOB and Gender
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [specialty, setSpecialty] = useState('');

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


  // Step 3: Contact Information and Passwords
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  const [showCalendar, setShowCalendar] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!firstname) {
        alert("First Name cannot be empty.");
        return;
      }
      if (!lastname) {
        alert("Last Name cannot be empty.");
        return;
      }
    } else if (currentStep === 2) {
      if (!dob || !gender) {
        alert("Please enter valid DOB and select gender.");
        return;
      }
    } else if (currentStep === 3) {
      if (!email || !password || !confirmPassword || !contactNumber) {
        alert("Please fill in all required fields.");
        return;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
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
          const doctorUser = {
              dr_firstName: firstname,
              dr_middleInitial: middleinitial,
              dr_lastName: lastname,
              dr_email: email,
              dr_password: password,
              dr_dob: dob,
              dr_contactNumber: contactNumber,
              dr_gender: gender,
          };
          console.log(doctorUser);
          const response = await axios.post(`${ip.address}/doctor/api/signup`, doctorUser);
          if (response.status === 200) {
              console.log(response.data);
              window.alert("Successfully registered Doctor");
              navigation.navigate('SigninPage');
          } else {
              console.error(response.data);
              window.alert('Registration failed. Please try again.');
          }
        }
         catch (err) {
            console.error(err);
            window.alert('An error occurred during registration. Please try again.');
        }
    } else {
        window.alert('There are some errors in the form.');
    }
};

  const capitalizeWords = (text) => {
    return text
      .trim()
      .replace(/\s+/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  const validateFirstName = (text) => {
    const capitalized = capitalizeWords(text);
    if (!capitalized) {
      setfirstnameError("First name cannot be empty.");
    } else {
      setfirstnameError("");
    }
    setFirstName(capitalized);
  };

  const validateLastName = (text) => {
    const capitalized = capitalizeWords(text);
    if (!capitalized) {
      setlastnameError("Last name cannot be empty.");
    } else {
      setlastnameError("");
    }
    setLastName(capitalized);
  };

  const validateMiddleInitial = (text) => {
    const trimmedInitial = text.trim().replace('.', '');
    setMiddleInitial(trimmedInitial.toUpperCase());
  };

  const validateEmail = (text) => {
    const lowercased = text.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(lowercased)) {
      setEmailError("Email format invalid. Example of valid format: xyz@abc.com");
    } else {
      setEmailError("");
    }
    setEmail(lowercased);
  };

  const validateContactNumber = (text) => {
    const trimmed = text.trim();
    const contactNumberRegex = /^09\d{9}$/;

    if (!trimmed) {
      setContactNumberError("Contact number cannot be empty.");
    } else if (!contactNumberRegex.test(trimmed)) {
      setContactNumberError("Contact number must start with 09 and contain 11 digits.");
    } else {
      setContactNumberError("");
    }
    setContactNumber(trimmed);
  };

  const validatePassword = (text) => {
    const trimmed = text.trim();
    if (trimmed.length < 8) {
      setPasswordError("Password must be at least 8 characters");
    } else {
      setPasswordError("");
    }
    setPassword(trimmed);
  };

  const validateConfirmPassword = (text) => {
    const trimmed = text.trim();
    if (password !== trimmed) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
    setConfirmPassword(trimmed);
  };

  const validateGender = (value) => {
    if (!value) {
      setGenderError("Please select a gender.");
    } else {
      setGenderError("");
    }
    setGender(value);
  };

  const stepText = (title, subtitle) => {
    return (
      <View style={styles.stepText}>
        <Text style={{ fontSize: 32, fontFamily: 'Poppins-Bold', color: 'black' }}>{title}</Text>
        <Text style={{ fontSize: 20, fontFamily: 'Poppins', color: '#666' }}>{subtitle}</Text>
      </View>
    );
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressStep, currentStep >= 1 && styles.activeStep]} />
        <View style={[styles.progressStep, currentStep >= 2 && styles.activeStep]} />
        <View style={[styles.progressStep, currentStep >= 3 && styles.activeStep]} />
      </View>

      {/* Step 1: Names */}
      {currentStep === 1 && (
        <View style={styles.formContainer}>
          {stepText('Tell us your name.', "We'll use this information to create your account.")}
          <TextInput
            style={styles.textInput}
            placeholder="First Name"
            value={firstname}
            onChangeText={validateFirstName}
          />
          {firstnameError ? <Text style = { styles.errorText }>{firstnameError}</Text> : null}
          <TextInput
            style={styles.textInput}
            placeholder="Middle Initial"
            value={middleinitial}
            onChangeText={validateMiddleInitial}
          />
          
          <TextInput
            style={styles.textInput}
            placeholder="Last Name"
            value={lastname}
            onChangeText={validateLastName}
          />
          {lastnameError ? <Text style = { styles.errorText }>{lastnameError}</Text> : null}
        </View>
      )}

      {/* Step 2: DOB and Gender */}
      {currentStep === 2 && (
        <View style={styles.formContainer}>
          {stepText('Share more about yourself', "This will help us personalize your experience.")}

          {/* Date of Birth Dropdowns */}
          <View style={styles.datePickerContainer}>
          <Dropdown
            data={years}
            placeholder="Year"
            value={selectedYear}
            onChange={item => {
              console.log("Selected Year:", item.value);
              setSelectedYear(item.value); // Ensure the state is updated correctly
            }}
            labelField="label"
            valueField="value"
            selectedTextStyle={styles.dropdownText}
            style={styles.dropdown}
          />

          <Dropdown
            data={months}
            placeholder="Month"
            value={selectedMonth}
            onChange={item => {
              console.log("Selected Month:", item.value);
              setSelectedMonth(item.value); // Ensure the state is updated correctly
            }}
            labelField="label"
            valueField="value"
            selectedTextStyle={styles.dropdownText}
            style={styles.dropdown}
          />

          <Dropdown
            data={days}
            placeholder="Day"
            value={selectedDay}
            onChange={item => {
              console.log("Selected Day:", item.value);
              setSelectedDay(item.value); // Ensure the state is updated correctly
            }}
            labelField="label"
            valueField="value"
            selectedTextStyle={styles.dropdownText}
            style={styles.dropdown}
          />
          </View>
          { dobError ? <Text style = { styles.errorText }>{dobError}</Text> : null }
            
          {/* Gender Picker */}
          <View style={styles.pickerContainer}>
            <Dropdown
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownText}
              containerStyle={styles.dropdownContainer}
              data={genderOptions}
              labelField="label"
              valueField="value"
              placeholder="Select Gender"
              value={gender}
              onChange={item => validateGender(item.value)}
            />
            {genderError ? <Text style = { styles.errorText }>{genderError}</Text> : null}
          </View>
        </View>
      )}
 

      {/* Step 3: Contact Information and Password */}
      {currentStep === 3 && (
        <View style={styles.formContainer}>
          {stepText('Almost done!', "Please enter your email and password.")}
          <TextInput
            style={styles.textInput}
            placeholder="Email"
            value={email}
            onChangeText={validateEmail}
          />
          {emailError ? <Text style = { styles.errorText }>{emailError}</Text> : null}
          <TextInput
            style={styles.textInput}
            placeholder="Contact Number"
            value={contactNumber}
            onChangeText={validateContactNumber}
          />
          {contactNumberError ? <Text style = { styles.errorText }>{contactNumberError}</Text> : null}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              secureTextEntry={showPassword}
              value={password}
              onChangeText={validatePassword}
            />
            <TouchableOpacity onPress={handleTogglePasswordVisibility}>
              <FontAwesome5 name={showPassword ? 'eye-slash' : 'eye'} size={15} />
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style = { styles.errorText }>{passwordError}</Text> : null}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm Password"
              secureTextEntry={showPassword}
              value={confirmPassword}
              onChangeText={validateConfirmPassword}
            />
            <TouchableOpacity onPress={handleTogglePasswordVisibility}>
              <FontAwesome5 name={showPassword ? 'eye-slash' : 'eye'} size={15} />
            </TouchableOpacity>
          </View>
          {confirmPasswordError ? <Text style = { styles.errorText }>{confirmPasswordError}</Text> : null}
        </View>
      )}

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.backButton} onPress={handlePrevStep}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        )}
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
