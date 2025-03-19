import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Dialog, Portal, Button } from 'react-native-paper';
import { ip } from '@/ContentExport';
import { useUser } from '@/UserContext';
import { storeData } from '@/components/storageUtility';

const EmailVerificationPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId, role } = route.params || {};
  const { login } = useUser();

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [attempts, setAttempts] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [visible, setVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogAction, setDialogAction] = useState(null);

  const showDialog = (title, message, action = null) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogAction(action);
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
  };

  const handleChange = (value, index) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
  };

  const handleSubmit = async () => {
    const enteredCode = code.join('');
    if (enteredCode.length !== 6) {
      showDialog('Invalid Code', 'Please enter a 6-digit code.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Log what we're sending
      console.log("Sending verification data:", {
        userId,
        role,
        otp: enteredCode
      });
      
      const response = await axios.post(`${ip.address}/api/verify-email-otp`, {
        userId: userId,
        role: role,
        otp: enteredCode,
      });

      // Inside handleSubmit of EmailVerificationPage
      if (response.data.verified) {
        console.log("Email verification successful");
        const { user, role, token } = response.data;
        
        try {
          // Store auth data directly first for redundancy
          await storeData("authToken", token);
          await storeData("userId", user._id);
          await storeData("userRole", role);
          
          // Then update the context
          const loginSuccess = await login(user, role, token);
          
          if (loginSuccess) {
            console.log("Login successful after verification");
            
            // Use reset instead of navigate to clear the navigation stack
            // Update the patient navigation target:

          if (role === 'Patient') {
            navigation.reset({
              index: 0,
              routes: [{ name: 'ptnmain' }], // Change from 'ptnmain' to 'home'
            });
          } else if (role === 'Doctor') {
            navigation.reset({
              index: 0,
              routes: [{ name: 'doctormain' }],
            });
          }
          } else {
            console.error("Failed to login after verification");
            showDialog('Error', 'Failed to complete login after verification');
          }
        } catch (storageError) {
          console.error("Storage error:", storageError);
          showDialog('Error', 'Failed to save your session. Please try signing in again.');
        }
      } else {
        setAttempts(attempts + 1);
        if (attempts + 1 >= 3) {
          await axios.post(`${ip.address}/api/logout`);
          showDialog('3 Failed Attempts', 'Your session has been destroyed. Please log in again.', () => navigation.navigate('SigninPage'));
        } else {
          showDialog('Invalid Code', 'The code you entered is incorrect. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      
      // Add more detailed error logging
      if (error.response) {
        console.error('Error details:', error.response.status, error.response.data);
        showDialog('Verification Failed', error.response.data.message || 'Invalid or expired code. Please try again.');
      } else {
        showDialog('Error', 'A network error occurred during verification.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Enter OTP Code</Text>
        <Text style={styles.subheading}>Please enter the 6-digit code sent to your email.</Text>
        <View style={styles.inputContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.codeInput}
              maxLength={1}
              value={digit}
              onChangeText={(value) => handleChange(value, index)}
              keyboardType="numeric"
            />
          ))}
        </View>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isSubmitting}>
          <Text style={styles.submitButtonText}>{isSubmitting ? 'Verifying...' : 'Verify Code'}</Text>
        </TouchableOpacity>
      </View>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>{dialogTitle}</Dialog.Title>
          <Dialog.Content>
            <Text>{dialogMessage}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => {
              hideDialog();
              if (dialogAction) dialogAction();
            }}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  codeInput: {
    width: 40,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    textAlign: 'center',
    marginHorizontal: 5,
  },
  submitButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EmailVerificationPage;
