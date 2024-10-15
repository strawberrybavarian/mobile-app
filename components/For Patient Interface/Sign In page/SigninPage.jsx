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
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import axios from "axios";
import { getData, storeData } from "../../storageUtility";
import { ip } from "../../../ContentExport";
import { Dropdown } from "react-native-element-dropdown"; // Import Dropdown
import { CommonActions } from "@react-navigation/native";
import * as Validation from '../Create Account/Validations.js'

const SigninPage = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [roleError, setRoleError] = useState("");

  const seePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       let response;
  //       if (role === "Patient" ) {
  //         response = await axios.get(`${ip.address}/api/patient/api/allpatient`);
  //       } 
  //       else if (role === "Doctor") {
  //         response = await axios.get(`${ip.address}/api/doctor/api/alldoctor`);
  //       }

  //       if( response && response.data ){
  //         const userData = response.data.thePatient || response.data.theDoctor;
  //         setAllUsers(userData);
  //       }

  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   fetchData();
  // }, [role]);

  useEffect(() => {
    !email ? setEmailError("Email cannot be empty") : setEmailError("");
    !password ? setPasswordError("Password cannot be empty") : setPasswordError("");
    !role ? setRoleError("Please select a role") : setRoleError("");
  }, [email, password, role]);

  const loginUser = async (e) => {
    e.preventDefault();

    if (role === "Patient") {
      try {
        const response = await axios.post(`${ip.address}/api/patient/api/login`, {
          email,
          password,
        });

        if (response.data.patientData) {
          const patientData = response.data.patientData;

          // if (rememberMe) {
          //   localStorage.setItem('patient', JSON.stringify(patientData));
          // } else {
          //   sessionStorage.setItem('patient', JSON.stringify(patientData));
          // }

          setPatient(patientData); // Update context with patient data
          Alert.alert("Successfully logged in");

          // Navigate to homepage
          await axios.post(`${ip.address}/api/patient/session`, { userId: patientData._id, role: role });
          storeData('userId', patientData._id);
          navigation.navigate('ptnmain');
        } else {
          Alert.alert(response.data.message || "Invalid email or password. Please try again.");
        }
      } catch (err) {
        console.error('Error logging in:', err);
        Alert.alert("An error occurred while logging in.");
      }
    } else if (role === "Physician") {
      try {
        const response = await axios.post(`${ip.address}/api/doctor/api/login`, {
          email,
          password,
        });

        if (response.data.doctorData) {
          const doctorData = response.data.doctorData;

          // if (rememberMe) {
          //   localStorage.setItem('doctor', JSON.stringify(doctorData));
          // } else {
          //   sessionStorage.setItem('doctor', JSON.stringify(doctorData));
          // }

          setDoctor(doctorData);
          Alert.alert("Successfully logged in");

          await axios.post(`${ip.address}/api/doctor/session`, { userId: doctorData._id, role: role });
          navigation.navigate('doctormain');
        } else {
          Alert.alert(response.data.message || "Invalid email or password. Please try again.");
        }
      } catch (err) {
        console.error('Error logging in:', err);
        Alert.alert("An error occurred while logging in.");
      }
    }
  };    

  const validateEmail = (text) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimtext = text.trim(); // Remove leading and trailing whitespaces
    //const lowerCaseText = trimtext.toLowerCase(); // Convert the input to lowercase
  
    if (!trimtext) {
      setEmailError("Email cannot be empty");
    } else if (!emailRegex.test(trimtext)) {
      setEmailError("Email format invalid. Example of valid format: xyz@abc.com");
    } else {
      setEmailError("");
    }
    setEmail(trimtext); // Set the lowercase email
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -200}
    >
      <>
        <View style={{ flex: 1 }}>
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <FontAwesome5 name="chevron-left" size={15} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.con1} onPress={() => {navigation.navigate('landingpage')}}>
              <Text style={styles.title}>Create Account</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.textcon}>
            <Text style={styles.text1}>Sign In to Your</Text>
            <Text style={styles.text1}>Account</Text>
          </View>

          <View style={styles.con2}>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            {emailError && isErrorVisible ? (
              <Text style={styles.errorMessage}>{emailError}</Text>
            ) : null}

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                secureTextEntry={passwordVisible}
                value={password}
                onChangeText={setPassword}
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
            {passwordError && isErrorVisible ? (
              <Text style={styles.errorMessage}>{passwordError}</Text>
            ) : null}

            <View style={styles.pickerContainer}>
              <Dropdown
                style={styles.pickerItem}
                data={[
                  { label: "Patient", value: "Patient" },
                  { label: "Doctor", value: "Physician" },
                ]}
                labelField="label"
                valueField="value"
                placeholder="Select Role"
                value={role}
                onChange={(item) => setRole(item.value)}
              />
            </View>
            {roleError && isErrorVisible ? (
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
                onPress={loginUser}
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
    justifyContent: "space-evenly",
    // paddingHorizontal: 10,
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
    flex: 1,
    width: "100%",
    height: '100%',
    paddingHorizontal: 10,
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
