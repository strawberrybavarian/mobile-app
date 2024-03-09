import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { Picker } from '@react-native-picker/picker';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

const SigninPage = ({ navigation }) => {
  const [isPasswordVisible, setPasswordVisibility] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!isPasswordVisible);
  };

  const doctorSpecialty = () => {
    if ((email === '' || password === '') && role === 'Patient') {
      Alert.alert('Please fill in all fields.');
    } else if ((email === '' || password === '') && role === 'Doctor') {
      Alert.alert('Please fill in all fields.');
    } else {
      if (role === 'Patient') {
        navigation.navigate('doctorspecialty');
      } else if (role === 'Doctor') {
        navigation.navigate('doctorappointment');
      }
    }
  };
  


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -200} // Adjust this value based on your UI
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

          <View style={styles.con2}>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                secureTextEntry={isPasswordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <View style={styles.eyeIconContainer}>
                <TouchableWithoutFeedback onPress={togglePasswordVisibility}>
                  <FontAwesome5
                    name={isPasswordVisible ? "eye-slash" : "eye"}
                    size={15}
                  />
                </TouchableWithoutFeedback>
              </View>
            </View>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={role}
                onValueChange={(value) => setRole(value)}
                style={styles.picker}
              >
                <Picker.Item
                  style={styles.pickerItem}
                  label="Select your role"
                  value=""
                />
                <Picker.Item
                  style={styles.pickerItem}
                  label="Doctor"
                  value="Doctor"
                />
                <Picker.Item
                  style={styles.pickerItem}
                  label="Patient"
                  value="Patient"
                />
              </Picker>
            </View>

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
                onPress={doctorSpecialty}
              >
                <Text style={styles.textButton}>SIGN IN</Text>
              </TouchableOpacity>
            </LinearGradient>

            <TouchableWithoutFeedback style={{}}>
              <Text style={styles.linkText}>Forgot the Password?</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
   

      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/pictures/Medisinapp Logo 1.png')}
          style={styles.logo}
        />
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
    fontFamily: 'Poppins-SemiBold',
    lineHeight: 55,
  },
  title: {
    fontSize: 15,
    color: "#92A3FD",
    fontFamily: 'Poppins-SemiBold',
  },
  inputContainer: {
    height: 50,
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#d9d9d9",
    marginVertical: 10,
    paddingLeft: 10,
    fontSize: 13,
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
    fontFamily: 'Poppins',
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
    fontFamily: 'Poppins',
    fontSize: 15,
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
    fontFamily: 'Poppins',
    left: 10,
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
    fontFamily: 'Poppins',
  },
  linkText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 12,
    fontFamily: 'Poppins',
  },
  logo: {
    width: 150,
    height: 100,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position:'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  
  },
});

export default SigninPage;
