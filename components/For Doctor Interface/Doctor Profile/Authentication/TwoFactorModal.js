import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Modal, Portal, Button, TextInput } from 'react-native-paper';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { ip } from '@/ContentExport';
import sd from '@/utils/styleDictionary';
import { useUser } from '@/UserContext';

const TwoFactorModal = ({
  visible,
  onClose,
  loading,
  setLoading,
  theme,
}) => {
  const [qrCode, setQrCode] = useState(null);
  const [secretKey, setSecretKey] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [setupStep, setSetupStep] = useState(1); // 1: intro, 2: QR code view
  const { user } = useUser();

  // Setup 2FA when modal opens if not already set up
  useEffect(() => {
    if (visible && user && !user?.twoFactorEnabled && setupStep === 2) {
      setupTwoFactor();
    }
  }, [visible, user, setupStep]);

  // Function to set up Two-Factor Authentication
  const setupTwoFactor = async (regenerate = false) => {
    try {
      setLoading(true);

      const response = await axios.post(`${ip.address}/api/set-up-2fa`, {
        id: user._id,
        role: 'Doctor',
        regenerate: regenerate,
      });

      if (response.data.qrCode && response.data.secret) {
        setQrCode(response.data.qrCode);
        setSecretKey(response.data.secret);
      } else {
        Alert.alert('Error', 'Failed to generate QR code for 2FA setup.');
      }
    } catch (error) {
      console.error('Error setting up 2FA:', error);
      Alert.alert('Error', 'Could not set up two-factor authentication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Regenerate QR code
  const handleRegenerate = () => {
    setupTwoFactor(true);
    setQrCode(null);
  };

  // Verify the code entered by the user
  const verifyTwoFactor = async () => {
    if (verificationCode.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter the 6-digit verification code from your authenticator app.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${ip.address}/api/verify-2fa`, {
        userId: user?._id,
        role: 'Doctor',
        code: verificationCode,
      });

      if (response.data.verified) {
        Alert.alert(
          'Success',
          'Two-factor authentication has been enabled for your account.',
          [{ text: 'OK', onPress: () => onClose() }]
        );
      } else {
        Alert.alert('Verification Failed', 'The code you entered is invalid. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying 2FA code:', error);
      Alert.alert('Error', 'Failed to verify the code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    modalContainer: {
      backgroundColor: theme.colors.background,
      marginHorizontal: 16,
      borderRadius: 16,
      padding: 16,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    modalTitle: {
      fontFamily: sd.fonts.bold,
      fontSize: 20,
      color: theme.colors.primary,
    },
    closeButton: {
      padding: 5,
    },
    modalContent: {
      paddingBottom: 16,
    },
    section: {
      marginBottom: 20,
    },
    introContainer: {
      alignItems: 'center',
      paddingVertical: 20,
    },
    introIcon: {
      marginBottom: 15,
    },
    introTitle: {
      fontFamily: sd.fonts.semiBold,
      fontSize: 18,
      color: theme.colors.primary,
      marginBottom: 10,
      textAlign: 'center',
    },
    introText: {
      fontFamily: sd.fonts.regular,
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      textAlign: 'center',
      marginBottom: 20,
    },
    qrCodeContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 15,
      backgroundColor: 'white',
      padding: 15,
      borderRadius: 10,
    },
    qrCode: {
      width: 200,
      height: 200,
    },
    verificationContainer: {
      marginTop: 15,
    },
    verificationTitle: {
      fontFamily: sd.fonts.medium,
      fontSize: 15,
      color: theme.colors.onSurface,
      marginBottom: 10,
    },
    codeInput: {
      marginBottom: 20,
      backgroundColor: theme.colors.surface,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    button: {
      flex: 1,
      marginHorizontal: 5,
      borderRadius: 8,
    },
    primaryButton: {
      backgroundColor: theme.colors.primary,
    },
    cancelButton: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.outline,
      borderWidth: 1,
    },
  });

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Two-Factor Authentication</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color={theme.colors.onSurface} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {setupStep === 1 ? (
            <View style={styles.introContainer}>
              <MaterialIcons
                name="security"
                size={60}
                color={theme.colors.primary}
                style={styles.introIcon}
              />
              <Text style={styles.introTitle}>Enhance Your Account Security</Text>
              <Text style={styles.introText}>
                Two-factor authentication adds an extra layer of security to your account. In addition to your password, you'll need a verification code when signing in.
              </Text>
              <Button
                mode="contained"
                onPress={() => setSetupStep(2)}
                style={styles.primaryButton}
              >
                Begin Setup
              </Button>
            </View>
          ) : (
            <View>
              <View style={styles.qrCodeContainer}>
                {qrCode ? (
                  <Image
                    source={{ uri: qrCode }}
                    style={styles.qrCode}
                    resizeMode="contain"
                  />
                ) : (
                  <ActivityIndicator size="large" color={theme.colors.primary} />
                )}
              </View>
              <View style={styles.verificationContainer}>
                <Text style={styles.verificationTitle}>Enter verification code:</Text>
                <TextInput
                  mode="outlined"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={verificationCode}
                  onChangeText={setVerificationCode}
                  style={styles.codeInput}
                  placeholder="e.g. 123456"
                />
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  mode="outlined"
                  onPress={() => setSetupStep(1)}
                  style={styles.cancelButton}
                >
                  Back
                </Button>
                <Button
                  mode="contained"
                  onPress={verifyTwoFactor}
                  style={styles.primaryButton}
                  disabled={verificationCode.length !== 6}
                >
                  Verify
                </Button>
              </View>
            </View>
          )}
        </ScrollView>
      </Modal>
    </Portal>
  );
};

export default TwoFactorModal;