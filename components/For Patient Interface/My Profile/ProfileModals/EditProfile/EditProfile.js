import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, Image } from 'react-native';
import Modal from 'react-native-modal';
import axios from 'axios';
import { ip } from '../../../../../ContentExport';
import { getData } from '../../../../storageUtility';
import styles from './EditProfileStyles';
import sd from '../../../../../utils/styleDictionary';
import UploadImageModal from './UploadImageModal';
import { useFocusEffect } from '@react-navigation/native';
import { Button } from 'react-native-paper';

const EditProfile = ({ isVisible, toggleModal, setProfileData }) => {
  const [userId, setUserId] = useState('');
  const [patient, setPatient] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [middleInitial, setMiddleInitial] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [profileImage, setProfileImage] = useState(null); // Store profile image
  const [isSubmitting, setIsSubmitting] = useState(false);
  const prevUserIdRef = useRef(userId); // Ref to store the previous userId

  const [isImageModalVisible, setIsImageModalVisible] = useState(false); // Modal state for image upload

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


  useFocusEffect(
    useCallback(() => {
      const fetchPatientData = async () => {
        if (userId && userId !== prevUserIdRef.current) {
          try {
            const response = await axios.get(`${ip.address}/api/patient/api/onepatient/${userId}`);
            setPatient(response.data.thePatient);
            setOriginalData(response.data.thePatient);
            setProfileImage(response.data.thePatient.patient_image); // Set profile image
            prevUserIdRef.current = userId; // Update the ref with the new userId
          } catch (error) {
            console.error("Error fetching patient data:", error);
            // Optionally show an alert or feedback to the user
          }
        }
      };

      fetchPatientData();
    }, [userId]) // Dependency array ensures effect runs when userId changes
  );

  // Update state with patient data once fetched
  useEffect(() => {
    if (patient) {
      setFirstName(patient.patient_firstName);
      setMiddleInitial(patient.patient_middleInitial);
      setLastName(patient.patient_lastName);
      setContactNumber(patient.patient_contactNumber);
      setEmail(patient.patient_email);
      setGender(patient.patient_gender);
    }
  }, [patient]);

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
        patient_email: email,
      };

      // Update profile info
      const response = await axios.put(
        `${ip.address}/api/patient/api/updateinfo/${userId}`,
        updatedData
      );

      if (response.data.success) {
        Alert.alert("Profile Updated", response.data.message);
        setProfileData(updatedData); // Pass updated data to the parent component
        toggleModal(); // Close the modal
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
    setFirstName(originalData.patient_firstName);
    setMiddleInitial(originalData.patient_middleInitial);
    setLastName(originalData.patient_lastName);
    setContactNumber(originalData.patient_contactNumber);
    setEmail(originalData.patient_email);
    setGender(originalData.patient_gender);
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
      animationIn='slideInRight'
      animationOut="slideOutRight"
      coverScreen={true}
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Edit Profile</Text>

        {/* Profile Image */}
        <View style={styles.imageContainer}>
            <Image
                source={
                    profileImage && patient && patient.patient_image 
                    ? { uri: `${ip.address}/${patient.patient_image}` }
                    : { uri: 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png' }
                }
                style={styles.profileImage}
            />

          <TouchableOpacity style={styles.imageBadge} onPress={() => setIsImageModalVisible(true)}>
            <Text style={styles.badgeText}>+</Text>
          </TouchableOpacity>
        </View>

        {renderInput("First Name", firstName, setFirstName)}
        {renderInput("Middle Initial", middleInitial, setMiddleInitial)}
        {renderInput("Last Name", lastName, setLastName)}
        {renderInput("Contact Number", contactNumber, setContactNumber)}
        {renderInput("Email", email, setEmail)}
        {renderInput("Gender", gender, setGender)}

        {/* Save and Cancel Buttons */}
        <View style={styles.buttonContainer}>
          
          <Button
            mode='outlined'
            title="Cancel"
            onPress={handleCancel}
            theme={{colors : { outline: sd.colors.blue}}}
          >
            Cancel
          </Button>
          <Button
            mode='contained'
            onPress={handleSave}
            disabled={isSubmitting}
          >
            Save Changes
          </Button>
        </View>
      </View>

      {/* Image Upload Modal */}
      <UploadImageModal
        isVisible={isImageModalVisible}
        toggleModal={() => setIsImageModalVisible(false)}
        userId={userId}
        setProfileImage={setProfileImage} // Update image in profile
      />
    </Modal>
  );
};

export default EditProfile;
