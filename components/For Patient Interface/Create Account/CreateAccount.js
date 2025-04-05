import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, Alert, ScrollView, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import { ip } from '../../../ContentExport';
import { Dropdown } from 'react-native-element-dropdown';
import CreateAccountStyles from './CreateAccountStyles';
import sd from '../../../utils/styleDictionary';
import * as Validation from './Validations.js';
import * as Progress from 'react-native-progress';
import { Divider, Modal, Portal } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

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
    street: "", //barangay
    city: "",
    barangay: "", //province
    region: "",
    zipCode: "",
  });
  const [regionArr, setRegionArr] = useState([]);
  const [provinceArr, setProvinceArr] = useState([]);
  const [cityArr, setCityArr] = useState([]);
  const [barangayArr, setBarangayArr] = useState([]);
  const [region, setRegion] = useState({ label : '', value: ''});
  const [province, setProvince] = useState({});
  const [city, setCity] = useState({});
  const [barangay, setBarangay] = useState({})


  const[image, setImage] = useState(null);
  const [dob, setDob] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false); // State to toggle DateTimePicker
  const [gender, setGender] = useState('');
  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  const theme = useTheme();
  const styles = CreateAccountStyles(theme);

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
  const [addressEror, setAddressError] = useState('');
  
  const [showPassword, setShowPassword] = useState(true);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false); // Close the DateTimePicker
    if (selectedDate) {
      setDob(selectedDate); // Set the selected date
      setDobError(''); // Clear any DOB error
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(()=>{
    axios.get(`https://psgc.gitlab.io/api/regions/`)
    .then(res => {
      const formattedRegions = res.data.map((element) => ({
        label: element.name,
        value: element.code
      }))

      setRegionArr(formattedRegions);
      console.log('res.data of region : ',res.data);
    })
    .catch(err => console.log(err));
  },[])

  const handleRegionChange = (item) => {
    console.log('region:', item);
    if (province.value) {
      setProvince({});
      setProvinceArr([]);
    }
    if (city.value) {
      setCity({});
      setCityArr([]);
    }
    if (barangay.value) {
      setBarangay({});
      setBarangayArr([]);
    }
    setRegion(prevRegion => ({ ...prevRegion, label: item.label, value: item.value }));
    setAddress(prevAddress => ({ ...prevAddress, region: item.label }));
  };

  useEffect(() => {
    // If NCR is selected, set provinces to empty and fetch cities directly
    if (region.label === 'NCR') {
      setProvinceArr([]); // Clear provinces array for NCR
      axios
        .get(`https://psgc.gitlab.io/api/regions/${region?.value}/cities-municipalities`)
        .then(res => {
          const formattedCities = res.data.map(element => ({
            label: element.name,
            value: element.code
          }));
          setCityArr(formattedCities);
        })
        .catch(err => console.log(err));
    } else if (region?.value) {
      // Fetch provinces for non-NCR regions
      axios
        .get(`https://psgc.gitlab.io/api/regions/${region.value}/provinces`)
        .then(res => {
          const formattedProvinces = res.data.map(element => ({
            label: element.name,
            value: element.code
          }));
          setProvinceArr(formattedProvinces);
        })
        .catch(err => console.log(err));
    }
  }, [region]);

  const handleProvinceChange = (item) => {
    console.log('province:', item);
    if (city.value) {
      setCity({})
      setCityArr([]);
    } ;
    if (barangay.value) {
      setBarangay({})
      setBarangayArr([]);
    };
    setProvince(prevProvince => ({ ...prevProvince, label: item.label, value: item.value }));
    setAddress(prevAddress => ({ ...prevAddress, barangay: item.label }));
  };

  useEffect(() => {
    if (province?.value) {
      // Fetch cities based on selected province
      axios
        .get(`https://psgc.gitlab.io/api/provinces/${province.value}/cities-municipalities`)
        .then(res => {
          const formattedCities = res.data.map(element => ({
            label: element.name,
            value: element.code
          }));
          setCityArr(formattedCities);
        })
        .catch(err => console.log(err));
    }
  }, [province]);

  const handleCityChange = (item) => {
    console.log('city:', item);
    if (barangay.value) {
      setBarangay({});
      setBarangayArr([]);
    }
    setCity(prevCity => ({ ...prevCity, label: item.label, value: item.value }));
    setAddress(prevAddress => ({ ...prevAddress, city: item.label }));
  };

  useEffect(()=>{
    axios.get(`https://psgc.gitlab.io/api/cities-municipalities/${city?.value}/barangays`)
    .then(res => {
      const formattedBarangays = res.data.map((element) => ({
        label: element.name,
        value: element.code
      }))
      setBarangayArr(formattedBarangays);
      console.log(res.data)
    })
    .catch(err => console.log(err));
  }, [city])

  const handleBarangayChange = (item) => {
    console.log('barangay:', item);
    setBarangay(prevBarangay => ({ ...prevBarangay, label: item.label, value: item.value }));
    setAddress(prevAddress => ({ ...prevAddress, street: item.label }));
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
    setDobError(Validation.validateDob(dob) || '');
    setAddressError(Validation.validateAddress(address) || '');
  }, [dob, gender, address])

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

  const progress = (currentStep / 3) - 0.1;

  return (
     <SafeAreaView style = {{flex:1, backgroundColor: theme.colors.background}}>
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

        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      {/* Step 1: Names */}
      {currentStep === 1 && (
        <View style={styles.formContainer}>
          {stepText('Tell us your name.', "We'll use this information to create your account.")}
          
          {/* First Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>First Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="First Name"
              placeholderTextColor={sd.colors.grey}
              value={firstname}
              onChangeText={setFirstName}
              autoFocus
              clearButtonMode='always'
            />
            {firstnameError && isErrorVisible && <Text style={styles.errorText}>{firstnameError}</Text>}
          </View>

          {/* Middle Initial */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Middle Initial</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Middle Initial"
              placeholderTextColor={sd.colors.grey}
              value={middleinitial}
              onChangeText={setMiddleInitial}
              clearButtonMode='always'
            />
            {middleInitialError && isErrorVisible && <Text style={styles.errorText}>{middleInitialError}</Text>}
          </View>

          {/* Last Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Last Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Last Name"
              placeholderTextColor={sd.colors.grey}
              value={lastname}
              onChangeText={setLastName}
              clearButtonMode='always'
            />
            {lastnameError && isErrorVisible && <Text style={styles.errorText}>{lastnameError}</Text>}
          </View>
        </View>
      )}

      {/* Step 2: DOB and Gender */}
      {currentStep === 2 && (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.formContainer}>
            {stepText('Share more about yourself.', "This will help us personalize your experience.")}

            {/* Date of Birth */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Date of Birth</Text>
              <TouchableOpacity
                style={styles.textInput}
                onPress={() => setShowDatePicker(true)} // Show DateTimePicker
              >
                <Text>
                  {dob ? dob.toLocaleDateString() : 'Select Date of Birth'}
                </Text>
              </TouchableOpacity>
              {dobError && isErrorVisible && <Text style={styles.errorText}>{dobError}</Text>}
            </View>

            {/* Show DateTimePicker */}
            {showDatePicker && (
              <DateTimePicker
                value={dob ? new Date(dob) : new Date()} // Default to current date if no DOB
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'} // Use spinner for iOS
                maximumDate={new Date()} // Prevent selecting future dates
                onChange={handleDateChange} // Handle date selection
              />
            )}

            {/* Gender */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Gender</Text>
              <View style = {styles.pickerContainer}>
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
                  style={{ flex: 1, padding: 10 }}
                />
              </View>
              {genderError && isErrorVisible && <Text style={styles.errorText}>{genderError}</Text>}
            </View>

            {/* Civil Status */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Civil Status</Text>
              <View style = {styles.pickerContainer}>
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
                  style={{ flex: 1, padding: 10 }}
                />
              </View>
            </View>

            <Divider bold />
              
            {/* Region */}
            <View style={[styles.inputContainer, {marginTop : 10}]}>
              <Text style={styles.inputLabel}>Region</Text>
              <View style={styles.pickerContainer}>
                <Dropdown
                  //placeholderStyle={styles.dropdownPlaceholder}
                  //selectedTextStyle={styles.dropdownText}
                  containerStyle={styles.dropdown}
                  data={regionArr ? regionArr.map((element) => ({ label: element.label, value: element.value })) : []}
                  labelField="label"
                  valueField="value"
                  placeholderTextColor={theme.colors.onSurfaceVariant}
                  placeholder="Select Region"
                  value={region}
                  onChange={handleRegionChange}
                  style={{ flex: 1, padding: 10 }}
                  mode='modal'
                  search
                  searchPlaceholder='Search Region'
                  searchPlaceholderTextColor={theme.colors.onPrimaryContainer}
                  inputSearchStyle = {{backgroundColor: theme.colors.primaryContainer}}
                />
              </View>
            </View>

            {/* Province */}
            {region.label !== 'NCR' ? 
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Province</Text>
              <View style={styles.pickerContainer}>
                <Dropdown
                  //placeholderStyle={styles.dropdownPlaceholder}
                  //selectedTextStyle={styles.dropdownText}
                  containerStyle={styles.dropdown}
                  data={provinceArr ? provinceArr.map((element) => ({ label: element.label, value: element.value })) : "Please select a region."}
                  labelField="label"
                  valueField="value"
                  placeholderTextColor={theme.colors.onSurfaceVariant}
                  placeholder="Select Province"
                  value={province}
                  onChange={handleProvinceChange}
                  style={{ flex: 1, padding: 10 }}
                  mode='modal'
                  search
                  searchPlaceholder='Search Province'
                  searchPlaceholderTextColor={theme.colors.onPrimaryContainer}
                  inputSearchStyle = {{backgroundColor: theme.colors.primaryContainer}}
                  disable = {provinceArr.length === 0}
                />
              </View>
            </View> : null}

            {/* City */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>City</Text>
              <View style={styles.pickerContainer}>
                <Dropdown
                  //placeholderStyle={styles.dropdownPlaceholder}
                  //selectedTextStyle={styles.dropdownText}
                  containerStyle={styles.dropdown}
                  data={cityArr ? cityArr.map((element) => ({ label: element.label, value: element.value })) : []}
                  labelField="label"
                  valueField="value"
                  placeholderTextColor={theme.colors.onSurfaceVariant}
                  placeholder="Select City"
                  value={city}
                  onChange={handleCityChange}
                  style={{ flex: 1, padding: 10 }}
                  mode='modal'
                  search
                  searchPlaceholder='Search City'
                  searchPlaceholderTextColor={theme.colors.onPrimaryContainer}
                  inputSearchStyle = {{backgroundColor: theme.colors.primaryContainer}}
                  disable = {cityArr.length === 0}
                />
              </View>
            </View>

            {/* Barangay */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Barangay</Text>
              <View style={styles.pickerContainer}>
                <Dropdown
                  //placeholderStyle={styles.dropdownPlaceholder}
                  //selectedTextStyle={styles.dropdownText}
                  containerStyle={styles.dropdown}
                  data={barangayArr ? barangayArr.map((element) => ({ label: element.label, value: element.value })) : []}
                  labelField="label"
                  valueField="value"
                  placeholderTextColor={theme.colors.onSurfaceVariant}
                  placeholder="Select Barangay"
                  value={barangay}
                  onChange={handleBarangayChange}
                  style={{  padding: 10, }}
                  maxHeight={300}
                  mode='modal'
                  search
                  searchPlaceholder='Search Barangay'
                  searchPlaceholderTextColor={theme.colors.onPrimaryContainer}
                  inputSearchStyle = {{backgroundColor: theme.colors.primaryContainer}}
                  disable = {barangayArr.length === 0}
                />
              </View>
            </View>

            {addressEror && isErrorVisible && <Text style={styles.errorText}>{addressEror}</Text>}
            </View>
        </ScrollView>
      )}

      {/* Step 3: Contact Information and Password */}
      {currentStep === 3 && (
        <View style={styles.formContainer}>
          {stepText('Almost done!', "Please enter your email and password.")}

          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Email"
              placeholderTextColor={sd.colors.grey}
              value={email}
              onChangeText={setEmail}
            />
            {emailError && isErrorVisible && <Text style={styles.errorText}>{emailError}</Text>}
          </View>

          {/* Contact Number */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Contact Number</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Contact Number"
              placeholderTextColor={sd.colors.grey}
              value={contactNumber}
              onChangeText={setContactNumber}
              keyboardType='phone-pad'
            />
            {contactNumberError && isErrorVisible && <Text style={styles.errorText}>{contactNumberError}</Text>}
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
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
            {passwordError && isErrorVisible && <Text style={styles.errorText}>{passwordError}</Text>}
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
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
            {confirmPasswordError && isErrorVisible && <Text style={styles.errorText}>{confirmPasswordError}</Text>}
          </View>
        </View>
      )}
    </KeyboardAwareScrollView>
    
      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
          {/* Back Button - If on Step 1, go back to the previous screen */}
          {currentStep === 1 ? (
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={[styles.buttonText, {color: sd.colors.blue}]}>Back</Text>
            </TouchableOpacity>
          ) : (
            /* Back Button for other steps within the form */
            <TouchableOpacity style={styles.backButton} onPress={handlePrevStep}>
              <Text style={[styles.buttonText, {color: sd.colors.blue}]}>Back</Text>
            </TouchableOpacity> 
          )}
 
          {/* Next/Submit Button */}
          {currentStep < 3 ? (
            <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.nextButton, {backgroundColor: theme.colors.secondary}]} onPress={registerUser}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          )}
        </View>
    </SafeAreaView>
  );
};



export default CreateAccount;
