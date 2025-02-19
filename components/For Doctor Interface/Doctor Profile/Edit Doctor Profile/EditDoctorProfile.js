import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, Image } from 'react-native';
import Modal from 'react-native-modal';
import axios from 'axios';
import { ip } from '../../../../ContentExport';
import { getData } from '../../../storageUtility';
import styles from './EditDoctorProfileStyles';
import sd from '../../../../utils/styleDictionary';
import UploadImageModal from '../UploadImage/UploadImageModal';
import { useFocusEffect } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';


const EditDoctorProfile = ({ isVisible, toggleModal }) => {
  const [userId, setUserId] = useState('');
  const [doctor, setDoctor] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [hospitalAffiliation, setHospitalAffiliation] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
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
      const fetchDoctorData = async () => {
        if (userId && userId !== prevUserIdRef.current) {
          try {
            const response = await axios.get(`${ip.address}/api/doctor/one/${userId}`);
            console.log('doctor:', response.data);
            setDoctor(response.data.doctor);
            setOriginalData(response.data.doctor);
            setProfileImage(response.data.doctor.dr_image); // Set profile image
            prevUserIdRef.current = userId; // Update the ref with the new userId
          } catch (error) {
            console.error("Error fetching doctor data:", error);
            // Optionally show an alert or feedback to the user
          }
        }
      };

      fetchDoctorData();
    }, [userId, isImageModalVisible]) // Dependency array ensures effect runs when userId changes
  );

  // Update state with doctor data once fetched
  useEffect(() => {
    if (doctor) {
      setFirstName(doctor.dr_firstName);
      setLastName(doctor.dr_lastName);
      setSpecialization(doctor.dr_specialty);
      setLicenseNumber(doctor.dr_licenseNo);
      setEmail(doctor.dr_email);
      setContactNumber(doctor.dr_contactNumber);
    }
  }, [doctor]);

  // Handle save changes
  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // Prepare the updated data
      const updatedData = {
        dr_firstName: firstName,
        dr_lastName: lastName,
        dr_specialty: specialization,
        dr_licenseNo: licenseNumber,
        dr_email: email,
        dr_contactNumber: contactNumber,
      };

      // Update profile info
      const response = await axios.put(
        `${ip.address}/api/doctor/api/${userId}/updateDetails`,
        updatedData
      );

      console.log('response:', response.data);

      if (response.data) {
        Alert.alert("Profile Updated", response.data.message);
        toggleModal(); // Close the modal
      } 
      else {
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
    setFirstName(originalData.dr_firstName);
    setLastName(originalData.dr_lastName);
    setSpecialization(originalData.dr_specialty);
    setLicenseNumber(originalData.dr_licenseNumber);
    setEmail(originalData.dr_email);
    setContactNumber(originalData.dr_contactNumber);
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
      <SafeAreaView style={[styles.modalContent, {flex:1, marginTop: 20}]}>
        <Text style={styles.modalTitle}>Edit Doctor Profile</Text>

        {/* Profile Image */}
        <View style={styles.imageContainer}>
            <Image
                source={
                    profileImage && doctor && doctor.dr_image 
                    ? { uri: `${ip.address}/${doctor.dr_image}` }
                    : { uri: 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png' }
                }
                style={styles.profileImage}
            />

          <TouchableOpacity style={styles.imageBadge} onPress={() => setIsImageModalVisible(true)}>
            <Text style={styles.badgeText}>+</Text>
          </TouchableOpacity>
        </View>

        {renderInput("First Name", firstName , setFirstName)}
        {renderInput("Last Name", lastName, setLastName)}
        {renderInput("Specialization", specialization , setSpecialization)}
        {renderInput("License Number", licenseNumber, setLicenseNumber)}
        {renderInput("Email",email , setEmail)}
        {renderInput("Contact Number", contactNumber, setContactNumber)}

        {/* Save and Cancel Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            mode='outlined'
            title="Cancel"
            onPress={handleCancel}
            theme={{ colors: { outline: sd.colors.blue } }}
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
      </SafeAreaView>

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

export default EditDoctorProfile;
