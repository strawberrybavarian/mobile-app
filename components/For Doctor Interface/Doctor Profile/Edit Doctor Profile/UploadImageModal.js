import React, { useState } from 'react';
import { View, Text, Button, Modal, Image, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { ip } from '../../../../ContentExport';
import sd from '../../../../utils/styleDictionary';

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
      quality: 0.2,
    });
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Upload the image
  const handleUpload = async () => {
    if (!imageUri) {
      Alert.alert("Please select an image first");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'doctor-profile.jpg',
      });

      // Note: API endpoint for doctor image uploads
      const response = await axios.post(
        `${ip.address}/api/doctor/api/${userId}/updateimage`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('response ',response);

      if (response.data.updatedDoctor) {
        Alert.alert("Image Uploaded", response.data.message);
        setProfileImage(response.data.updatedDoctor.dr_image); // Update image in profile
        toggleModal(); // Close modal
      } else {
        Alert.alert("Upload Failed", response.data.message || "Failed to upload image");
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
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Upload Profile Image</Text>

          <View style={styles.imageContainer}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.profileImage} />
            ) : (
              <Text style={styles.noImageText}>No image selected</Text>
            )}
            
            {isSubmitting && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#FFF" />
              </View>
            )}
            
            <TouchableOpacity onPress={pickImage} style={styles.pickImageButton} disabled={isSubmitting}>
              <Text style={styles.pickImageText}>Pick Image</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.uploadButton, isSubmitting || !imageUri ? styles.disabledButton : {}]} 
              onPress={handleUpload} 
              disabled={isSubmitting || !imageUri}
            >
              <Text style={styles.buttonText}>Upload</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={toggleModal} 
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: sd.fonts.semiBold,
    color: sd.colors.blue,
    marginBottom: 20,
    textAlign: 'center',
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  profileImage: {
    width: 180,
    height: 180,
    borderRadius: 90,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  noImageText: {
    fontSize: 16,
    fontFamily: sd.fonts.regular,
    color: '#757575',
    marginBottom: 20,
    marginTop: 10,
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
    borderRadius: 90,
  },
  pickImageButton: {
    backgroundColor: sd.colors.blue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  pickImageText: {
    color: 'white',
    fontFamily: sd.fonts.medium,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
    marginHorizontal: 5,
  },
  uploadButton: {
    backgroundColor: sd.colors.blue,
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
    opacity: 0.7,
  },
  buttonText: {
    fontFamily: sd.fonts.medium,
    fontSize: 16,
    color: '#FFF',
  },
};

export default UploadImageModal;