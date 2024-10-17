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


const EditDoctorProfile = ({ isVisible, toggleModal, setProfileData }) => {
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
            const response = await axios.get(`${ip.address}/api/doctor/api/onedoctor/${userId}`);
            setDoctor(response.data.theDoctor);
            setOriginalData(response.data.theDoctor);
            setProfileImage(response.data.theDoctor.doctor_image); // Set profile image
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
      setFirstName(doctor.doctor_firstName);
      setLastName(doctor.doctor_lastName);
      setSpecialization(doctor.doctor_specialization);
      setHospitalAffiliation(doctor.doctor_hospitalAffiliation);
      setYearsOfExperience(doctor.doctor_yearsOfExperience);
      setLicenseNumber(doctor.doctor_licenseNumber);
      setEmail(doctor.doctor_email);
      setContactNumber(doctor.doctor_contactNumber);
    }
  }, [doctor]);

  // Handle save changes
  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // Prepare the updated data
      const updatedData = {
        doctor_firstName: firstName,
        doctor_lastName: lastName,
        doctor_specialization: specialization,
        doctor_hospitalAffiliation: hospitalAffiliation,
        doctor_yearsOfExperience: yearsOfExperience,
        doctor_licenseNumber: licenseNumber,
        doctor_email: email,
        doctor_contactNumber: contactNumber,
      };

      // Update profile info
      const response = await axios.put(
        `${ip.address}/api/doctor/api/updateinfo/${userId}`,
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
    setFirstName(originalData.doctor_firstName);
    setLastName(originalData.doctor_lastName);
    setSpecialization(originalData.doctor_specialization);
    setHospitalAffiliation(originalData.doctor_hospitalAffiliation);
    setYearsOfExperience(originalData.doctor_yearsOfExperience);
    setLicenseNumber(originalData.doctor_licenseNumber);
    setEmail(originalData.doctor_email);
    setContactNumber(originalData.doctor_contactNumber);
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
        <Text style={styles.modalTitle}>Edit Doctor Profile</Text>

        {/* Profile Image */}
        <View style={styles.imageContainer}>
            <Image
                source={
                    profileImage && doctor && doctor.doctor_image 
                    ? { uri: `${ip.address}/${doctor.doctor_image}` }
                    : { uri: 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png' }
                }
                style={styles.profileImage}
            />

          <TouchableOpacity style={styles.imageBadge} onPress={() => setIsImageModalVisible(true)}>
            <Text style={styles.badgeText}>+</Text>
          </TouchableOpacity>
        </View>

        {renderInput("First Name", firstName, setFirstName)}
        {renderInput("Last Name", lastName, setLastName)}
        {renderInput("Specialization", specialization, setSpecialization)}
        {renderInput("Hospital Affiliation", hospitalAffiliation, setHospitalAffiliation)}
        {renderInput("Years of Experience", yearsOfExperience, setYearsOfExperience)}
        {renderInput("License Number", licenseNumber, setLicenseNumber)}
        {renderInput("Email", email, setEmail)}
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

export default EditDoctorProfile;
