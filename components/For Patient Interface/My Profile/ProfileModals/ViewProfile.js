import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { Button, Modal, Portal } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { getData } from '../../../storageUtility';
import sd from '../../../../utils/styleDictionary';
import EditProfile from './EditProfile/EditProfile';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import TwoFactorModal from './Authentication/TwoFactorModal';
import { ip } from '@/ContentExport';

const ViewProfile = () => {
  const [userId, setUserId] = useState('');
  const [patient, setPatient] = useState(null);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [twoFactorModalVisible, setTwoFactorModalVisible] = useState(false);
  const [twoFactorSetupStep, setTwoFactorSetupStep] = useState(1); // 1: intro, 2: QR code
  const [verificationCode, setVerificationCode] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [secret, setSecret] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const theme = useTheme();

  // Fetch user ID from storage
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getData('userId');
        id ? setUserId(id) : console.log('User not found');
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserId();
  }, []);

  // Fetch patient data from the API based on the userId
  useFocusEffect(
    useCallback(() => {
      const fetchPatientData = async () => {
        if (userId) {
          try {
            const res = await axios.get(`${ip.address}/api/patient/api/onepatient/${userId}`);
            setPatient(res.data.thePatient);
          } catch (err) {
            console.log(err);
          }
        }
      };
      fetchPatientData();
    }, [userId, isEditModalVisible])
  );

  // Toggle Edit Modal
  const handleEditModal = () => {
    setEditModalVisible(!isEditModalVisible);
  };

  // Update patient data after editing
  const handleProfileUpdate = (updatedData) => {
    setPatient(updatedData); // Update the patient state with the new data
  };

  // Two-Factor Authentication Functions
  const openTwoFactorModal = () => {
    setTwoFactorModalVisible(true);
    setTwoFactorSetupStep(1);
  };

  const closeTwoFactorModal = () => {
    setTwoFactorModalVisible(false);
    setTwoFactorSetupStep(1);
    setVerificationCode('');
  };

  const startTwoFactorSetup = async () => {
    setLoading(true);
    try {
      // API call to get 2FA setup info
      const response = await axios.post(`${ip.address}/api/patient/api/twofactor/${userId}/setup`);
      
      if (response.data && response.data.qrCode && response.data.secret) {
        setQrCodeUrl(response.data.qrCode);
        setSecret(response.data.secret);
        setTwoFactorSetupStep(2);
      } else {
        Alert.alert("Error", "Failed to generate two-factor authentication code. Please try again.");
      }
    } catch (error) {
      console.error("Error setting up 2FA:", error);
      Alert.alert("Error", "Failed to set up two-factor authentication. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyAndEnableTwoFactor = async () => {
    if (verificationCode.length !== 6) {
      Alert.alert("Error", "Please enter a 6-digit verification code.");
      return;
    }
    
    setLoading(true);
    try {
      // API call to verify the code
      const response = await axios.post(`${ip.address}/api/patient/api/twofactor/${userId}/verify`, {
        code: verificationCode,
        secret: secret
      });
      
      if (response.data && response.data.success) {
        // Update patient data to reflect enabled 2FA
        setPatient({...patient, twoFactorEnabled: true});
        Alert.alert("Success", "Two-factor authentication has been enabled for your account.");
        closeTwoFactorModal();
      } else {
        Alert.alert("Error", "Invalid verification code. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying 2FA:", error);
      Alert.alert("Error", "Failed to verify the code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const disableTwoFactor = async () => {
    Alert.alert(
      "Disable Two-Factor Authentication",
      "Are you sure you want to disable two-factor authentication? This will make your account less secure.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Disable",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              // API call to disable 2FA
              const response = await axios.post(`${ip.address}/api/patient/api/twofactor/${userId}/disable`);
              
              if (response.data && response.data.success) {
                // Update patient data to reflect disabled 2FA
                setPatient({...patient, twoFactorEnabled: false});
                Alert.alert("Success", "Two-factor authentication has been disabled for your account.");
                closeTwoFactorModal();
              } else {
                Alert.alert("Error", "Failed to disable two-factor authentication. Please try again.");
              }
            } catch (error) {
              console.error("Error disabling 2FA:", error);
              Alert.alert("Error", "Failed to disable two-factor authentication. Please try again.");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const textBox = (label, value) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoText}>{value || '---'}</Text>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      padding: 16,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    headerText: {
      fontSize: 20,
      fontFamily: sd.fonts.bold,
      color: theme.colors.primary,
      textAlign: 'center',
      flex: 2,
    },
    topCont: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      marginBottom: 20,
      borderRadius: 10,
      padding: 16,
      ...sd.shadows.level2,
    },
    imageCont: {
      marginRight: 16,
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    nameCont: {
      flex: 1,
      justifyContent: 'center',
    },
    nameText: {
      fontSize: 18,
      fontFamily: sd.fonts.semiBold,
      color: theme.colors.onSurface,
      marginBottom: 4,
    },
    emailText: {
      fontSize: 14,
      fontFamily: sd.fonts.regular,
      color: theme.colors.onSurfaceVariant,
    },
    buttonCont: {
      marginTop: 10,
    },
    button: {
      borderColor: theme.colors.primary,
    },
    securityButton: {
      marginTop: 8,
      borderWidth: 1.5,
    },
    twoFactorEnabledButton: {
      borderColor: theme.colors.secondary,
    },
    infoCont: {
      backgroundColor: theme.colors.surface,
      borderRadius: 10,
      padding: 16,
      ...sd.shadows.level2,
    },
    infoRow: {
      marginBottom: 12,
    },
    infoLabel: {
      fontSize: 14,
      fontFamily: sd.fonts.semiBold,
      color: theme.colors.primary,
      marginBottom: 4,
    },
    infoText: {
      fontSize: 16,
      fontFamily: sd.fonts.regular,
      color: theme.colors.onSurface,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ flex: 1 }}>
            <Entypo name="chevron-small-left" size={30} color={theme.colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerText}>View Profile</Text>
          <View style={{ flex: 1 }} />
        </View>

        {patient ? (
          <>
            {/* Profile Card */}
            <View style={styles.topCont}>
              <View style={styles.imageCont}>
                <Image
                  source={
                    patient.patient_image
                      ? { uri: `${ip.address}/${patient.patient_image}` }
                      : { uri: 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png' }
                  }
                  style={styles.profileImage}
                />
              </View>
              <View style={styles.nameCont}>
                <Text style={styles.nameText}>
                  {patient.patient_firstName} {patient.patient_lastName}
                </Text>
                <Text style={styles.emailText}>{patient.patient_email}</Text>
                <View style={styles.buttonCont}>
                  <Button
                    mode="outlined"
                    textColor={theme.colors.primary}
                    onPress={() => navigation.navigate('editprofile')}
                    style={styles.button}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    mode="outlined"
                    textColor={patient.twoFactorEnabled ? theme.colors.secondary : theme.colors.primary}
                    onPress={openTwoFactorModal}
                    style={[styles.button, styles.securityButton, patient.twoFactorEnabled && styles.twoFactorEnabledButton]}
                    icon={({color}) => (
                      <MaterialIcons name="security" size={18} color={color} />
                    )}
                  >
                    {patient.twoFactorEnabled ? "Security: Protected" : "Enable Account Security"}
                  </Button>
                </View>
              </View>
            </View>

            {/* Information Section */}
            <View style={styles.infoCont}>
              {textBox('First Name', patient.patient_firstName )}
              {textBox('Middle Initial', (patient.patient_middleInitial + '.'))}
              {textBox('Last Name', patient.patient_lastName)}
              {textBox('Contact Number', patient.patient_contactNumber)}
              {textBox('Email Address', patient.patient_email)}
              {textBox('Gender', patient.patient_gender)}
              {textBox('Address', (
                patient.patient_address.street + ', ' +
                patient.patient_address.barangay + ', ' +
                patient.patient_address.city))}
            </View>

            {/* Edit Profile Modal */}
            <EditProfile
              isVisible={isEditModalVisible}
              toggleModal={handleEditModal}
              setProfileData={handleProfileUpdate}
            />

            {/* Two-Factor Authentication Modal */}
            <TwoFactorModal
              visible={twoFactorModalVisible}
              onClose={closeTwoFactorModal}
              patient={patient}
              startTwoFactorSetup={startTwoFactorSetup}
              verifyAndEnableTwoFactor={verifyAndEnableTwoFactor}
              disableTwoFactor={disableTwoFactor}
              qrCodeUrl={qrCodeUrl}
              secret={secret}
              verificationCode={verificationCode}
              setVerificationCode={setVerificationCode}
              loading={loading}
              twoFactorSetupStep={twoFactorSetupStep}
              setTwoFactorSetupStep={setTwoFactorSetupStep}
              setLoading={setLoading}
              theme={theme}
              patientId={patient._id}
            />
          </>
        ) : (
          <ActivityIndicator size="large" color={sd.colors.blue} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewProfile;
