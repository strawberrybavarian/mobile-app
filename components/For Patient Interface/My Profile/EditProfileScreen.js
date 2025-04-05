import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, useTheme, ActivityIndicator, Badge } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { ip } from '../../../ContentExport';
import { getData } from '../../storageUtility';
import sd from '../../../utils/styleDictionary';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
import Modal from "react-native-modal";
import ChangePasswordModal from './ChangePasswordModal';

const EditProfileScreen = ({ navigation }) => {
  const theme = useTheme();

  const [userId, setUserId] = useState('');
  const [patient, setPatient] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [middleInitial, setMiddleInitial] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState({
    street: '',
    barangay: '',
    city: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);

  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getData('userId');
        if (id) {
          setUserId(id);
        } else {
          console.log('User not found');
          Alert.alert('Error', 'User ID not found. Please log in again.');
        }
      } catch (err) {
        console.error('Error fetching user ID:', err);
        Alert.alert('Error', 'Failed to retrieve user data.');
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchPatientData = async () => {
      if (userId) {
        setLoading(true);
        try {
          const response = await axios.get(`${ip.address}/api/patient/api/onepatient/${userId}`);
          const patientData = response.data.thePatient;
          setPatient(patientData);
          
          if (patientData.patient_image) {
            setProfileImage(`${ip.address}/${patientData.patient_image}`);
          }
          
          setFirstName(patientData.patient_firstName || '');
          setMiddleInitial(patientData.patient_middleInitial || '');
          setLastName(patientData.patient_lastName || '');
          setContactNumber(patientData.patient_contactNumber || '');
          setEmail(patientData.patient_email || '');
          setGender(patientData.patient_gender || '');
          
          if (patientData.patient_address) {
            setAddress({
              street: patientData.patient_address.street || '',
              barangay: patientData.patient_address.barangay || '',
              city: patientData.patient_address.city || ''
            });
          }
        } catch (error) {
          console.error('Error fetching patient data:', error);
          Alert.alert('Error', 'Failed to load profile data.');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPatientData();
  }, [userId]);

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'We need access to your photos to update your profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.2,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
        setIsImageModalVisible(true);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      Alert.alert('No Image Selected', 'Please select an image first.');
      return;
    }
    
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: selectedImage,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });

      const response = await axios.post(
        `${ip.address}/api/patient/api/${userId}/updateimage`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data && response.data.updatedPatient) {
        setProfileImage(`${ip.address}/${response.data.updatedPatient.patient_image}`);
        setSelectedImage(null);
        Alert.alert('Success', 'Profile picture updated successfully.');
        return true;
      } else {
        Alert.alert('Error', 'Failed to update profile picture. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      let errorMessage = 'Failed to upload image. Please try again.';
      if (error.response && error.response.status === 413) {
        errorMessage = 'Image is too large. Please choose a smaller image.';
      }
      Alert.alert('Error', errorMessage);
      return false;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    
    try {
      const updatedData = {
        patient_firstName: firstName,
        patient_lastName: lastName,
        patient_middleInitial: middleInitial,
        patient_contactNumber: contactNumber,
        patient_email: email,
        patient_gender: gender,
        patient_address: address
      };

      const response = await axios.put(
        `${ip.address}/api/patient/api/updateinfo/${userId}`,
        updatedData
      );

      if (response.data.success) {
        Alert.alert('Success', 'Profile information updated successfully.', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Error', response.data.message || 'Failed to update profile information.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      let errorMessage = 'An error occurred while updating the profile information.';
      
      if (error.response) {
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInput = (label, value, onChangeText) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        style={styles.input}
        onChangeText={onChangeText}
        placeholder={`Enter ${label}`}
        placeholderTextColor={theme.colors.onSurfaceVariant}
      />
    </View>
  );

  const renderDropdown = (label, value, setValue, data) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={value || `Select ${label}`}
        searchPlaceholder="Search..."
        value={value}
        onChange={item => {
          setValue(item.value);
        }}
      />
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
    title: {
      fontSize: 20,
      fontFamily: sd.fonts.bold,
      color: theme.colors.primary,
      textAlign: 'center',
      flex: 2,
    },
    profileSection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
      paddingHorizontal: 4,
    },
    imageContainer: {
      marginRight: 16,
      position: 'relative',
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    profileImageTouchable: {
      width: 120,
      height: 120,
      borderRadius: 60,
      overflow: 'hidden',
    },

    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 60,
    },
    profileActions: {
      flex: 1,
      paddingLeft: 8,
    },
    actionButtonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    uploadButton: {
      flex: 1,
      borderRadius: 8,
    },
    uploadButtonContent: {
      height: 45,
      flexDirection: 'row',
      alignItems: 'center',
    },
    uploadButtonLabel: {
      fontFamily: sd.fonts.medium,
      fontSize: 14,
    },
    badgeIcon: {
      marginRight: 8,
      backgroundColor: theme.colors.primaryContainer,
      width: 26,
      height: 26,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
    },
    uploadHint: {
      fontFamily: sd.fonts.regular,
      fontSize: 12,
      color: theme.colors.outline,
      marginTop: 4,
    },
    sectionContainer: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: sd.fonts.bold,
      color: theme.colors.primary,
      marginBottom: 16,
    },
    inputContainer: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontFamily: sd.fonts.semiBold,
      color: theme.colors.onSurfaceVariant,
      marginBottom: 4,
    },
    input: {
      height: 50,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      borderRadius: 8,
      paddingHorizontal: 12,
      fontFamily: sd.fonts.regular,
      color: theme.colors.onSurface,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
      marginBottom: 30,
    },
    cancelButton: {
      flex: 1,
      marginRight: 8,
    },
    saveButton: {
      flex: 1,
      marginLeft: 8,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    editBadge: {
      position: 'absolute',
      bottom: 5,
      right: 5,
      backgroundColor: theme.colors.primary,
      borderWidth: 2,
      borderColor: 'white',
      zIndex: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    changeButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 20,
      marginTop: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dropdown: {
      height: 50,
      borderColor: theme.colors.outline,
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
    },
    icon: {
      marginRight: 5,
    },
    placeholderStyle: {
      fontSize: 16,
      fontFamily: sd.fonts.regular,
      color: theme.colors.onSurfaceVariant,
    },
    selectedTextStyle: {
      fontSize: 16,
      fontFamily: sd.fonts.regular,
      color: theme.colors.onSurface,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
      fontFamily: sd.fonts.regular,
      color: theme.colors.onSurface,
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    modalView: {
      backgroundColor: theme.colors.background,
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
      color: theme.colors.primary,
      marginBottom: 20,
      textAlign: 'center',
    },
    previewImage: {
      width: '100%',
      height: 200,
      borderRadius: 8,
      marginBottom: 16,
    },
    buttonText: {
      fontSize: 12,
      fontFamily: sd.fonts.medium,
      color: theme.colors.onPrimary,
    },
    changePasswordButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      paddingVertical: 10,
      marginTop: 10,
      fontSize: 10,
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text>Loading profile data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ flex: 1 }}>
            <Entypo name="chevron-small-left" size={30} color={theme.colors.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
          <View style={{ flex: 1 }} />
        </View>

        <View style={styles.profileSection}>
          <View style={styles.imageContainer}>
            <TouchableOpacity 
              style={styles.profileImageTouchable} 
              onPress={pickImage}
              disabled={uploadingImage}
            >
              <Image
                source={
                  selectedImage
                    ? { uri: selectedImage }
                    : profileImage
                    ? { uri: profileImage }
                    : { uri: 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png' }
                }
                style={styles.profileImage}
              />
              
              {(uploadingImage) && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator color="white" size="small" />
                </View>
              )}
            </TouchableOpacity>
            <Badge
                size={30}
                style={styles.editBadge}
              >
                <FontAwesome5 name="pencil-alt" size={14} color="#FFF" />
              </Badge>
          </View>
          
          <View style={styles.profileActions}>
          <Button
          mode="contained"
          onPress={() => setIsModalVisible(true)}
          style={styles.changePasswordButton}
        >
          <Text style={{fontFamily: sd.fonts.regular}}>Change Password</Text>
        </Button>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          {renderInput('First Name', firstName, setFirstName)}
          {renderInput('Middle Initial', middleInitial, setMiddleInitial)}
          {renderInput('Last Name', lastName, setLastName)}
          {renderDropdown('Gender', gender, setGender, genderOptions)}
          {renderInput('Email', email, setEmail)}
          {renderInput('Contact Number', contactNumber, setContactNumber)}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Address</Text>
          {renderInput('Street', address.street, (text) => setAddress({...address, street: text}))}
          {renderInput('Barangay', address.barangay, (text) => setAddress({...address, barangay: text}))}
          {renderInput('City', address.city, (text) => setAddress({...address, city: text}))}
        </View>

        
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSave}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.saveButton}
          >
            Save Changes
          </Button>
        </View>

        <Modal
          isVisible={isImageModalVisible}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          onBackdropPress={() => setIsImageModalVisible(false)}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Preview Profile Photo</Text>
            
            <Image
              source={{ uri: selectedImage }}
              style={styles.previewImage}
            />
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setIsImageModalVisible(false);
                  setSelectedImage(null);
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.changeButton]}
                onPress={() => {
                  uploadImage();
                  setIsImageModalVisible(false);
                }}
                disabled={uploadingImage}
              >
                {uploadingImage ? (
                  <ActivityIndicator color={theme.colors.onPrimary} size="small" />
                ) : (
                  <Text style={styles.buttonText}>Upload Photo</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <ChangePasswordModal 
          isVisible={isModalVisible} 
          onClose={() => setIsModalVisible(false)} 
          email={email}
          userId={userId}
          theme={theme}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;