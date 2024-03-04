import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from 'react-native-vector-icons';

const CreateAccount = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle visibility
  };

  const handleSignUp = () => {
    navigation.navigate('Doctors');

    // Validate form data (optional)
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
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleText}>Create Your Account</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity style={styles.iconContainer} onPress={handleTogglePasswordVisibility}>
          {showPassword ? (
            <MaterialCommunityIcons name="eye-off" size={24} color="black" />
          ) : (
            <MaterialCommunityIcons name="eye" size={24} color="black" />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity style={styles.iconContainer} onPress={handleTogglePasswordVisibility}>
          {showPassword ? (
            <MaterialCommunityIcons name="eye-off" size={24} color="black" />
          ) : (
            <MaterialCommunityIcons name="eye" size={24} color="black" />
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.buttonText} onPress={handleSignUp}>
        <Text>Create Account</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  titleText: {
    fontSize: 45,
    fontWeight: 'bold',
    marginBottom: 20,
    padding: 10,
  },
  inputContainer: {
    marginBottom: 10,
    width:'90%',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
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