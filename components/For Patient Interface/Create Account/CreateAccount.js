import React, { useEffect, useState } from 'react';
import { View, Text, Platform, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import PickerSelect from 'react-native-picker-select';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';

const CreateAccount = ({ navigation }) => {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [middleinitial, setMiddleInitial] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [urole, setRole] = useState('');
  const [firstnameError, setfirstnameError] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [lastnameError, setlastnameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [existingEmail, setExistingEmail] = useState([]);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    axios.get('http://localhost:8000/patient/api/allemail')
    .then((res) => {
      console.log(res.data)
      setExistingEmail(res.data)
    })
    .catch((err) => {
      console.log(err.response);
    });
  },[])

  const checkIfEmailExists = (email) => {
    return existingEmail.includes(email);
  };

  const registerUser =(e) => {
    e.preventDefault();

    if (firstname.length == 0 || lastname.length == 0 || email.length == 0  || password.length == 0  ){
      alert('Please fill in all required fields.');
    }

    else if (checkIfEmailExists){
      alert('Email already exists.')
    }

    else if (password !== confirmPassword) {
      alert('Passwords do not match.');
    }

    else{
      if (
        firstnameError === '',
        lastnameError === '',
        emailError === '',
        passwordError === '',
        confirmPasswordError === ''
      ){
        if(urole === "Practitioner")
          {
              const doctorUser = {
                  dr_firstName: firstname,
                  dr_lastName: lastname,
                  dr_middleInitial: middleinitial,
                  dr_email: email,
                  dr_password: password,
                  // dr_dob: uBirth,
                  // dr_contactNumber: uNumber,
                  // dr_gender: uGender, 
              }
                  axios.post('http://localhost:8000/doctor/api/signup', doctorUser)
                  .then((response) => {
                      console.log(response);
                      window.alert("Successfully registered Doctor");
                      navigation.navigate('SigninPage');
          
                  })
                  .catch((err)=> {
                      console.log(err);
                  })
          }
          else if (urole === "Patient") {
              const patientUser = {
                  patient_firstName: firstname,
                  patient_middleInitial: middleinitial,
                  patient_lastName: lastname,
                  patient_email: email,
                  patient_password: password,
                  // patient_dob: uBirth,
                  // patient_contactNumber: uNumber,
                  // patient_gender: uGender,
              };
              console.log(patientUser)
              axios.post('http://localhost:8000/patient/api/signup', patientUser)
                  .then((response) => {
                      console.log(response);
                      window.alert("Successfully registered Patient");
                      navigation.navigate('SigninPage');
                  })
                  .catch((err) => {
                      console.log(err);
                  });
          }
      }
      else {
        window.alert('May error.')
      }
    }
    
}

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

    if (!text || text.length < 8) {
      setEmailError("Email must be at least 8 characters");
    }
    else if (!emailRegex.test(text)) {
      setEmailError("Email format invalid. Example of valid format: xyz@abc.com");
    }
    else {
      setEmailError("");
    }
    setEmail(text);
  };

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




  const handleSignUp = () => {
    // Validation logic here

    if (firstname.length == 0 || lastname.length == 0 || email.length == 0  || password.length == 0  ){
      alert('Please fill in all required fields.');
    }

    else if (password !== confirmPassword) {
      alert('Passwords do not match.');
    }
    else{
      registerUser();
      navigation.navigate('SigninPage');
    }
    
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



        <View style={styles.pickerContainer}>
            <PickerSelect
                  placeholder={{ label: 'Select Role', value: null }}
                  onValueChange={(value) => setRole(value)}
                  items={[
                  { label: 'Patient', value: 'Patient' },
                  { label: 'Practitioner', value: 'Practitioner' },

                ]}
                style={{
                  inputIOS: styles.pickerItem,
                  inputAndroid: styles.pickerItem,
                }}
                />
        </View>

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
            <Text style={styles.textButton}>SIGN IN</Text>
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