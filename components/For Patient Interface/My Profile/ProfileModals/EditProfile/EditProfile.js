import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import axios from 'axios';
import { ip } from '../../../../../ContentExport';
import { getData } from '../../../../storageUtility';
import EditProfileStyles from './EditProfileStyles';
import sd from '../../../../../utils/styleDictionary';
import { useFocusEffect } from '@react-navigation/native';
import { Button, Badge } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import * as ImagePicker from 'expo-image-picker';

const EditProfile = ({ isVisible, toggleModal, setProfileData }) => {
  const theme = useTheme();
  const styles = EditProfileStyles(theme);

  const [userId, setUserId] = useState('');
  const [patient, setPatient] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [middleInitial, setMiddleInitial] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [gender, setGender] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const prevUserIdRef = useRef(userId);

  // Image handling states
  const [profileImage, setProfileImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  
  // Store original data to revert on cancel
  const [originalData, setOriginalData] = useState({});

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

  // Fetch patient data when userId changes
  useFocusEffect(
    useCallback(() => {
      const fetchPatientData = async () => {
        if (userId && userId !== prevUserIdRef.current) {
          try {
            const response = await axios.get(`${ip.address}/api/patient/api/onepatient/${userId}`);
            setPatient(response.data.thePatient);
            setOriginalData(response.data.thePatient);
            prevUserIdRef.current = userId;
          } catch (error) {
            console.error("Error fetching patient data:", error);
          }
        }
      };

      fetchPatientData();
    }, [userId])
  );

  // Update state with patient data once fetched
  useEffect(() => {
    if (patient) {
      setFirstName(patient.patient_firstName || '');
      setMiddleInitial(patient.patient_middleInitial || '');
      setLastName(patient.patient_lastName || '');
      setContactNumber(patient.patient_contactNumber || '');
      setGender(patient.patient_gender || '');
      
      // Set profile image
      if (patient.patient_image) {
        setProfileImage(`${ip.address}/${patient.patient_image}`);
      }
    }
  }, [patient]);

  // Image picker function - directly copied from doctor profile
  const pickImage = async () => {
    if (uploadingImage) return;
    
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to your photo library to change your profile picture.');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
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

  // Upload image function
  const uploadImage = async () => {
    if (!selectedImage || !userId) return;
    
    try {
      setUploadingImage(true);
      
      // Create form data
      const formData = new FormData();
      const filename = selectedImage.split('/').pop();
      
      formData.append('image', {
        uri: selectedImage,
        type: 'image/jpeg',
        name: filename || 'patient-profile.jpg',
      });
      
      // Make API call to upload image
      const response = await axios.post(
        `${ip.address}/api/patient/api/${userId}/updateimage`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      if (response.data.updatedPatient) {
        const updatedImagePath = response.data.updatedPatient.patient_image;
        setProfileImage(`${ip.address}/${updatedImagePath}`);
        
        // Update parent component with new image path
        if (setProfileData) {
          setProfileData(prev => ({
            ...prev,
            patient_image: updatedImagePath
          }));
        }
        
        Alert.alert('Success', 'Profile picture updated successfully!');
      } else {
        Alert.alert('Error', 'Failed to update profile picture.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image. Please try again later.');
    } finally {
      setUploadingImage(false);
      setSelectedImage(null);
      setIsImageModalVisible(false);
    }
  };

  // Cancel image upload
  const handleCancelUpload = () => {
    setSelectedImage(null);
    setIsImageModalVisible(false);
  };

  // Handle save changes
  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // Prepare the updated data
      const updatedData = {
        patient_firstName: firstName,
        patient_lastName: lastName,
        patient_middleInitial: middleInitial,
        patient_contactNumber: contactNumber,
      };

      // Update profile info
      const response = await axios.put(
        `${ip.address}/api/patient/api/updateinfo/${userId}`,
        updatedData
      );

      if (response.data.success) {
        Alert.alert("Profile Updated", response.data.message);
        setProfileData({
          ...updatedData,
          patient_image: patient?.patient_image,
        });
        toggleModal();
      } else {
        Alert.alert("Update Failed", response.data.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert("An error occurred while updating the profile.");
    }
    setIsSubmitting(false);
  };

  // Handle cancel changes
  const handleCancel = () => {
    setFirstName(originalData.patient_firstName || '');
    setMiddleInitial(originalData.patient_middleInitial || '');
    setLastName(originalData.patient_lastName || '');
    setContactNumber(originalData.patient_contactNumber || '');
    setGender(originalData.patient_gender || '');
    toggleModal();
  };

  // Render text input for fields
  const renderInput = (label, value, onChangeText) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        style={[styles.input]}
        onChangeText={onChangeText}
      />
    </View>
  );

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={toggleModal}
      onSwipeComplete={toggleModal}
      swipeDirection="right"
      animationIn="slideInRight"
      animationOut="slideOutRight"
      style={styles.modal}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <ScrollView style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Profile</Text>

          {/* Profile Image Section */}
          <View style={styles.profileSection}>
            <View style={styles.imageContainer}>
              <TouchableOpacity 
                style={styles.profileImageTouchable} 
                onPress={pickImage}
                disabled={uploadingImage}
              >
                {profileImage || selectedImage ? (
                  <Image
                    source={{ uri: selectedImage || profileImage }}
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={[styles.profileImage, styles.avatarContainer]}>
                    <FontAwesome5 name="user-circle" size={70} color="#CCCCCC" />
                  </View>
                )}
                
                {uploadingImage && (
                  <View style={styles.loadingOverlay}>
                    <ActivityIndicator color="white" size="small" />
                  </View>
                )}
              </TouchableOpacity>
              <Badge
                size={24}
                style={styles.editBadge}
              >
                <FontAwesome5 name="pencil-alt" size={12} color="#FFF" />
              </Badge>
            </View>
          </View>

          {renderInput("First Name", firstName, setFirstName)}
          {renderInput("Middle Initial", middleInitial, setMiddleInitial)}
          {renderInput("Last Name", lastName, setLastName)}
          {renderInput("Contact Number", contactNumber, setContactNumber)}
          {renderInput("Gender", gender, setGender)}

          {/* Save and Cancel Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              mode='outlined'
              onPress={handleCancel}
              style={styles.actionButton}
              theme={{colors: { outline: sd.colors.blue}}}
            >
              Cancel
            </Button>
            <Button
              mode='contained'
              onPress={handleSave}
              disabled={isSubmitting}
              style={styles.actionButton}
              loading={isSubmitting}
            >
              Save Changes
            </Button>
          </View>
        </ScrollView>

        {/* Image Preview Modal */}
        <Modal
          isVisible={isImageModalVisible}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          onBackdropPress={() => setIsImageModalVisible(false)}
          backdropTransitionOutTiming={0}
        >
          <View style={{
            backgroundColor: 'white',
            borderRadius: 10,
            padding: 20,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}>
            <Text style={styles.modalTitle}>Preview Profile Photo</Text>
            
            <Image
              source={{ uri: selectedImage }}
              style={{
                width: 200,
                height: 200,
                borderRadius: 100,
                marginBottom: 20,
              }}
            />
            
            <View style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
            }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: 5,
                  backgroundColor: '#F2F2F2',
                }}
                onPress={handleCancelUpload}
              >
                <Text style={{
                  color: '#333',
                  fontSize: 14,
                  fontFamily: sd.fonts.medium,
                }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: 5,
                  backgroundColor: '#2196F3',
                }}
                onPress={() => {
                  uploadImage();
                }}
                disabled={uploadingImage}
              >
                {uploadingImage ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={{
                    color: 'white',
                    fontSize: 14,
                    fontFamily: sd.fonts.medium,
                  }}>Upload Photo</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </Modal>
  );
};

export default EditProfile;