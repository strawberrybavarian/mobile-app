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
  const [existingEmail, setExistingEmail] = useState([]);
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [middleinitial, setMiddleInitial] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [specialty, setSpecialty] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
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
  const [specialtyOptions, setSpecialtyOptions] = useState([]);

  // Validation states
  const [firstnameError, setfirstnameError] = useState('');
  const [middleInitialError, setMiddleInitialError] = useState('');
  const [lastnameError, setlastnameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [contactNumberError, setContactNumberError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [dobError, setDobError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [specialtyError, setSpecialtyError] = useState('')
  const [licenseNoError, setLicenseNoError] = useState('')
  const [showPassword, setShowPassword] = useState(true);
  const [isErrorVisible, setIsErrorVisible] = useState(false);

  const checkIfEmailExists = (email) => {
    return existingEmail.some(existing => existing === email);
  };

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

  useEffect(()=>{
    axios.get(`${ip.address}/api/admin/specialties`)
    .then((res)=>{
      console.log("Specialties: ",res.data)
      setSpecialtyOptions(res.data)
    })
    .catch((err)=>{
      console.log(err)
    })
  },[])

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
    setSpecialtyError(Validation.validateSpecialty(specialty) || '')
    setLicenseNoError(Validation.validateLicenseNo(licenseNo) || '')
  }, [dob, gender, specialty, licenseNo])

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (firstnameError || middleInitialError || lastnameError) {
        alert("Please fill in all required fields.");
        setIsErrorVisible(true);
        return;
      } 
      else {
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
      if(specialtyError || licenseNoError){
        alert("Please fill in all required fields.");
        setIsErrorVisible(true);
        return;
      }
      else {
        setIsErrorVisible(false);
        setCurrentStep(currentStep + 1);

      }
    }

    else if (currentStep === 4) {
      if (emailError || contactNumberError || passwordError || confirmPasswordError) {
        alert("Please fill in all required fields.");
        setIsErrorVisible(true);
        return;
      } else {
        setIsErrorVisible(false);
        registerUser();
      }
    }

  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const registerUser = async (e) => {
    e.preventDefault();

    if (
        firstnameError === '' &&
        lastnameError === '' &&
        emailError === '' &&
        passwordError === '' &&
        confirmPasswordError === ''
    ) {
        try {
          const doctorUser = {
              dr_firstName: capitalizeWords(firstname),
              dr_middleInitial: capitalizeWords(middleinitial),
              dr_lastName: capitalizeWords(lastname),
              dr_email: email.toLowerCase().trim(),
              dr_password: password,
              dr_dob: dob,
              dr_contactNumber: contactNumber.trim(),
              dr_gender: gender,
              dr_specialty: specialty,
          };
          console.log(doctorUser);
          const response = await axios.post(`${ip.address}/api/doctor/api/signup`, doctorUser);
          if (response.status === 201) {
              console.log(response.data);
              Alert.alert("Successfully registered Doctor");
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
    }
};

  const capitalizeWords = (text) => {
    return text
      .trim()
      .replace(/\s+/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  const stepText = (title, subtitle) => {
    return (
      <View style={styles.stepText}>
        <Text style={{ fontSize: 32, fontFamily: 'Poppins-Bold', color: 'black' }}>{title}</Text>
        <Text style={{ fontSize: 20, fontFamily: 'Poppins', color: '#666' }}>{subtitle}</Text>
      </View>
    );
  };

  const progress = currentStep / 4;

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
            value={firstname}
            onChangeText={setFirstName}
          />
          {firstnameError && isErrorVisible ? <Text style = { styles.errorText }>{firstnameError}</Text> : null}
          <TextInput
            style={styles.textInput}
            placeholder="Middle Initial"
            value={middleinitial}
            onChangeText={setMiddleInitial}
          />
          
          <TextInput
            style={styles.textInput}
            placeholder="Last Name"
            value={lastname}
            onChangeText={setLastName}
          />
          {lastnameError && isErrorVisible ? <Text style = { styles.errorText }>{lastnameError}</Text> : null}
        </View>
      )}

      {/* Step 2: DOB and Gender */}
      {currentStep === 2 && (
      <ScrollView>
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
          { dobError && isErrorVisible ? <Text style = { styles.errorText }>{dobError}</Text> : null }
            
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
              onChange={item => setGender(item.value)}
            />
          </View>
          {genderError && isErrorVisible ? <Text style = { styles.errorText }>{genderError}</Text> : null}
        </View>

        <Divider
          bold
        />

        {/* Civil Status Picker */}
        <View style={[styles.pickerContainer]}>
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
        </ScrollView>
      )}
 
      {/* Step 3: License Number and Specialty */}
      {currentStep === 3 && (
        <View style={styles.formContainer}>
          {stepText('Professional Details', "Tell us about your medical practice.")}

          {/* License Number */}
          <TextInput
            style={styles.textInput}
            placeholder="License Number"
            value={licenseNo}
            onChangeText={setLicenseNo}
          />
          {licenseNoError && isErrorVisible ? <Text style={styles.errorText}>{licenseNoError}</Text> : null}

          {/* Specialty Dropdown */}
          <Dropdown
            data={specialtyOptions}
            placeholder="Select Specialty"
            value={specialty}
            onChange={item => setSpecialty(item.name)}
            labelField="name"
            valueField="name"
            style={[styles.dropdown, {width: '100%'}]}
          />
          {specialtyError && isErrorVisible ? <Text style={styles.errorText}>{specialtyError}</Text> : null}
        </View>
      )}

      {/* Step 4: Contact Information and Password */}
      {currentStep === 4 && (
        <View style={styles.formContainer}>
          {stepText('Almost done!', "Please enter your contact information.")}

          {/* Email */}
          <TextInput
            style={styles.textInput}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          {emailError && isErrorVisible ? <Text style={styles.errorText}>{emailError}</Text> : null}

          {/* Contact Number */}
          <TextInput
            style={styles.textInput}
            placeholder="Contact Number"
            value={contactNumber}
            onChangeText={setContactNumber}
          />
          {contactNumberError && isErrorVisible ? <Text style={styles.errorText}>{contactNumberError}</Text> : null}

          {/* Password */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={showPassword}
            />
            <TouchableOpacity onPress={handleTogglePasswordVisibility} style={styles.togglePasswordButton}>
              <FontAwesome5 name={showPassword ? 'eye-slash' : 'eye'} size={18} color="gray" />
            </TouchableOpacity>
          </View>
          {passwordError && isErrorVisible ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          {/* Confirm Password */}
          <View style= {styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={showPassword}
            />
            {confirmPasswordError && isErrorVisible ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
          </View>
        </View>
      )}

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.backButton} onPress={handlePrevStep}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        )}
        {currentStep < 4 ? (
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
