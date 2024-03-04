import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableWithoutFeedback,TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";
const CreateAccount = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword); 
  };

  const handleSignUp = () => {
    navigation.navigate('SigninPage');

    if (username === '' || email === '' || password === '' || confirmPassword === '') {
      alert('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
  };

  return (

    <>
    <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
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

    <SafeAreaView style={styles.container1}>
     
        <TextInput
          style={styles.textInput}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />

 
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
  

      <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry={showPassword}
            value={password} onChangeText={setPassword}
          />
          <View style={styles.eyeIconContainer}>
            <TouchableWithoutFeedback onPress={handleTogglePasswordVisibility}>
              <FontAwesome5
                name={showPassword ? "eye-slash" : "eye"}
                size={15}
              />
            </TouchableWithoutFeedback>
          </View>
      </View>

      <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm Password"
            secureTextEntry={showPassword}
            value={confirmPassword} onChangeText={setPassword}
          />
          <View style={styles.eyeIconContainer}>
            <TouchableWithoutFeedback onPress={handleTogglePasswordVisibility}>
              <FontAwesome5
                name={showPassword ? "eye-slash" : "eye"}
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
            height: 45,
            borderRadius: 40,
            marginTop: 10,  
          }}
        >
          <TouchableOpacity
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            onPress={handleSignUp}
          >
            <Text style={styles.textButton}>SIGN IN</Text>
          </TouchableOpacity>
        </LinearGradient>
    </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 15,

    color: "#92A3FD",
    fontFamily: 'Poppins-SemiBold',
    
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#d9d9d9",
    marginVertical: 10,
    paddingLeft: 10,
   
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 12,
    fontFamily: 'Poppins'
  },
  eyeIconContainer: {
    padding: 10,
  },
  textcon:{
    paddingLeft: 30,
    marginTop: 50,
  },
  textButton: {
    color: "white",
    fontSize: 15,
    textAlign: "center",
    marginTop: 1,
    fontFamily: 'Poppins',
  },
  text1: {

    fontSize: 45,
    fontFamily: 'Poppins-SemiBold',
    lineHeight: 55,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    marginTop: 55,
  },
  con2: {
    flexDirection: "column",
    marginTop: 25,
    paddingLeft: 10,
    paddingRight: 10,
  },
  container1: {
    flexDirection: "column",
    marginTop: 25,
    paddingLeft: 30,
    paddingRight: 30,
  },
  titleText: {
    fontSize: 45,

    marginBottom: 20,
    padding: 10,
    fontFamily: 'Poppins-SemiBold'
  },
  inputContainer: {
    marginBottom: 10,
    width:'100%',
  },
  textInput: {
    height: 50,
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#d9d9d9",
    marginVertical: 10,
    paddingLeft: 10,
    fontSize: 12,
    fontFamily: 'Poppins',
  },
  iconContainer: {
    position: 'absolute',
    right: 10,
    top: 15,
    
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 5,
    width:'90%',
    alignItems: 'center'
  },
});


export default CreateAccount;