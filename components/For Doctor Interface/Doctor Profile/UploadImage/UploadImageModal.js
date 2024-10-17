import React, { useState } from 'react';
import { View, Text, Button, Modal, Image, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { ip } from '../../../../ContentExport';

const UploadImageModal = ({ isVisible, toggleModal, userId, setProfileImage }) => {
  const [imageUri, setImageUri] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  

  // Pick image from gallery
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission to access gallery is required!");
      return;
    }
  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImageUri = result.assets[0].uri;
      console.log(selectedImageUri); // Should log the image URI correctly
      setImageUri(selectedImageUri);  // Set the image URI state for display and upload
    }
  };
  

  // Upload the image to the server
  const handleUpload = async () => {
    if (!imageUri) {
      Alert.alert("No image selected!");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg', // Ensure this type matches the image format
      name: 'profile.jpg', // Customize image name
    });

    try {
      const response = await axios.post(`${ip.address}/api/patient/api/${userId}/updateimage`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);

      if (response.data.updatedPatient) {
        Alert.alert("Image Uploaded", response.data.message);
        setProfileImage(await response.data.updatedPatient.patient_image); // Update image in profile
        toggleModal(); // Close modal
      } else {
        Alert.alert("Upload Failed", response.data.message);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("An error occurred while uploading the image.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      onRequestClose={toggleModal}
      animationType="slide"
      transparent={true} // Set transparency
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Upload Profile Image</Text>

          <View style={styles.imageContainer}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.profileImage} />
            ) : (
              <Text>No image selected</Text>
            )}
            <TouchableOpacity onPress={pickImage} style={styles.pickImageButton}>
              <Text style={styles.pickImageText}>Pick Image</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <Button title="Upload" onPress={handleUpload} disabled={isSubmitting} />
            <Button title="Cancel" onPress={toggleModal} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UploadImageModal;

const styles = {
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalContent: {
      width: '80%',
      backgroundColor: 'white', // Modal content background
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    imageContainer: {
      marginBottom: 20,
      alignItems: 'center',
    },
    profileImage: {
      width: 150,
      height: 150,
      borderRadius: 75,
      marginBottom: 10,
    },
    pickImageButton: {
      backgroundColor: '#007BFF',
      padding: 10,
      borderRadius: 5,
    },
    pickImageText: {
      color: 'white',
      fontWeight: 'bold',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
  };
  