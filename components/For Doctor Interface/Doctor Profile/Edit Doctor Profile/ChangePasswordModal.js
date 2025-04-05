import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import Modal from 'react-native-modal';
import axios from 'axios';
import { ip } from '@/ContentExport';
import sd from '@/utils/styleDictionary';
import UserContext from '@/UserContext';

const ChangePasswordModal = ({ isVisible, onClose, userId }) => {
  const theme = useTheme();
  const { user } = React.useContext(UserContext);
  
  // Add email state
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Error states
  const [emailError, setEmailError] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const resetForm = () => {
    setEmail('');
    setEmailError('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setCurrentPasswordError('');
    setNewPasswordError('');
    setConfirmPasswordError('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const validateInputs = () => {
    let isValid = true;
    
    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (email !== user.dr_email) {
      setEmailError('Email does not match your registered email');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    // Validate current password
    if (!currentPassword.trim()) {
      setCurrentPasswordError('Current password is required');
      isValid = false;
    } else {
      setCurrentPasswordError('');
    }
    
    // Validate new password
    if (!newPassword.trim()) {
      setNewPasswordError('New password is required');
      isValid = false;
    } else if (newPassword.length < 8) {
      setNewPasswordError('Password must be at least 8 characters');
      isValid = false;
    } else {
      setNewPasswordError('');
    }
    
    // Validate confirm password
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }
    
    return isValid;
  };

  const handleChangePassword = async () => {
    if (!validateInputs()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await axios.put(`${ip.address}/api/doctor/api/${userId}/changePassword`, {
        currentPassword,
        newPassword,
        email
      });
      
      if (response.data.success) {
        Alert.alert('Success', 'Password changed successfully');
        resetForm();
        onClose();
      } else {
        Alert.alert('Error', response.data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Current password is incorrect or server error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={handleCancel}
      backdropTransitionOutTiming={0}
      avoidKeyboard={true}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Change Password</Text>
        
        {/* Add Email Field */}
        <TextInput
          label="Email Verification"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          outlineColor="#E0E0E0"
          activeOutlineColor={theme.colors.primary}
          error={!!emailError}
          placeholder="Enter your registered email"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        <Text style={styles.helperText}>Enter the email associated with your account</Text>
        
        <TextInput
          label="Current Password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry={!showCurrentPassword}
          style={styles.input}
          mode="outlined"
          outlineColor="#E0E0E0"
          activeOutlineColor={theme.colors.primary}
          error={!!currentPasswordError}
          right={
            <TextInput.Icon
              icon={showCurrentPassword ? "eye-off" : "eye"}
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              color={theme.colors.primary}
            />
          }
        />
        {currentPasswordError ? <Text style={styles.errorText}>{currentPasswordError}</Text> : null}
        
        <TextInput
          label="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={!showNewPassword}
          style={styles.input}
          mode="outlined"
          outlineColor="#E0E0E0"
          activeOutlineColor={theme.colors.primary}
          error={!!newPasswordError}
          right={
            <TextInput.Icon
              icon={showNewPassword ? "eye-off" : "eye"}
              onPress={() => setShowNewPassword(!showNewPassword)}
              color={theme.colors.primary}
            />
          }
        />
        {newPasswordError ? <Text style={styles.errorText}>{newPasswordError}</Text> : null}
        
        <TextInput
          label="Confirm New Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          style={styles.input}
          mode="outlined"
          outlineColor="#E0E0E0"
          activeOutlineColor={theme.colors.primary}
          error={!!confirmPasswordError}
          right={
            <TextInput.Icon
              icon={showConfirmPassword ? "eye-off" : "eye"}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              color={theme.colors.primary}
            />
          }
        />
        {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
        
        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={handleCancel}
            style={styles.cancelButton}
            labelStyle={styles.buttonLabel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleChangePassword}
            style={styles.submitButton}
            labelStyle={styles.buttonLabel}
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            Change Password
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '100%',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: sd.fonts.semiBold,
    color: '#2196F3',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 8,
    backgroundColor: 'white',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
    marginTop: -4,
    fontFamily: sd.fonts.regular,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
    marginTop: -4,
    fontFamily: sd.fonts.regular,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    borderColor: '#2196F3',
  },
  submitButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#2196F3',
  },
  buttonLabel: {
    fontSize: 14,
    fontFamily: sd.fonts.medium,
  },
});

export default ChangePasswordModal;