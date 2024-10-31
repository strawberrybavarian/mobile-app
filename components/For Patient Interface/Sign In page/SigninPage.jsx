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
import { Dropdown } from "react-native-element-dropdown";
import { SignInStyles } from "./SignInStyles";
import { useTheme } from "react-native-paper";
import sd from "../../../utils/styleDictionary";
//import * as Validation from '../CreateAccount/Validations.js'


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

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const theme = useTheme();
  const styles = SignInStyles(theme);

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
          Alert.alert("Successfully logged in");

          storeData('userId', patientData._id);
          navigation.navigate('ptnmain');
        } else {
          Alert.alert("Invalid email or password. Please try again.");
        }
      } catch (err) {
        Alert.alert("An error occurred while logging in.");
      }
    } else if (role === "Doctor") {
      try {
        const response = await axios.post(`${ip.address}/api/doctor/api/login`, {
          email,
          password,
        });

        if (response.data.doctorData) {
          const doctorData = response.data.doctorData;
          Alert.alert("Successfully logged in");
          storeData('userId', doctorData._id);
          navigation.navigate('doctormain');
        } else {
          Alert.alert("Invalid email or password. Please try again.");
        }
      } catch (err) {
        Alert.alert("Error logging in.");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -200}
    >
      <>
        <View style={styles.mainContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate('landingpage')}
            >
              <FontAwesome5 name="chevron-left" size={15} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerTitleContainer} onPress={() => navigation.navigate('landingpage')}>
              <Text style={styles.headerTitle}>Sign up instead</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>Sign In to Your</Text>
            <Text style={styles.title}>Account</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputField}
                placeholder="Email"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                value={email}
                onChangeText={setEmail}
              />
            </View>
            {emailError && isErrorVisible && (
              <Text style={styles.errorMessage}>{emailError}</Text>
            )}

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputField}
                placeholder="Password"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                secureTextEntry={passwordVisible}
                value={password}
                onChangeText={setPassword}
              />

              <View style={styles.iconContainer}>
                <TouchableWithoutFeedback onPress={togglePasswordVisibility}>
                  <FontAwesome5
                    name={passwordVisible ? "eye-slash" : "eye"}
                    size={15}
                    color = {theme.colors.onSurfaceVariant}
                  />
                </TouchableWithoutFeedback>
              </View>
            </View>
            {passwordError && isErrorVisible && (
              <Text style={styles.errorMessage}>{passwordError}</Text>
            )}

            <View style={styles.dropdownContainer}>
              <Dropdown
                style={styles.dropdown}
                data={[
                  { label: "Patient", value: "Patient" },
                  { label: "Doctor", value: "Doctor" },
                ]}
                labelField="label"
                valueField="value"
                placeholder="Select Role"
                fontFamily= {sd.fonts.light}
                placeholderStyle = {{color: theme.colors.onSurfaceVariant, fontSize: sd.fontSizes.medium}}
                value={role}
                onChange={(item) => setRole(item.value)}
              />
            </View>
            {roleError && isErrorVisible && (
              <Text style={styles.errorMessage}>{roleError}</Text>
            )}

            
          </View>

          <View
              style={styles.signInButtonContainer}
            >
              <TouchableOpacity
                style={styles.signInButton}
                onPress={loginUser}
              >
                <Text style={styles.signInText}>SIGN IN</Text>
              </TouchableOpacity>
            </View>

            <TouchableWithoutFeedback>
              <Text style={styles.forgotPasswordText}>Forgot the Password?</Text>
            </TouchableWithoutFeedback>
        </View>
      </>
    </KeyboardAvoidingView>
  );
};

export default SigninPage;
