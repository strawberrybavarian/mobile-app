import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  ScrollView, 
  Platform,
  TextInput,
  ActivityIndicator,
  Keyboard,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import axios from 'axios';
import { ip } from '../../../ContentExport';
import { SafeAreaView } from 'react-native-safe-area-context';
import sd from '../../../utils/styleDictionary';

const ForgotPasswordPage = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Patient');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  const handleSubmit = async () => {
    Keyboard.dismiss();
    setError('');
    
    // Validate email
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Choose the right endpoint based on role
      const endpoint = role === 'Patient' 
        ? `${ip.address}/api/patient/forgot-password`
        : `${ip.address}/api/doctor/forgot-password`;
      
      const response = await axios.post(endpoint, { email: email.trim() });
      
      setIsSubmitting(false);
      setSuccess(true);
    } catch (err) {
      setIsSubmitting(false);
      
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <TouchableOpacity 
              style={[styles.backButton, { backgroundColor: theme.colors.surfaceVariant }]}
              onPress={() => navigation.goBack()}
            >
              <FontAwesome5 name="chevron-left" size={15} color={theme.colors.primary} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.colors.primary }]}>
              Forgot Password
            </Text>
            <View style={{ width: 45 }} />
          </View>
          
          <View style={styles.content}>
            {success ? (
              <View style={styles.successContainer}>
                <View style={styles.iconCircle}>
                  <FontAwesome5 name="envelope" size={45} color={theme.colors.primary} />
                </View>
                <Text style={styles.successTitle}>Check Your Email</Text>
                <Text style={styles.successMessage}>
                  We've sent recovery instructions to your email address.
                  Please check your inbox and follow the link to reset your password.
                </Text>
                <TouchableOpacity 
                  style={[styles.button, { backgroundColor: theme.colors.primary }]}
                  onPress={() => navigation.navigate('SigninPage')}
                >
                  <Text style={styles.buttonText}>Return to Login</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.title}>Password Recovery</Text>
                <Text style={styles.subtitle}>
                  Enter your email address below and we'll send you instructions to reset your password.
                </Text>
                
                {error ? (
                  <View style={styles.errorContainer}>
                    <FontAwesome5 name="exclamation-circle" size={16} color="#FF3B30" />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}
                
                <View style={styles.formContainer}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <View style={styles.inputContainer}>
                    <FontAwesome5 name="envelope" size={16} color="#999" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email"
                      placeholderTextColor="#999"
                      keyboardType="email-address"
                      value={email}
                      onChangeText={(text) => {
                        // Remove spaces as they type
                        setEmail(text.replace(/\s/g, ''));
                        setError('');
                      }}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                  
                  <Text style={[styles.inputLabel, { marginTop: 20 }]}>Account Type</Text>
                  <View style={styles.roleContainer}>
                    <TouchableOpacity
                      style={[
                        styles.roleButton,
                        role === 'Patient' && [styles.roleButtonActive, { borderColor: theme.colors.primary }]
                      ]}
                      onPress={() => setRole('Patient')}
                    >
                      <FontAwesome5
                        name="user"
                        size={16}
                        color={role === 'Patient' ? theme.colors.primary : '#999'}
                        style={styles.roleIcon}
                      />
                      <Text
                        style={[
                          styles.roleText,
                          role === 'Patient' && [styles.roleTextActive, { color: theme.colors.primary }]
                        ]}
                      >
                        Patient
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.roleButton,
                        role === 'Doctor' && [styles.roleButtonActive, { borderColor: theme.colors.primary }]
                      ]}
                      onPress={() => setRole('Doctor')}
                    >
                      <FontAwesome5
                        name="user-md"
                        size={16}
                        color={role === 'Doctor' ? theme.colors.primary : '#999'}
                        style={styles.roleIcon}
                      />
                      <Text
                        style={[
                          styles.roleText,
                          role === 'Doctor' && [styles.roleTextActive, { color: theme.colors.primary }]
                        ]}
                      >
                        Doctor
                      </Text>
                    </TouchableOpacity>
                  </View>
                  
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      { backgroundColor: theme.colors.primary },
                      isSubmitting && styles.disabledButton
                    ]}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.submitButtonText}>Send Recovery Instructions</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingTop: 20,
    paddingBottom: 15,
  },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: sd.fonts.medium,
  },
  content: {
    flex: 1,
    padding: 30,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: sd.fonts.bold,
    color: '#333',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: sd.fonts.regular,
    color: '#666',
    lineHeight: 24,
    marginBottom: 30,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEEEE',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#FF3B30',
    marginLeft: 8,
    fontFamily: sd.fonts.regular,
    flex: 1,
  },
  formContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: sd.fonts.medium,
    color: '#444',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7F9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    height: 55,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: sd.fonts.regular,
    fontSize: 16,
    color: '#333',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    height: 55,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#F5F7F9',
  },
  roleButtonActive: {
    backgroundColor: '#F0F7FF',
    borderWidth: 2,
  },
  roleIcon: {
    marginRight: 8,
  },
  roleText: {
    fontFamily: sd.fonts.medium,
    fontSize: 16,
    color: '#666',
  },
  roleTextActive: {
    fontFamily: sd.fonts.bold,
  },
  submitButton: {
    height: 55,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontFamily: sd.fonts.medium,
    fontSize: 16,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontFamily: sd.fonts.bold,
    color: '#333',
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 16,
    fontFamily: sd.fonts.regular,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  button: {
    width: '100%',
    height: 55,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontFamily: sd.fonts.medium,
    fontSize: 16,
  }
});

export default ForgotPasswordPage;