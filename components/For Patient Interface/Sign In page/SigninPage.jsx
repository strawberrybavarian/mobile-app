import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  Keyboard,
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
import { useUser } from "../../../UserContext";

const SigninPage = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Patient");
  const [rememberMe, setRememberMe] = useState(false);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  
  const [passwordError, setPasswordError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const theme = useTheme();
  const styles = SignInStyles(theme);

  const dropdownRef = useRef(null)

  const validateEmail = (email) => {
    if (!email || email.trim() === '') {
      return "Email cannot be empty";
    }
    
    // Check for any whitespace
    if (/\s/.test(email)) {
      return "Email cannot contain spaces";
    }
    
    // Check email format
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      return "Please enter a valid email address";
    }
    
    return ""; // Valid email
  };

  useEffect(() => {
    setEmailError(validateEmail(email));
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
      
      // Handle two-factor authentication flow
      if (response.data.twoFactorRequired) {
        console.log("Two-factor authentication required");
        navigation.navigate("emailverification", { 
          userId: response.data.userId, 
          role: response.data.role,
          isTwoFactor: true // Important flag to identify 2FA
        });
        return;
      }

      // Handle email verification flow
      if (response.data.emailVerificationRequired) {
        console.log("Email verification required");
        navigation.navigate("emailverification", { 
          userId: response.data.userId, 
          role: response.data.role,
          email: normalizedEmail, // Pass email for display purposes
          isTwoFactor: false // Explicitly mark as not 2FA
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
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} // Adjust offset for iOS/Android
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
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
                onPress={() => navigation.navigate("createaccount")}
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
                  onChangeText={(text) => {
                    // Remove whitespace automatically as user types
                    const noWhitespaceText = text.replace(/\s/g, '');
                    setEmail(noWhitespaceText);
                  }}
                  onBlur={() => setEmailTouched(true)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoCompleteType="email"
                  textContentType="emailAddress"
                  blurOnSubmit={false}
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
              </View>
              {emailError && (isErrorVisible || emailTouched) && (
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

              <View style={{width: '100%', marginVertical: 10}}>
                <TouchableOpacity 
                  activeOpacity={0.7}
                  style={[
                    styles.inputContainer,
                    {height: 50, paddingHorizontal: 10},
                    role && {borderColor: theme.colors.primary, borderWidth: 1}
                  ]}
                  onPress={() => {
                    Keyboard.dismiss();
                    // Use a timeout to ensure keyboard is dismissed before dropdown opens
                    setTimeout(() => {
                      if (dropdownRef.current) {
                        dropdownRef.current.open();
                      }
                    }, 100);
                  }}
                >
                  <Text 
                    style={[
                      styles.inputField, 
                      {
                        color: role ? theme.colors.onSurface : theme.colors.onSurfaceVariant
                      }
                    ]}
                  >
                    {role || "Select Role"}
                  </Text>
                  <View style={styles.iconContainer}>
                    <FontAwesome5 
                      name="chevron-down" 
                      size={15} 
                      color={theme.colors.onSurfaceVariant}
                    />
                  </View>
                </TouchableOpacity>
                
                {roleError && isErrorVisible && (
                  <Text style={styles.errorMessage}>{roleError}</Text>
                )}
                
                <Dropdown
                  ref={dropdownRef}
                  style={[styles.dropdown, {position: 'absolute', opacity: 0, height: 0}]}
                  data={[
                    { label: "Patient", value: "Patient" },
                    { label: "Doctor", value: "Doctor" },
                  ]}
                  labelField="label"
                  valueField="value"
                  value={role}
                  onChange={(item) => {
                    setRole(item.value);
                    Keyboard.dismiss();
                  }}
                  itemTextStyle={{fontFamily: sd.fonts.regular, fontSize: sd.fontSizes.medium}}
                />
              </View>
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

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordPage')}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default SigninPage;