import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, Alert, TextInput, ActivityIndicator } from 'react-native';
import { Modal, Portal, Button, useTheme, IconButton, Divider } from 'react-native-paper';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import * as Clipboard from 'expo-clipboard';
import { getData, storeData } from '../../storageUtility';
import { ip } from '@/ContentExport';
import sd from '@/utils/styleDictionary';


const TwoFactorAuth = ({ visible, hideModal, onSuccess, onCancel }) => {
  const theme = useTheme();
  const [userId, setUserId] = useState('');
  const [step, setStep] = useState('intro'); // intro, qrcode, verify, success
  const [qrCode, setQrCode] = useState(null);
  const [secret, setSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getData('userId');
        if (id) {
          setUserId(id);
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };
    
    if (visible) {
      fetchUserId();
    }
  }, [visible]);

  useEffect(() => {
    // Reset state when modal closes
    if (!visible) {
      setStep('intro');
      setQrCode(null);
      setSecret('');
      setVerificationCode(['', '', '', '', '', '']);
    }
  }, [visible]);

  const generateQrCode = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${ip.address}/api/set-up-2fa`, {
        id: userId,
        role: 'Patient',
        regenerate: false
      });
      
      setQrCode(response.data.qrCode);
      setSecret(response.data.secret);
      setStep('qrcode');
    } catch (error) {
      console.error('Error generating QR code:', error);
      Alert.alert('Error', 'Failed to generate QR code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copySecretToClipboard = async () => {
    await Clipboard.setStringAsync(secret);
    Alert.alert('Copied', 'Secret key copied to clipboard');
  };

  const handleCodeChange = (text, index) => {
    // Only allow numbers
    if (/^[0-9]*$/.test(text)) {
      const newVerificationCode = [...verificationCode];
      newVerificationCode[index] = text;
      setVerificationCode(newVerificationCode);
      
      // Auto-advance to next field if input is filled
      if (text && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyPress = (e, index) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace') {
      if (!verificationCode[index] && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const verifyCode = async () => {
    const code = verificationCode.join('');
    if (code.length !== 6) {
      Alert.alert('Error', 'Please enter a 6-digit verification code');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${ip.address}/api/verify-2fa`, {
        userId,
        role: 'Patient',
        code
      });

      if (response.data.verified) {
        setStep('success');
        // Update user settings
        await storeData('twoFactorEnabled', 'true');
        // Notify parent component
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 1500);
        }
      } else {
        Alert.alert('Error', 'Verification failed. Please check your code and try again.');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      Alert.alert('Error', error.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderIntroScreen = () => (
    <View style={styles.contentContainer}>
      <View style={styles.iconContainer}>
        <FontAwesome5 name="shield-alt" size={60} color={theme.colors.primary} />
      </View>
      
      <Text style={styles.title}>Two-Factor Authentication</Text>
      <Text style={styles.subtitle}>Add an extra layer of security to your appointments</Text>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <View style={styles.stepNumberBadge}>
            <Text style={styles.stepNumber}>1</Text>
          </View>
          <View style={styles.stepTextContainer}>
            <Text style={styles.stepTitle}>Download an authenticator app</Text>
            <Text style={styles.stepDescription}>
              Download Google Authenticator, Authy, or any other authenticator app on your device.
            </Text>
          </View>
        </View>
        
        <View style={styles.infoItem}>
          <View style={styles.stepNumberBadge}>
            <Text style={styles.stepNumber}>2</Text>
          </View>
          <View style={styles.stepTextContainer}>
            <Text style={styles.stepTitle}>Scan QR code</Text>
            <Text style={styles.stepDescription}>
              Scan the QR code with your authenticator app to set up your account.
            </Text>
          </View>
        </View>
        
        <View style={styles.infoItem}>
          <View style={styles.stepNumberBadge}>
            <Text style={styles.stepNumber}>3</Text>
          </View>
          <View style={styles.stepTextContainer}>
            <Text style={styles.stepTitle}>Enter verification code</Text>
            <Text style={styles.stepDescription}>
              Enter the 6-digit code from your authenticator app to verify your setup.
            </Text>
          </View>
        </View>
      </View>
      
      <Button 
        mode="contained"
        onPress={generateQrCode}
        loading={loading}
        disabled={loading}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
      >
        Get Started
      </Button>
    </View>
  );

  const renderQrCodeScreen = () => (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Scan QR Code</Text>
      <Text style={styles.subtitle}>Scan this QR code with your authenticator app</Text>
      
      {qrCode && (
        <View style={styles.qrCodeContainer}>
          <Image 
            source={{ uri: qrCode }}
            style={styles.qrCode}
            resizeMode="contain"
          />
        </View>
      )}
      
      <View style={styles.secretContainer}>
        <Text style={styles.secretLabel}>Or enter this code manually:</Text>
        <View style={styles.secretWrapper}>
          <Text style={styles.secretText}>{secret}</Text>
          <TouchableOpacity onPress={copySecretToClipboard} style={styles.copyButton}>
            <MaterialIcons name="content-copy" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <Button 
        mode="contained"
        onPress={() => setStep('verify')}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
      >
        Next
      </Button>
      
      <Button 
        mode="outlined"
        onPress={() => setStep('intro')}
        style={[styles.button, styles.secondaryButton]}
        contentStyle={styles.buttonContent}
        labelStyle={styles.secondaryButtonLabel}
      >
        Back
      </Button>
    </ScrollView>
  );

  const renderVerificationScreen = () => (
    <View style={styles.contentContainer}>
      <Text style={styles.title}>Verify Your Setup</Text>
      <Text style={styles.subtitle}>Enter the 6-digit code from your authenticator app</Text>
      
      <View style={styles.codeInputContainer}>
        {verificationCode.map((digit, index) => (
          <TextInput
            key={index}
            ref={ref => inputRefs.current[index] = ref}
            style={styles.codeInput}
            value={digit}
            onChangeText={(text) => handleCodeChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            maxLength={1}
            keyboardType="number-pad"
            selectionColor={theme.colors.primary}
          />
        ))}
      </View>
      
      <Text style={styles.verifyDescription}>
        Open your authenticator app to view your verification code
      </Text>
      
      <Button 
        mode="contained"
        onPress={verifyCode}
        loading={loading}
        disabled={loading}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
      >
        Verify
      </Button>
      
      <Button 
        mode="outlined"
        onPress={() => setStep('qrcode')}
        style={[styles.button, styles.secondaryButton]}
        contentStyle={styles.buttonContent}
        labelStyle={styles.secondaryButtonLabel}
      >
        Back
      </Button>
    </View>
  );

  const renderSuccessScreen = () => (
    <View style={styles.contentContainer}>
      <View style={styles.successIconContainer}>
        <MaterialIcons name="check-circle" size={80} color="#4CAF50" />
      </View>
      
      <Text style={styles.title}>Setup Complete!</Text>
      <Text style={styles.subtitle}>
        Two-factor authentication has been successfully enabled for your account
      </Text>
      
      <View style={styles.successInfoContainer}>
        <Text style={styles.successInfoText}>
          From now on, you'll need to enter a verification code from your authenticator app when booking appointments.
        </Text>
      </View>
      
      <Button 
        mode="contained"
        onPress={hideModal}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
      >
        Done
      </Button>
    </View>
  );

  const renderContent = () => {
    switch(step) {
      case 'intro':
        return renderIntroScreen();
      case 'qrcode':
        return renderQrCodeScreen();
      case 'verify':
        return renderVerificationScreen();
      case 'success':
        return renderSuccessScreen();
      default:
        return renderIntroScreen();
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onCancel || hideModal}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {step === 'success' ? 'Setup Complete' : 'Two-Factor Authentication'}
          </Text>
          {step !== 'success' && (
            <IconButton
              icon="close"
              size={20}
              onPress={onCancel || hideModal}
              style={styles.closeButton}
            />
          )}
        </View>
        
        <Divider style={styles.divider} />
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {renderContent()}
        </ScrollView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '90%',
    maxWidth: 500,
    alignSelf: 'center',
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  modalTitle: {
    fontFamily: sd.fonts.bold,
    fontSize: 20,
    color: '#333',
  },
  closeButton: {
    margin: -8,
  },
  divider: {
    backgroundColor: '#e0e0e0',
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: sd.fonts.bold,
    fontSize: 22,
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: sd.fonts.regular,
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  infoContainer: {
    width: '100%',
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  stepNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e1f5fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  stepNumber: {
    fontFamily: sd.fonts.medium,
    fontSize: 14,
    color: '#0288d1',
  },
  stepTextContainer: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: sd.fonts.medium,
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  stepDescription: {
    fontFamily: sd.fonts.regular,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  button: {
    width: '100%',
    borderRadius: 8,
    marginVertical: 8,
  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    fontFamily: sd.fonts.medium,
    fontSize: 16,
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
  },
  secondaryButtonLabel: {
    fontFamily: sd.fonts.medium,
    fontSize: 16,
    letterSpacing: 0.5,
  },
  qrCodeContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 24,
    alignItems: 'center',
  },
  qrCode: {
    width: 200,
    height: 200,
  },
  secretContainer: {
    width: '100%',
    marginBottom: 24,
  },
  secretLabel: {
    fontFamily: sd.fonts.regular,
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  secretWrapper: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  secretText: {
    fontFamily: sd.fonts.medium,
    fontSize: 16,
    color: '#333',
    flex: 1,
    letterSpacing: 0.5,
  },
  copyButton: {
    padding: 8,
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    width: '100%',
  },
  codeInput: {
    width: 48,
    height: 56,
    margin: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: sd.fonts.medium,
  },
  verifyDescription: {
    fontFamily: sd.fonts.regular,
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  successIconContainer: {
    marginVertical: 24,
  },
  successInfoContainer: {
    backgroundColor: '#e8f5e9',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    marginBottom: 24,
  },
  successInfoText: {
    fontFamily: sd.fonts.regular,
    fontSize: 14,
    color: '#2e7d32',
    lineHeight: 22,
  },
});

export default TwoFactorAuth;