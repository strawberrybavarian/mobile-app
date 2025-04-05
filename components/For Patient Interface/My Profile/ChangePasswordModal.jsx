import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import Modal from "react-native-modal";
import axios from 'axios';
import { ip } from '../../../ContentExport';
import sd from '../../../utils/styleDictionary';

const ChangePasswordModal = ({ isVisible, onClose, email, userId, theme }) => {
  const [passwordEmail, setPasswordEmail] = useState('');
  const [confirmPasswordEmail, setConfirmPasswordEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordEmailError, setPasswordEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [oldPasswordError, setOldPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPasswordValid = (password) => {
    return password.length >= 8 &&
           /[!@#$%^&*(),.?":{}|<>]/.test(password) &&
           /[A-Z]/.test(password) &&
           /[a-z]/.test(password);
  };

  const handleChangePassword = async () => {
    setPasswordEmailError('');
    setPasswordError('');
    setOldPasswordError('');
    
    // Validate email
    if (passwordEmail !== email) {
      setPasswordEmailError("Email doesn't match your account email!");
      return;
    }

    // Validate emails match
    if (passwordEmail !== confirmPasswordEmail) {
      setPasswordEmailError("Emails do not match!");
      return;
    }

    // Validate old password
    if (!oldPassword) {
      setOldPasswordError("Old password is required!");
      return;
    }

    // Validate new passwords match
    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match!");
      return;
    }

    // Validate password strength
    if (!isPasswordValid(newPassword)) {
      setPasswordError("Please ensure your password meets all requirements");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${ip.address}/api/patient/api/change-password/${userId}`, {
        email: passwordEmail,
        oldPassword,
        newPassword,
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Password updated successfully!');
        resetFields();
        onClose();
      } else {
        Alert.alert('Error', response.data.message || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', error.response?.data?.message || 'An unknown error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetFields = () => {
    setPasswordEmail('');
    setConfirmPasswordEmail('');
    setOldPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setPasswordEmailError('');
    setPasswordError('');
    setOldPasswordError('');
  };

  const handleClose = () => {
    resetFields();
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onBackdropPress={handleClose}
    >
      <View style={styles.centeredView}>
        <ScrollView style={[styles.modalView, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.modalTitle, { color: theme.colors.primary }]}>Change Password</Text>

          <TextInput
            style={[styles.modalInput, { borderColor: theme.colors.outline, color: theme.colors.onSurface }]}
            placeholder="Enter your email"
            value={passwordEmail}
            onChangeText={setPasswordEmail}
          />
          {passwordEmailError ? <Text style={styles.errorText}>{passwordEmailError}</Text> : null}
          
          <TextInput
            style={[styles.modalInput, { borderColor: theme.colors.outline, color: theme.colors.onSurface }]}
            placeholder="Confirm your email"
            value={confirmPasswordEmail}
            onChangeText={setConfirmPasswordEmail}
          />
          {passwordEmailError ? <Text style={styles.errorText}>{passwordEmailError}</Text> : null}
          
          <TextInput
            style={[styles.modalInput, { borderColor: theme.colors.outline, color: theme.colors.onSurface }]}
            placeholder="Enter your old password"
            secureTextEntry
            value={oldPassword}
            onChangeText={setOldPassword}
          />
          {oldPasswordError ? <Text style={styles.errorText}>{oldPasswordError}</Text> : null}
          
          <TextInput
            style={[styles.modalInput, { borderColor: theme.colors.outline, color: theme.colors.onSurface }]}
            placeholder="Enter your new password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          
          <TextInput
            style={[styles.modalInput, { borderColor: theme.colors.outline, color: theme.colors.onSurface }]}
            placeholder="Confirm your new password"
            secureTextEntry
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
          />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton, { backgroundColor: theme.colors.errorContainer }]}
              onPress={handleClose}
              disabled={isSubmitting}
            >
              <Text style={[styles.buttonText, { color: theme.colors.onPrimary }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.changeButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleChangePassword}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={[styles.buttonText, { color: theme.colors.onPrimary }]}>Change Password</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    marginVertical: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    borderRadius: 16,
    padding: 20,
    width: '90%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: sd.fonts.bold,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontFamily: sd.fonts.regular,
    marginBottom: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 8,
  },
  cancelButton: {
    // Background color set dynamically from theme
  },
  changeButton: {
    // Background color set dynamically from theme
  },
  buttonText: {
    fontSize: 16,
    fontFamily: sd.fonts.medium,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontFamily: sd.fonts.regular,
    fontSize: 12,
  }
});

export default ChangePasswordModal;