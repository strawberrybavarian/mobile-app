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
  Keyboard,  // Import Keyboard API
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
import { useUser } from "@/UserContext";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    // Validate inputs
    if (!email || !password || !role) {
      setIsErrorVisible(true);
      return;
    }
    
    // Show loading state
    setIsSubmitting(true);
    
    // Convert email to lowercase
    const normalizedEmail = email.toLowerCase();
  
    try {
      console.log(`Attempting login for ${normalizedEmail} with role ${role}`);
      
      const response = await axios.post(
        `${ip.address}/api/login`, 
        {
          email: normalizedEmail,
          password,
          role,
          rememberMe,
        },
        { withCredentials: true, timeout: 15000 } // Add timeout
      );
      
      console.log("Server response:", response.status);
      
      // Handle email verification flow
      if (response.data.emailVerificationRequired) {
        console.log("Email verification required");
        navigation.navigate("emailverification", { 
          userId: response.data.userId, 
          role: response.data.role,
          email: normalizedEmail // Pass email for display purposes
        });
        return;
      }
      
      // Handle two-factor authentication flow
      if (response.data.twoFactorRequired) {
        console.log("Two-factor authentication required");
        navigation.navigate("emailverification", { 
          userId: response.data.userId, 
          role: response.data.role,
          isTwoFactor: true
        });
        return;
      }
      
      // Handle normal login with token
      if (response.data.token) {
        try {
          const { user, role, token } = response.data;
          console.log(`Login successful for ${role}: ${user._id}`);
          
          // Store authentication data
          await Promise.all([
            storeData("authToken", token),
            storeData("userId", user._id),
            storeData("userRole", role)
          ]);

          await storeData("userEmail", email);
await storeData("userPassword", password);
          
          // Update authentication context
          const loginSuccess = await login(user, role, token);
          
          if (!loginSuccess) {
            throw new Error("Failed to update authentication context");
          }
          
          console.log("Authentication context updated successfully");
          
          // Navigate based on role
          switch(role) {
            case 'Patient':
              navigation.reset({
                index: 0,
                routes: [{ name: 'home' }]
              });
              break;
            case 'Doctor':
              navigation.reset({
                index: 0,
                routes: [{ name: 'doctormain' }]
              });
              break;
            default:
              console.warn(`Unhandled role: ${role}`);
              Alert.alert("Warning", "Unsupported user role detected");
          }
        } catch (storageError) {
          console.error("Failed to save authentication data:", storageError);
          Alert.alert(
            "Login Error", 
            "Your login was successful, but we couldn't save your session. Please try again."
          );
        }
      } else {
        // Missing token in response
        console.error("Invalid server response - missing token:", response.data);
        Alert.alert(
          "Authentication Error", 
          "The server response was incomplete. Please try again or contact support."
        );
      }
    } catch (err) {
      // Network or server error handling
      console.error("Login failed:", err.message);
      
      if (err.response) {
        // Server returned an error response
        const { status, data } = err.response;
        console.error(`Server error ${status}:`, data);
        
        switch (status) {
          case 400:
            Alert.alert("Invalid Request", "Please verify your information and try again.");
            break;
          case 401:
            Alert.alert("Authentication Failed", "The email or password is incorrect.");
            break;
          case 403:
            if (data?.message?.includes("review")) {
              Alert.alert(
                "Account Under Review", 
                "Your account is awaiting approval. Please check back later."
              );
            } else {
              Alert.alert("Access Denied", "You don't have permission to access this account.");
            }
            break;
          case 404:
            Alert.alert(
              "Account Not Found", 
              `We couldn't find a ${role.toLowerCase()} account with that email.`
            );
            break;
          case 429:
            Alert.alert(
              "Too Many Attempts", 
              "Please wait a moment before trying again."
            );
            break;
          case 500:
            Alert.alert(
              "Server Error", 
              "We're experiencing technical difficulties. Please try again later."
            );
            break;
          default:
            Alert.alert(
              "Login Failed", 
              "An unexpected error occurred. Please try again."
            );
        }
      } else if (err.request) {
        // No response received from server
        console.error("No response received:", err.request);
        Alert.alert(
          "Connection Error", 
          "We couldn't reach our servers. Please check your internet connection and try again."
        );
      } else {
        // Error setting up request
        console.error("Request setup error:", err.message);
        Alert.alert(
          "Login Error", 
          "An error occurred while attempting to log in. Please try again."
        );
      }
    } finally {
      // Always reset loading state
      setIsSubmitting(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -200}
      >
        <View style={styles.mainContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate("landingpage")}
            >
              <FontAwesome5 name="chevron-left" size={15} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerTitleContainer}
              onPress={() => navigation.navigate("landingpage")}
            >
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
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoCompleteType="email"
                textContentType="emailAddress"
                blurOnSubmit={false}
                onSubmitEditing={() => Keyboard.dismiss()}
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
                autoCapitalize="none"
                autoCorrect={false}
                autoCompleteType="password"
                textContentType="password"
                blurOnSubmit={true}
                onSubmitEditing={() => Keyboard.dismiss()}
              />

              <View style={styles.iconContainer}>
                <TouchableWithoutFeedback onPress={togglePasswordVisibility}>
                  <FontAwesome5
                    name={passwordVisible ? "eye-slash" : "eye"}
                    size={15}
                    color={theme.colors.onSurfaceVariant}
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
                fontFamily={sd.fonts.light}
                placeholderStyle={{
                  color: theme.colors.onSurfaceVariant,
                  fontSize: sd.fontSizes.medium,
                }}
                value={role}
                onChange={(item) => {
                  setRole(item.value);
                  Keyboard.dismiss();
                }}
              />
            </View>
            {roleError && isErrorVisible && (
              <Text style={styles.errorMessage}>{roleError}</Text>
            )}
          </View>

          <View style={styles.signInButtonContainer}>
            <TouchableOpacity 
              style={[styles.signInButton, isSubmitting && styles.disabledButton]} 
              onPress={(e) => {
                Keyboard.dismiss();
                loginUser(e);
              }}
              disabled={isSubmitting}
            >
              <Text style={styles.signInText}>
                {isSubmitting ? "SIGNING IN..." : "SIGN IN"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default SigninPage;