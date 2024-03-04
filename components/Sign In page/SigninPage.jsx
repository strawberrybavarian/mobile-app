import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput,
} from "react-native";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
const SigninPage = ({ navigation }) => {
  const [isPasswordVisible, setPasswordVisibility] = useState(true);

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!isPasswordVisible);
  };

  const doctorSpecialty = () => {
    navigation.navigate('doctorspecialty')
  }
  return (
    <>
      {/* Header */}
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
        <TextInput style={styles.input} placeholder="Email" />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry={isPasswordVisible}
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

        <LinearGradient
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 2 }}
          colors={["#92A3FD", "#9DCEFF"]}
          style={{
            width: "100%",
            height: 35,
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
    </>
  );
};
export default SigninPage;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    marginTop: 35,
  },
  con1: {
    
  },

  textcon:{
    paddingLeft: 10,
    marginTop: 20,
  },
  con2: {
    flexDirection: "column",
    marginTop: 25,
    paddingLeft: 10,
    paddingRight: 10,
  },
  con3: {
    alignItems: "center",
    flexDirection: "column",
  },
  text1: {

    fontSize: 35,
    fontFamily: 'Poppins-SemiBold',
    lineHeight: 45,
  },
  title: {
    fontSize: 12,

    color: "#92A3FD",
    fontFamily: 'Poppins-SemiBold',
    
  },

  input: {
    height: 40,
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#d9d9d9",
    marginVertical: 10,
    paddingLeft: 10,
    fontSize: 10,
    fontFamily: 'Poppins',
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#d9d9d9",
    marginVertical: 10,
    paddingLeft: 10,
   
  },
  passwordInput: {
    flex: 1,
    height: 40,
    fontSize: 10,
    fontFamily: 'Poppins'
  },
  eyeIconContainer: {
    padding: 10,
  },

  textButton: {
    color: "white",
    fontSize: 11,
    textAlign: "center",
    marginTop: 1,
    fontFamily: 'Poppins',
  },
  linkText:{
    textAlign: "center",
    marginTop:10,
    fontSize: 9,
    fontFamily: 'Poppins',
  },
});
