import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { getData } from '../../../storageUtility';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ip } from '../../../../ContentExport';
import TwoFactorModal from '../Authentication/TwoFactorModal';
import sd from '@/utils/styleDictionary';

const ViewDoctorProfile = () => {
  const [doctorId, setDoctorId] = useState('');
  const [doctor, setDoctor] = useState(null);
  const [twoFactorModalVisible, setTwoFactorModalVisible] = useState(false);
  const [twoFactorSetupStep, setTwoFactorSetupStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [secret, setSecret] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const theme = useTheme();

  // Fetch doctor ID from storage
  useEffect(() => {
    const fetchDoctorId = async () => {
      try {
        const id = await getData('userId');
        id ? setDoctorId(id) : console.log('Doctor not found');
      } catch (err) {
        console.log(err);
      }
    };
    fetchDoctorId();
  }, []);

  // Fetch doctor data from the API based on the doctorId
  useFocusEffect(
    useCallback(() => {
      const fetchDoctorData = async () => {
        if (doctorId) {
          try {
            const res = await axios.get(`${ip.address}/api/doctor/one/${doctorId}`);
            setDoctor(res.data.doctor);
          } catch (err) {
            console.log(err);
          }
        }
      };
      fetchDoctorData();
    }, [doctorId])
  );

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
      // API call to get 2FA setup info - using the same endpoint pattern as patient
      const response = await axios.post(`${ip.address}/api/doctor/twofactor/${doctorId}/setup`);
      
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
      const response = await axios.post(`${ip.address}/api/doctor/twofactor/${doctorId}/verify`, {
        code: verificationCode,
        secret: secret
      });
      
      if (response.data && response.data.success) {
        // Update doctor data to reflect enabled 2FA
        setDoctor({...doctor, twoFactorEnabled: true});
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
              const response = await axios.post(`${ip.address}/api/doctor/twofactor/${doctorId}/disable`);
              
              if (response.data && response.data.success) {
                // Update doctor data to reflect disabled 2FA
                setDoctor({...doctor, twoFactorEnabled: false});
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
      padding: 12, // Reduced from 16
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12, // Reduced from 20
    },
    headerText: {
      fontSize: 16, // Reduced from 20
      fontFamily: sd.fonts.bold,
      color: theme.colors.primary,
      textAlign: 'center',
      flex: 2,
    },
    topCont: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      marginBottom: 12, // Reduced from 20
      borderRadius: 8, // Reduced from 10
      padding: 12, // Reduced from 16
      ...sd.shadows.level1, // Reduced shadow
    },
    imageCont: {
      marginRight: 12, // Reduced from 16
    },
    profileImage: {
      width: 80, // Reduced from 100
      height: 80, // Reduced from 100
      borderRadius: 40, // Reduced from 50
      borderWidth: 1.5, // Reduced from 2
      borderColor: theme.colors.primary,
    },
    nameCont: {
      flex: 1,
      justifyContent: 'center',
    },
    nameText: {
      fontSize: 16, // Reduced from 18
      fontFamily: sd.fonts.semiBold,
      color: theme.colors.onSurface,
      marginBottom: 2, // Reduced from 4
    },
    emailText: {
      fontSize: 12, // Reduced from 14
      fontFamily: sd.fonts.regular,
      color: theme.colors.onSurfaceVariant,
    },
    specialtyText: {
      fontSize: 12, // Reduced from 14
      fontFamily: sd.fonts.medium,
      color: theme.colors.secondary,
      marginTop: 2,
    },
    buttonCont: {
      marginTop: 8,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      gap: 8, // Added gap between buttons
      marginBottom: 30, // Reduced from 20
    },
    button: {
      flex: 1,
      borderColor: theme.colors.primary,
      height: 40, // Increased from 28
      justifyContent: 'center', // Add this to center content vertically
    },
    buttonLabel: { // Add this new style
      fontSize: 10,
      fontFamily: sd.fonts.medium,
      // marginBottom: 10,
    },
    securityButton: {
      marginTop: 6,
      borderWidth: 1,
    },
    twoFactorEnabledButton: {
      borderColor: theme.colors.secondary,
    },
    infoCont: {
      backgroundColor: theme.colors.surface,
      borderRadius: 8, // Reduced from 10
      padding: 12, // Reduced from 16
      marginBottom: 12, // Reduced from 16
      ...sd.shadows.level1, // Reduced shadow
    },
    infoRow: {
      marginBottom: 8, // Reduced from 12
    },
    infoLabel: {
      fontSize: 12, // Reduced from 14
      fontFamily: sd.fonts.semiBold,
      color: theme.colors.primary,
      marginBottom: 2, // Reduced from 4
    },
    infoText: {
      fontSize: 14, // Reduced from 16
      fontFamily: sd.fonts.regular,
      color: theme.colors.onSurface,
    },
    sectionTitle: {
      fontSize: 14, // Reduced from 18
      fontFamily: sd.fonts.semiBold,
      color: theme.colors.primary,
      marginBottom: 8, // Reduced from 10
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

        {doctor ? (
          <>
            {/* Profile Card */}
            <View style={styles.topCont}>
              {/* Left side - Image */}
              <View style={styles.imageCont}>
                <Image
                  source={
                    doctor.dr_image
                      ? { uri: `${ip.address}/${doctor.dr_image}` }
                      : { uri: 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png' }
                  }
                  style={styles.profileImage}
                />
              </View>
              
              {/* Right side - Info */}
              <View style={styles.nameCont}>
                <Text style={styles.nameText}>
                  Dr. {doctor.dr_firstName} {doctor.dr_lastName}
                </Text>
                <Text style={styles.emailText}>{doctor.dr_email}</Text>
                <Text style={styles.specialtyText}>{doctor.dr_specialty}</Text>
              </View>
            </View>

            {/* Button Row - Separate from profile info */}
            <View style={styles.buttonCont}>
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('editdrprofile')}
                style={styles.button}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
              >
                Edit Profile
              </Button>
              <Button
                mode="outlined"
                onPress={openTwoFactorModal}
                style={[
                  styles.button, 
                  doctor.twoFactorEnabled && styles.twoFactorEnabledButton
                ]}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                icon={({color}) => (
                  <MaterialIcons name="security" size={14} color={color} />
                )}
              >
                {doctor.twoFactorEnabled ? "Protected" : "Enable 2FA"}
              </Button>
            </View>

            {/* Personal Information Section */}
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <View style={styles.infoCont}>
              {textBox('First Name', doctor.dr_firstName)}
              {doctor.dr_middleInitial && textBox('Middle Initial', doctor.dr_middleInitial + '.')}
              {textBox('Last Name', doctor.dr_lastName)}
              {textBox('Contact Number', doctor.dr_contactNumber)}
              {textBox('Email Address', doctor.dr_email)}
            </View>

            {/* Professional Information Section */}
            <Text style={styles.sectionTitle}>Professional Information</Text>
            <View style={styles.infoCont}>
              {textBox('Specialty', doctor.dr_specialty)}
              {textBox('License Number', doctor.dr_licenseNo)}
              {textBox('Medical School', doctor.dr_medicalSchool)}
              {doctor.dr_experience && textBox('Years of Experience', `${doctor.dr_experience} years`)}
              {doctor.dr_hospitalAffiliation && textBox('Hospital Affiliation', doctor.dr_hospitalAffiliation)}
            </View>

            {/* Two-Factor Authentication Modal */}
            <TwoFactorModal
              visible={twoFactorModalVisible}
              onClose={closeTwoFactorModal}
              user={doctor}
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
              userId={doctor._id}
              isDoctor={true}
            />
          </>
        ) : (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 50 }} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewDoctorProfile;