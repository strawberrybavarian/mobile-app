import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Dialog, Portal, Button, useTheme } from 'react-native-paper';
import { ip } from '@/ContentExport';
import { useUser } from '@/UserContext';
import { storeData } from '@/components/storageUtility';
import sd from "@/utils/styleDictionary";

const EmailVerificationPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId, role } = route.params || {};
  const { login } = useUser();
  const theme = useTheme();

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [attempts, setAttempts] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create refs for each input
  const inputRefs = useRef([]);
  // Initialize with 6 refs
  useEffect(() => {
    inputRefs.current = Array(6).fill().map((_, i) => inputRefs.current[i] || React.createRef());
  }, []);

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
    
    // If value is empty and the previous value wasn't, it means backspace was pressed
    if (!value && code[index] && index > 0) {
      newCode[index] = '';
      setCode(newCode);
      // Focus on previous input
      inputRefs.current[index - 1].focus();
      return;
    }
    
    newCode[index] = value;
    setCode(newCode);

    // Auto advance to next input if a digit was entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Check if the pressed key is Backspace
    if (e.nativeEvent.key === 'Backspace') {
      // If current input is empty and not the first input, move to previous input AND clear it
      if (!code[index] && index > 0) {
        // Create a new code array
        const newCode = [...code];
        // Clear the previous input
        newCode[index - 1] = '';
        // Update the state
        setCode(newCode);
        // Focus on previous input
        inputRefs.current[index - 1].focus();
      }
      // If there's text in current field, let default behavior happen
      // handleChange will catch the deletion in the next render
    }
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
            if (role === 'Patient') {
              navigation.reset({
                index: 0,
                routes: [{ name: 'ptnmain' }],
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
        
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <View 
              key={index} 
              style={[
                styles.digitContainer,
                { backgroundColor: theme.colors.surfaceVariant }
              ]}
            >
              <TextInput
                ref={el => inputRefs.current[index] = el}
                style={[
                  styles.codeInput,
                  { color: theme.colors.onSurface, fontFamily: sd.fonts.light }
                ]}
                maxLength={1}
                value={digit}
                onChangeText={(value) => handleChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="numeric"
                autoFocus={index === 0}
              />
            </View>
          ))}
        </View>
        
        <TouchableOpacity 
          style={[
            styles.submitButton,
            { backgroundColor: theme.colors.primary }
          ]} 
          onPress={handleSubmit} 
          disabled={isSubmitting}
        >
          <Text style={[
            styles.submitButtonText,
            { color: theme.colors.onPrimary, fontFamily: sd.fonts.medium }
          ]}>
            {isSubmitting ? 'Verifying...' : 'Verify Code'}
          </Text>
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
    fontSize: 30,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 10,
    color: '#333',
  },
  subheading: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    fontFamily: 'Poppins-Light',
    textAlign: 'center',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  digitContainer: {
    width: 45,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  codeInput: {
    width: '100%',
    height: '100%',
    fontSize: 20,
    textAlign: 'center',
  },
  submitButton: {
    padding: 10,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    height: 50,
  },
  submitButtonText: {
    fontSize: 14,
    fontFamily: sd.fonts.bold,
  },
});

export default EmailVerificationPage;
