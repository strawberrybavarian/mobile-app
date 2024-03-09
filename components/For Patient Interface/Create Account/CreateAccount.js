import React, { useState } from 'react';
import { View, Text, Platform, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const CreateAccount = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('');

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUp = () => {
    // Validation logic here
    if (username === '' || email === '' || password === '' || confirmPassword === '') {
      alert('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    // Only navigate if validation passes
    navigation.navigate('SigninPage');
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
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={handleTogglePasswordVisibility} style={styles.eyeIconContainer}>
            <FontAwesome5 name={showPassword ? 'eye-slash' : 'eye'} size={15} />
          </TouchableOpacity>
        </View>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm Password"
            secureTextEntry={showPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={handleTogglePasswordVisibility} style={styles.eyeIconContainer}>
            <FontAwesome5 name={showPassword ? 'eye-slash' : 'eye'} size={15} />
          </TouchableOpacity>
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={role}
            onValueChange={(value) => setRole(value)}
            style={styles.picker}
          >
            <Picker.Item style={styles.pickerItem} label="Select your role" value="" />
            <Picker.Item style={styles.pickerItem} label="Doctor" value="Doctor" />
            <Picker.Item style={styles.pickerItem} label="Patient" value="Patient" />
          </Picker>
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
            onPress={handleSignUp}
          >
            <Text style={styles.textButton}>SIGN IN</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <View style={styles.logoContainer}>
        <Image source={require('../../../assets/pictures/Medisinapp Logo 1.png')} style={styles.logo} />
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
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#d9d9d9',
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
});

export default CreateAccount;