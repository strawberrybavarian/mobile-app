import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Dialog, Portal, Button, useTheme } from 'react-native-paper';
import { ip } from '../../../ContentExport';
import { useUser } from '../../../UserContext';
import { storeData } from '../../storageUtility';
import sd from '../../../utils/styleDictionary';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const EmailVerificationPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId, role, email, isTwoFactor } = route.params || {};
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
      
      // Select the correct endpoint based on verification type
      const endpoint = isTwoFactor 
        ? `${ip.address}/api/verify-2fa` 
        : `${ip.address}/api/verify-email-otp`;
      
      // FIXED: Add role to the 2FA payload as well
      const payload = isTwoFactor 
        ? { userId, role, code: enteredCode } // Include role here
        : { userId, role, otp: enteredCode };
      
      console.log(`Sending ${isTwoFactor ? '2FA' : 'OTP'} verification to ${endpoint}:`, payload);
      
      const response = await axios.post(endpoint, payload);
      console.log("Verification response:", response.data);
      
      if (response.data.verified) {
        console.log(`${isTwoFactor ? '2FA' : 'Email'} verification successful`);
        const { user, role, token } = response.data;
        
        try {
          // Store auth data
          await storeData("authToken", token);
          await storeData("userId", user._id);
          await storeData("userRole", role);
          
          // Update login context
          const loginSuccess = await login(user, role, token);
          
          if (loginSuccess) {
            // Navigate based on role
            navigation.reset({
              index: 0,
              routes: [{ name: role === 'Patient' ? 'ptnmain' : 'doctormain' }],
            });
          } else {
            showDialog('Error', 'Failed to complete login after verification.');
          }
        } catch (error) {
          console.error("Error in login process:", error);
          showDialog('Error', 'Failed to save your session. Please try signing in again.');
        }
      } else {
        setAttempts(attempts + 1);
        if (attempts + 1 >= 3) {
          await axios.post(`${ip.address}/api/logout`);
          showDialog('Too Many Attempts', 'Your session has been destroyed. Please log in again.', 
            () => navigation.navigate('SigninPage'));
        } else {
          showDialog('Invalid Code', `The ${isTwoFactor ? 'authentication' : 'verification'} code you entered is incorrect. Please try again.`);
        }
      }
    } catch (error) {
      console.error(`Error during ${isTwoFactor ? '2FA' : 'OTP'} verification:`, error);
      
      if (error.response) {
        console.error('Error details:', error.response.status, error.response.data);
        showDialog('Verification Failed', 
          error.response.data.message || 
          `Invalid or expired ${isTwoFactor ? 'authentication' : 'verification'} code. Please try again.`);
      } else {
        showDialog('Error', 'A network error occurred. Please check your connection and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome5 name="arrow-left" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isTwoFactor ? 'Two-Factor Authentication' : 'Email Verification'}
        </Text>
        <View style={{width: 40}} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>
          {isTwoFactor ? 'Enter Authentication Code' : 'Enter OTP Code'}
        </Text>
        <Text style={styles.subheading}>
          {isTwoFactor 
            ? 'Please enter the 6-digit code from your authenticator app.'
            : 'Please enter the 6-digit code sent to your email.'}
        </Text>
        
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
          {isSubmitting ? (
            <ActivityIndicator color={theme.colors.onPrimary} size="small" />
          ) : (
            <Text style={[
              styles.submitButtonText,
              { color: theme.colors.onPrimary, fontFamily: sd.fonts.medium }
            ]}>
              {isTwoFactor ? 'Verify Authentication' : 'Verify Code'}
            </Text>
          )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginTop: 40, // Account for status bar
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: sd.fonts.medium,
    color: '#333',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 90,
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
    justifyContent: 'center',
    marginTop: 20,
    height: 50,
  },
  submitButtonText: {
    fontSize: 14,
    fontFamily: sd.fonts.bold,
  },
});

export default EmailVerificationPage;