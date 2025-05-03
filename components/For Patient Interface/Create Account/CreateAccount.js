import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, Alert, ScrollView, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import { ip } from '../../../ContentExport';
import { Dropdown } from 'react-native-element-dropdown';
import CreateAccountStyles from './CreateAccountStyles';
import sd from '../../../utils/styleDictionary';
import * as Progress from 'react-native-progress';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Divider } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';

// Update imports to include new validation
import { 
  createFieldValidator, validateFirstName, validateMiddleInitial, validateLastName, 
  validateEmail, validateContactNumber, validatePassword, validateConfirmPassword, 
  validateGender, validateDob, validateAddress, validateRegion, validateCity, 
  validateBarangay, validateStreet, validateZipCode, validateNationality, validateProvince
} from './Validations.js';

// Import the TermsAndConditionsModal component
import TermsAndConditionsModal from './TermsAndConditionsModal';

const CreateAccount = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Replace simple form fields with validator objects
  const [firstname, setFirstName] = useState(createFieldValidator());
  const [middleinitial, setMiddleInitial] = useState(createFieldValidator());
  const [lastname, setLastName] = useState(createFieldValidator());
  const [email, setEmail] = useState(createFieldValidator());
  const [password, setPassword] = useState(createFieldValidator());
  const [confirmPassword, setConfirmPassword] = useState(createFieldValidator());
  const [contactNumber, setContactNumber] = useState(createFieldValidator());
  // const [dob, setDob] = useState(createFieldValidator());
  // const [gender, setGender] = useState(createFieldValidator());
  
  // Add these state variables for address validation
  const [regionField, setRegionField] = useState(createFieldValidator());
  const [cityField, setCityField] = useState(createFieldValidator());
  const [barangayField, setBarangayField] = useState(createFieldValidator());
  const [streetField, setStreetField] = useState(createFieldValidator());
  const [zipCodeField, setZipCodeField] = useState(createFieldValidator());
  
  // Add this to your state variables
  const [province, setProvince] = useState({});
  const [provinceArr, setProvinceArr] = useState([]);
  const [provinceField, setProvinceField] = useState(createFieldValidator());
  
  // Update state to use field validator pattern for nationality
  const [nationality, setNationality] = useState(createFieldValidator());
  const [civilStatus, setCivilStatus] = useState('');
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    barangay: "",
    region: "",
    zipCode: "",
  });
  const [regionArr, setRegionArr] = useState([]);
  const [cityArr, setCityArr] = useState([]);
  const [barangayArr, setBarangayArr] = useState([]);
  const [region, setRegion] = useState({ label : '', value: ''});
  const [city, setCity] = useState({});
  const [barangay, setBarangay] = useState({});
  // const [showPassword, setShowPassword] = useState(true);
  // const [showDatePicker, setShowDatePicker] = useState(false);


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

  // Add this with other useEffect hooks to fetch provinces
  useEffect(() => {
    if (region.value) {
      // Check if selected region is NCR
      const isNCR = region.label.includes('National Capital Region') || region.label === 'NCR';
      
      if (!isNCR) {
        // Fetch provinces for the selected region
        axios.get(`https://psgc.gitlab.io/api/regions/${region.value}/provinces`)
          .then(res => {
            const formattedProvinces = res.data.map((element) => ({
              label: element.name,
              value: element.code
            }));
            setProvinceArr(formattedProvinces);
          })
          .catch(err => {
            console.log('Error fetching provinces:', err);
            setProvinceArr([]); // Clear provinces on error
          });
      } else {
        // Clear province data for NCR
        setProvince({});
        setProvinceArr([]);
      }
    }
  }, [region]);

  // Update the handleRegionChange function
  const handleRegionChange = (item) => {
    console.log('region:', item);
    // Clear all dependent fields
    setProvince({});
    setProvinceArr([]);
    setCity({});
    setCityArr([]);
    setBarangay({});
    setBarangayArr([]);
    
    // Set the region value
    setRegion(prevRegion => ({ ...prevRegion, label: item.label, value: item.value }));
    setAddress(prevAddress => ({ ...prevAddress, region: item.label }));
    
    // Validate the region field
    const updatedRegionField = regionField.setValue(item);
    const error = validateRegion(item);
    updatedRegionField.setError(error);
    updatedRegionField.setTouched(true);
    setRegionField({...updatedRegionField});
    
    // Check if the selected region is NCR
    const isNCR = item.label.includes('National Capital Region') || item.label === 'NCR';
    
    // Clear province field error if region is NCR
    if (isNCR) {
      // Reset province field errors since province is not required for NCR
      const updatedProvinceField = {...provinceField};
      updatedProvinceField.error = null;
      setProvinceField(updatedProvinceField);
      
      // For NCR, directly fetch cities
      axios.get(`https://psgc.gitlab.io/api/regions/${item.value}/cities-municipalities`)
        .then(res => {
          const formattedCities = res.data.map(element => ({
            label: element.name,
            value: element.code
          }));
          setCityArr(formattedCities);
        })
        .catch(err => {
          console.log('Error fetching cities:', err);
          setCityArr([]); // Clear cities on error
        });
    }
  };

  // Add this handler for province changes
  const handleProvinceChange = (item) => {
    console.log('province:', item);
    // Reset city and barangay when province changes
    if (city.value) {
      setCity({});
      setCityArr([]);
    }
    if (barangay.value) {
      setBarangay({});
      setBarangayArr([]);
    }
    
    // Set the province value
    setProvince(prevProvince => ({ ...prevProvince, label: item.label, value: item.value }));
    setAddress(prevAddress => ({ ...prevAddress, province: item.label }));

    // Validate the province field and clear error if valid
    const error = validateProvince(item, region.label);
    const updatedProvinceField = provinceField.setValue(item).setTouched(true).setError(error);
    setProvinceField({ ...updatedProvinceField });

    // Fetch cities for the selected province
    axios.get(`https://psgc.gitlab.io/api/provinces/${item.value}/cities-municipalities`)
      .then(res => {
        const formattedCities = res.data.map(element => ({
          label: element.name,
          value: element.code
        }));
        setCityArr(formattedCities);
      })
      .catch(err => {
        console.log('Error fetching cities:', err);
        setCityArr([]); // Clear cities on error
      });
  };

  // Add this function to handle city changes
  const handleCityChange = (item) => {
    console.log('city:', item);
    if (barangay.value) {
      setBarangay({});
      setBarangayArr([]);
    }
    
    // Set the city value
    setCity(prevCity => ({ ...prevCity, label: item.label, value: item.value }));
    setAddress(prevAddress => ({ ...prevAddress, city: item.label }));
    
    // Validate the city field
    const updatedCityField = cityField.setValue(item);
    const error = validateCity(item);
    updatedCityField.setError(error);
    updatedCityField.setTouched(true);
    setCityField({...updatedCityField});
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

  // Fix in handleBarangayChange - currently incorrectly setting street
  const handleBarangayChange = (item) => {
    console.log('barangay:', item);
    
    // Set the barangay value
    setBarangay(prevBarangay => ({ ...prevBarangay, label: item.label, value: item.value }));
    setAddress(prevAddress => ({ ...prevAddress, barangay: item.label })); // Corrected to set barangay
    
    // Validate the barangay field
    const updatedBarangayField = barangayField.setValue(item);
    const error = validateBarangay(item);
    updatedBarangayField.setError(error);
    updatedBarangayField.setTouched(true);
    setBarangayField({...updatedBarangayField});
  };

  // Handle street address changes
  const handleStreetChange = (value) => {
    const updatedField = streetField.setValue(value);
    if (value && value.trim() === '') {
      updatedField.setError("Street address cannot be only spaces.");
    } else {
      const error = validateStreet(value);
      updatedField.setError(error);
    }
    setStreetField({...updatedField});
    setAddress(prevAddress => ({ ...prevAddress, street: value }));
  };

  // Handle zip code changes
  const handleZipCodeChange = (value) => {
    handleFieldChange(zipCodeField, setZipCodeField, validateZipCode)(value);
    setAddress(prevAddress => ({ ...prevAddress, zipCode: value }));
  };

  // Update validateAddressFields
  const validateAddressFields = () => {
    // Mark address fields as touched
    setRegionField({...regionField, touched: true});
    
    // Check if province is required based on region
    const isProvinceRequired = region.value && 
        !(region.label.includes('National Capital Region') || region.label === 'NCR');
    
    if (isProvinceRequired) {
      setProvinceField({...provinceField, touched: true});
    } else {
      // If province is not required, clear any province errors
      const updatedProvinceField = {...provinceField};
      updatedProvinceField.error = null;
      setProvinceField(updatedProvinceField);
    }
    
    setCityField({...cityField, touched: true});
    setBarangayField({...barangayField, touched: true});
    setStreetField({...streetField, touched: true});
    setZipCodeField({...zipCodeField, touched: true});
    
    // Check for errors
    if (regionField.error || 
        (isProvinceRequired && provinceField.error) ||
        cityField.error || 
        barangayField.error ||
        streetField.error ||
        zipCodeField.error) {
      return false;
    }
    
    // Also check if fields have values
    if (!region.value || 
        (isProvinceRequired && !province.value) ||
        !city.value || 
        !barangay.value ||
        !streetField.value ||
        !zipCodeField.value) {
      return false;
    }
    
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      // Add validation errors to empty fields
      if (!firstname.value) {
        setFirstName({
          ...firstname,
          touched: true,
          error: "First Name is required."
        });
      }
      
      if (!lastname.value) {
        setLastName({
          ...lastname, 
          touched: true,
          error: "Last Name is required."
        });
      }
      
      // Mark middle initial as touched (optional field)
      setMiddleInitial({...middleinitial, touched: true});
      
      // Check if we can proceed
      if (!firstname.value || !lastname.value || firstname.error || lastname.error || middleinitial.error) {
        return; // Don't proceed if there are errors
      }
      
      setCurrentStep(currentStep + 1);
    } 
    else if (currentStep === 2) {
      // Add validation errors to empty fields
      if (!dob.value) {
        setDob({
          ...dob,
          touched: true,
          error: "Date of birth is required."
        });
      }
      
      if (!gender.value) {
        setGender({
          ...gender,
          touched: true,
          error: "Gender is required."
        });
      }

      if (!nationality.value) {
        setNationality({
          ...nationality,
          touched: true,
          error: "Nationality is required."
        });
      }
      
      // Mark address fields as touched and add validation errors
      const updatedRegionField = {...regionField, touched: true};
      if (!region.value) {
        updatedRegionField.error = "Region is required.";
      }
      setRegionField(updatedRegionField);
      
      // Validate province
      const updatedProvinceField = {...provinceField, touched: true};
      if (!province.value) {
        updatedProvinceField.error = "Province is required.";
      }
      setProvinceField(updatedProvinceField);

      // Validate city
      const updatedCityField = {...cityField, touched: true};
      if (!city.value) {
        updatedCityField.error = "City is required.";
      }
      setCityField(updatedCityField);
      
      // Validate barangay
      const updatedBarangayField = {...barangayField, touched: true};
      if (!barangay.value) {
        updatedBarangayField.error = "Barangay is required.";
      }
      setBarangayField(updatedBarangayField);
      
      // Validate street address
      const updatedStreetField = {...streetField, touched: true};
      if (!streetField.value) {
        updatedStreetField.error = "Street address is required.";
      }
      setStreetField(updatedStreetField);
      
      // Validate ZIP code
      const updatedZipCodeField = {...zipCodeField, touched: true};
      if (!zipCodeField.value) {
        updatedZipCodeField.error = "ZIP code is required.";
      }
      setZipCodeField(updatedZipCodeField);
      
      // Check if we can proceed - add nationality to the check
      const hasErrors = !dob.value || !gender.value || !nationality.value || 
                       dob.error || gender.error || nationality.error ||
                       !region.value || !province.value || !city.value || !barangay.value ||
                       !streetField.value || !zipCodeField.value ||
                       regionField.error || provinceField.error || cityField.error || barangayField.error ||
                       streetField.error || zipCodeField.error;
      
      if (hasErrors) {
        return; // Don't proceed if there are errors
      }
      
      setCurrentStep(currentStep + 1);
    } 
    else if (currentStep === 3) {
      // Add validation errors to empty fields
      if (!email.value) {
        setEmail({
          ...email,
          touched: true,
          error: "Email is required."
        });
      }
      
      if (!contactNumber.value) {
        setContactNumber({
          ...contactNumber,
          touched: true,
          error: "Contact number is required."
        });
      }
      
      if (!password.value) {
        setPassword({
          ...password,
          touched: true,
          error: "Password is required."
        });
      }
      
      if (!confirmPassword.value) {
        setConfirmPassword({
          ...confirmPassword,
          touched: true,
          error: "Confirm password is required."
        });
      }
      
      // Check if we can proceed
      if (!email.value || !contactNumber.value || !password.value || !confirmPassword.value ||
          email.error || contactNumber.error || password.error || confirmPassword.error) {
        return; // Don't proceed if there are errors
      }
      
      registerUser(); // Only proceed to register if no errors
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

    const registerUser = async (e) => {
    if (e) e.preventDefault();
  
    // First, mark all fields as touched to trigger validation messages
    setFirstName({...firstname, touched: true});
    setLastName({...lastname, touched: true});
    setMiddleInitial({...middleinitial, touched: true});
    setEmail({...email, touched: true});
    setContactNumber({...contactNumber, touched: true});
    setPassword({...password, touched: true});
    setConfirmPassword({...confirmPassword, touched: true});
    setDob({...dob, touched: true});
    setGender({...gender, touched: true});
    setNationality({...nationality, touched: true});
    
    // Force re-validation of any empty required fields
    if (!firstname.value) {
      setFirstName({...firstname, error: "First Name is required."});
    }
    
    if (!lastname.value) {
      setLastName({...lastname, error: "Last Name is required."});
    }
    
    if (!email.value) {
      setEmail({...email, error: "Email is required."});
    }
    
    if (!contactNumber.value) {
      setContactNumber({...contactNumber, error: "Contact number is required."});
    }
    
    if (!password.value) {
      setPassword({...password, error: "Password is required."});
    }
    
    if (!confirmPassword.value) {
      setConfirmPassword({...confirmPassword, error: "Confirm password is required."});
    }
    
    if (!dob.value) {
      setDob({...dob, error: "Date of birth is required."});
    }
    
    if (!gender.value) {
      setGender({...gender, error: "Gender is required."});
    }
    
    if (!nationality.value) {
      setNationality({...nationality, error: "Nationality is required."});
    }
  
    // Check for validation errors after ensuring all fields have been validated
    setTimeout(() => {
      const hasErrors = 
        firstname.error !== null ||
        lastname.error !== null ||
        (middleinitial.value && middleinitial.error !== null) || // Only check if provided
        email.error !== null ||
        password.error !== null ||
        confirmPassword.error !== null ||
        gender.error !== null ||
        dob.error !== null ||
        nationality.error !== null;
        
      const missingRequired = 
        !firstname.value ||
        !lastname.value ||
        !email.value ||
        !password.value ||
        !confirmPassword.value ||
        !gender.value ||
        !dob.value ||
        !nationality.value;
  
      if (hasErrors || missingRequired) {
        Alert.alert('Please fix the errors in the form before continuing.');
        return;
      } else {
        // Store the validated data and show terms modal
        const patientUser = {
          patient_firstName: capitalizeWords(firstname.value),
          patient_middleInitial: middleinitial.value ? capitalizeWords(middleinitial.value) : '',
          patient_lastName: capitalizeWords(lastname.value),
          patient_email: email.value.trim().toLowerCase(),
          patient_password: password.value,
          patient_dob: dob.value,
          patient_contactNumber: contactNumber.value.trim(),
          patient_gender: gender.value,
          patient_civilstatus: civilStatus,
          patient_address: address,
          patient_nationality: nationality.value ? capitalizeWords(nationality.value.trim()) : '',
        };
        
        setValidatedData(patientUser);
        setTermsModalVisible(true);
      }
    }, 100); // Small delay to ensure state updates have processed
  };

  const handleAcceptTerms = async () => {
    setTermsModalVisible(false);
    
    try {
      const response = await axios.post(`${ip.address}/api/patient/api/signup`, validatedData);
      
      if (response.status === 201) {
        console.log(response.data);
        Alert.alert(
          "Registration Successful", 
          "Your account has been created successfully.",
          [{ text: "OK", onPress: () => navigation.navigate('SigninPage') }]
        );
      } else {
        console.error(response.data);
        Alert.alert('Registration failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('An error occurred during registration. Please try again.');
    }
  };

  const handleDeclineTerms = () => {
    setTermsModalVisible(false);
    // User stays on the form
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
              value={firstname.value}
              onChangeText={handleFirstNameChange}
              onBlur={handleFieldBlur(firstname, setFirstName, validateFirstName)}
              autoFocus
              clearButtonMode='always'
            />
            {firstname.touched && firstname.error && 
              <Text style={styles.errorText}>{firstname.error}</Text>
            }
          </View>

          {/* Middle Initial */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Middle Initial</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Middle Initial"
              placeholderTextColor={sd.colors.grey}
              value={middleinitial.value}
              onChangeText={handleMiddleInitialChange}
              onBlur={handleFieldBlur(middleinitial, setMiddleInitial, validateMiddleInitial)}
              clearButtonMode='always'
            />
            {middleinitial.touched && middleinitial.error && 
              <Text style={styles.errorText}>{middleinitial.error}</Text>
            }
          </View>

          {/* Last Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Last Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Last Name"
              placeholderTextColor={sd.colors.grey}
              value={lastname.value}
              onChangeText={handleLastNameChange}
              onBlur={handleFieldBlur(lastname, setLastName, validateLastName)}
              clearButtonMode='always'
            />
            {lastname.touched && lastname.error && 
              <Text style={styles.errorText}>{lastname.error}</Text>
            }
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
              <Text style={styles.inputLabel}>Date of Birth <Text style={styles.requiredIndicator}>*</Text></Text>
              <TouchableOpacity
                style={styles.textInput}
                onPress={() => setShowDatePicker(true)} // Show DateTimePicker
              >
                <Text>
                  {dob.value ? dob.value.toLocaleDateString() : 'Select Date of Birth'}
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
              <Text style={styles.inputLabel}>Gender <Text style={styles.requiredIndicator}>*</Text></Text>
              <View style = {styles.pickerContainer}>
                <Dropdown
                  placeholderStyle={styles.dropdownPlaceholder}
                  selectedTextStyle={styles.dropdownText}
                  containerStyle={styles.dropdownContainer}
                  data={[
                    { label: 'Male', value: 'Male' },
                    { label: 'Female', value: 'Female' },
                    { label: 'Other', value: 'Other' },
                  ]}
                  labelField="label"
                  valueField="value"
                  placeholderTextColor={sd.colors.grey}
                  placeholder="Select Gender"
                  value={gender.value}
                  onChange={handleGenderChange}
                  style={{ flex: 1, padding: 10 }}
                />
              </View>
              {gender.touched && gender.error && 
                <Text style={styles.errorText}>{gender.error}</Text>
              }
            </View>

            {/* Nationality - Add before Civil Status */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nationality <Text style={styles.requiredIndicator}>*</Text></Text>
              <TextInput
                style={styles.textInput}
                placeholder="Nationality"
                placeholderTextColor={sd.colors.grey}
                value={nationality.value}
                onChangeText={handleNationalityChange}
                onBlur={handleFieldBlur(nationality, setNationality, validateNationality)}
                clearButtonMode='always'
              />
              {nationality.touched && nationality.error && 
                <Text style={styles.errorText}>{nationality.error}</Text>
              }
            </View>

            {/* Civil Status */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Civil Status</Text>
              <View style={styles.pickerContainer}>
                <Dropdown
                  placeholderStyle={styles.dropdownPlaceholder}
                  selectedTextStyle={styles.dropdownText}
                  containerStyle={styles.dropdownContainer}
                  data={[
                    { label: 'Single', value: 'Single' },
                    { label: 'Married', value: 'Married' },
                    { label: 'Widowed', value: 'Widowed' },
                    { label: 'Separated', value: 'Separated' },
                    { label: 'Divorced', value: 'Divorced' },
                  ]}
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

            <Divider bold style = {{marginBottom: 30}}/>
              
            {/* Street Address - Moved to the first position */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Street Address <Text style={styles.requiredIndicator}>*</Text></Text>
              <TextInput
                style={styles.textInput}
                placeholder="House/Unit #, Building, Street"
                placeholderTextColor={sd.colors.grey}
                value={streetField.value}
                onChangeText={handleStreetChange}
                onBlur={handleFieldBlur(streetField, setStreetField, validateStreet)}
                clearButtonMode='always'
              />
              {streetField.touched && streetField.error && 
                <Text style={styles.errorText}>{streetField.error}</Text>
              }
            </View>

            {/* Region */}
            <View style={[styles.inputContainer, {marginTop : 10}]}>
              <Text style={styles.inputLabel}>Region <Text style={styles.requiredIndicator}>*</Text></Text>
              <View style={styles.pickerContainer} onBlur={handleRegionBlur}>
                <Dropdown
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
              {regionField.touched && regionField.error && 
                <Text style={styles.errorText}>{regionField.error}</Text>
              }
            </View>

            {/* Province - Only show if region is not NCR */}
            {region.value && !(region.label.includes('National Capital Region') || region.label === 'NCR') && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Province <Text style={styles.requiredIndicator}>*</Text></Text>
                <View style={styles.pickerContainer}>
                  <Dropdown
                    containerStyle={styles.dropdown}
                    data={provinceArr || []}
                    labelField="label"
                    valueField="value"
                    placeholderTextColor={!region.value ? theme.colors.onSurfaceDisabled : theme.colors.onSurfaceVariant}
                    placeholder="Select Province"
                    value={province}
                    onChange={handleProvinceChange}
                    style={{ 
                      flex: 1, 
                      padding: 10,
                      opacity: !region.value ? 0.5 : 1
                    }}
                    mode='modal'
                    search
                    searchPlaceholder='Search Province'
                    searchPlaceholderTextColor={theme.colors.onPrimaryContainer}
                    inputSearchStyle={{backgroundColor: theme.colors.primaryContainer}}
                    disable={!region.value || provinceArr.length === 0}
                  />
                </View>
                {provinceField.touched && provinceField.error && 
                  <Text style={styles.errorText}>{provinceField.error}</Text>
                }
              </View>
            )}

            {/* City/Municipality */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>City/Municipality <Text style={styles.requiredIndicator}>*</Text></Text>
              <View style={styles.pickerContainer}>
                <Dropdown
                  containerStyle={styles.dropdown}
                  data={cityArr ? cityArr.map((element) => ({ label: element.label, value: element.value })) : []}
                  labelField="label"
                  valueField="value"
                  placeholderTextColor={!region.value ? theme.colors.onSurfaceDisabled : theme.colors.onSurfaceVariant}
                  placeholder="Select City/Municipality"
                  value={city}
                  onChange={handleCityChange}
                  style={{ 
                    flex: 1, 
                    padding: 10,
                    opacity: !region.value ? 0.5 : 1
                  }}
                  mode='modal'
                  search
                  searchPlaceholder='Search City/Municipality'
                  searchPlaceholderTextColor={theme.colors.onPrimaryContainer}
                  inputSearchStyle={{backgroundColor: theme.colors.primaryContainer}}
                  disable={!region.value || cityArr.length === 0}
                />
              </View>
              {cityField.touched && cityField.error && 
                <Text style={styles.errorText}>{cityField.error}</Text>
              }
            </View>

            {/* Barangay - Updated with grayed out styling when disabled */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Barangay <Text style={styles.requiredIndicator}>*</Text></Text>
              <View style={[styles.pickerContainer, (!region.value || !city.value) && {opacity: 0.5}]}>
                <Dropdown
                  containerStyle={styles.dropdown}
                  data={barangayArr ? barangayArr.map((element) => ({ label: element.label, value: element.value })) : []}
                  labelField="label"
                  valueField="value"
                  placeholderTextColor={(!region.value || !city.value) ? theme.colors.onSurfaceDisabled : theme.colors.onSurfaceVariant}
                  placeholder="Select Barangay"
                  value={barangay}
                  onChange={handleBarangayChange}
                  style={{  
                    padding: 10,
                    opacity: (!region.value || !city.value) ? 0.5 : 1
                  }}
                  maxHeight={300}
                  mode='modal'
                  search
                  searchPlaceholder='Search Barangay'
                  searchPlaceholderTextColor={theme.colors.onPrimaryContainer}
                  inputSearchStyle={{backgroundColor: theme.colors.primaryContainer}}
                  disable={!region.value || !city.value || barangayArr.length === 0}
                />
              </View>
              {barangayField.touched && barangayField.error && 
                <Text style={styles.errorText}>{barangayField.error}</Text>
              }
            </View>

            {/* ZIP Code */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>ZIP Code <Text style={styles.requiredIndicator}>*</Text></Text>
              <TextInput
                style={styles.textInput}
                placeholder="4-digit ZIP Code"
                placeholderTextColor={sd.colors.grey}
                value={zipCodeField.value}
                onChangeText={handleZipCodeChange}
                onBlur={handleFieldBlur(zipCodeField, setZipCodeField, validateZipCode)}
                keyboardType="numeric"
                maxLength={4}
                clearButtonMode='always'
              />
              {zipCodeField.touched && zipCodeField.error && 
                <Text style={styles.errorText}>{zipCodeField.error}</Text>
              }
            </View>
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
              value={email.value}
              onChangeText={handleEmailChange}
              onBlur={handleFieldBlur(email, setEmail, validateEmail)}
              keyboardType="email-address"
            />
            {email.touched && email.error && 
              <Text style={styles.errorText}>{email.error}</Text>
            }
          </View>

          {/* Contact Number */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Contact Number</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Contact Number"
              placeholderTextColor={sd.colors.grey}
              value={contactNumber.value}
              onChangeText={handleContactNumberChange}
              onBlur={handleFieldBlur(contactNumber, setContactNumber, validateContactNumber)}
              keyboardType='phone-pad'
            />
            {contactNumber.touched && contactNumber.error && 
              <Text style={styles.errorText}>{contactNumber.error}</Text>
            }
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
                value={password.value}
                onChangeText={handlePasswordChange}
                onBlur={handleFieldBlur(password, setPassword, validatePassword)}
              />
              <TouchableOpacity onPress={handleTogglePasswordVisibility}>
                <FontAwesome5 name={showPassword ? 'eye-slash' : 'eye'} size={15} />
              </TouchableOpacity>
            </View>
            {password.touched && password.error && 
              <Text style={styles.errorText}>{password.error}</Text>
            }
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
                value={confirmPassword.value}
                onChangeText={handleConfirmPasswordChange}
                onBlur={handleFieldBlur(confirmPassword, setConfirmPassword, validateConfirmPassword)}
              />
              <TouchableOpacity onPress={handleTogglePasswordVisibility}>
                <FontAwesome5 name={showPassword ? 'eye-slash' : 'eye'} size={15} />
              </TouchableOpacity>
            </View>
            {confirmPassword.touched && confirmPassword.error && 
              <Text style={styles.errorText}>{confirmPassword.error}</Text>
            }
          </View>
        </View>
      )}
    </KeyboardAwareScrollView>
    
      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
          {/* Back Button - Always go to landing page when on Step 1 */}
          {currentStep === 1 ? (
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("landingpage")}>
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

      {/* Terms and Conditions Bottom Sheet Modal */}
      <TermsAndConditionsModal 
        isVisible={termsModalVisible}
        onAccept={handleAcceptTerms}
        onDecline={handleDeclineTerms}
        styles={styles} // Pass the styles
      />
    </SafeAreaView>
  ); 
};

export default CreateAccount;
