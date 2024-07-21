import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import PickerSelect from 'react-native-picker-select';
import axios from "axios";
import { FIREBASE_AUTH } from "../../../FirebaseConfig";

const SigninPage = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  //arrays
  const [allUsers, setAllUsers] = useState([]);
  const [allPass, setAllPass] = useState([]);
  const [allEmail, setAllEmail] = useState([]);

  //errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [roleError, setRoleError] = useState("");

  
  const seePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  useEffect(()=>{
    const fetchData = async () => {
      try {
        let response;
        if (role === "Patient") {
          response = await axios.get('http://localhost:8000/patient/api/allpatient')
        }
        else if (role === 'Doctor') {
          response = await axios.get('http://localhost:8000/doctor/api/alldoctor')
        }

        if (role === 'Patient' && response && response.data) {
          const userData = response.data.thePatient;
          setAllUsers(userData);

          const emails = userData.map(user => user.patient_email)
          setAllEmail(emails);

          const passwords = userData.map(user => user.patient_password);
          setAllPass(passwords);
          
        }
        else if (role === 'Doctor' && response && response.data){
          const userData = response.data.theDoctor;
          setAllUsers(userData);

          const emails = userData.map(user => user.dr_email)
          setAllEmail(emails);

          const passwords = userData.map(user => user.dr_password);
          setAllPass(passwords);
        }
      }
      catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [email, role])

  //login
  const loginUser = (e) => {
    e.preventDefault();

    if (email.length <= 8 && password.length <= 8) {
      Alert.alert("Validation Error", "Please check the input fields", [
        { text: "OK" },
      ])
    } 
    else {
      const emailIndex = allEmail.indexOf(email);
      if (emailIndex !== -1 && password === allPass[emailIndex]) {
          const user = allUsers[emailIndex];

          if(role === 'Patient'){
              window.alert("Successfully logged in");
              console.log(user._id);
              navigation.navigate(`doctorspecialty`);
          }
          else if (role === 'Doctor'){
              window.alert("Successfully logged in");
              console.log(user._id);
              navigation.navigate(`doctormain`);
          }
        
      } else {
          window.alert("Wrong Email or Password");
      }
    }
    
};

  //For Realtime Validations
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

  const validateRole = (value) => {
    if (!value) {
      setRoleError("Please select a role");
    } else {
      setRoleError("");
    }
    setRole(value);
  };

  const doctorSpecialty = () => {

      console.log(email,password,role)


      if (role === "Patient" && email.length >= 8 && password.length >= 8) {
        navigation.navigate("doctorspecialty");
      } 
      else if (role === "Doctor" && email.length >= 8 && password.length >= 8) {
        navigation.navigate("doctormain");
      }
      else {
      Alert.alert("Validation Error", "Please check the input fields", [
        { text: "OK" },
      ]);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -200}
    >
      <>
        {/* Header */}
        <View style={{ flex: 1 }}>
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <FontAwesome5 name="chevron-left" size={15} />
            </TouchableOpacity>
            <View style={styles.con1}>
              <Text style={styles.title}>Create Account</Text>
            </View>
          </View>

          <View style={styles.textcon}>
            <Text style={styles.text1}>Sign In to Your</Text>
            <Text style={styles.text1}>Account</Text>
          </View>

          {/* Email Text Input */}
          <View style={styles.con2}>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Email"
                value={email}
                onChangeText={validateEmail}
              />
            </View>
            {emailError ? (
                <Text style={styles.errorMessage}>{emailError}</Text>
            ) : null}


           {/* Password Text Input */}
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                secureTextEntry={passwordVisible}
                value={password}
                onChangeText={validatePassword}
              />
             
              <View style={styles.eyeIconContainer}>
                <TouchableWithoutFeedback onPress={seePassword}>
                  <FontAwesome5
                    name={passwordVisible ? "eye-slash" : "eye"}
                    size={15}
                  />
                </TouchableWithoutFeedback>
              </View>
            </View>
            {passwordError ? (
                <Text style={styles.errorMessage}>{passwordError}</Text>
              ) : null}

            {/* Role Picker */}
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
            <LinearGradient
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 2 }}
              colors={["#92A3FD", "#9DCEFF"]}
              style={{
                width: "100%",
                height: 45,
                borderRadius: 40,
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                onPress={(e)=>{loginUser(e)}}
              >
                <Text style={styles.textButton}>SIGN IN</Text>
              </TouchableOpacity>
            </LinearGradient>

            <TouchableWithoutFeedback style={{}}>
              <Text style={styles.linkText}>Forgot the Password?</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    marginTop: 55,
  },
  con1: {},
  textcon: {
    paddingLeft: 30,
    marginTop: 50,
  },
  con2: {
    flexDirection: "column",
    marginTop: 25,
    paddingLeft: 30,
    paddingRight: 30,
  },
  text1: {
    fontSize: 45,
    fontFamily: "Poppins-SemiBold",
    lineHeight: 55,
  },
  title: {
    fontSize: 15,
    color: "#92A3FD",
    fontFamily: "Poppins-SemiBold",
  },
  inputContainer: {
    height: 50,
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#d9d9d9",
    marginVertical: 50,
    paddingLeft: 0,
    fontSize: 13,
    fontFamily: "Poppins",
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
    fontFamily: "Poppins",
    right: 4,
    bottom: 2,
    marginLeft: 10,
  },
  pickerItem: {
    fontFamily: "Poppins",
    fontSize: 15,
    paddingLeft: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#d9d9d9",
    marginVertical: 10,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 14,
    fontFamily: "Poppins",
    paddingLeft: 10,
    top: 2,
  },
  eyeIconContainer: {
    padding: 10,
  },
  textButton: {
    color: "white",
    fontSize: 15,
    textAlign: "center",
    marginTop: 1,
    fontFamily: "Poppins",
  },
  linkText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 12,
    fontFamily: "Poppins",
  },
  logo: {
    width: 150,
    height: 100,
  },
  logoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
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

export default SigninPage;
