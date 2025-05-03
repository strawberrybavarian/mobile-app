import React, { useState } from 'react';
import { View, Text, Image, Alert, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import Modal from 'react-native-modal';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { ip } from '../../../../../ContentExport';
import { Button } from 'react-native-paper';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const UploadImageModal = ({ isVisible, toggleModal, userId, onImageUploadSuccess }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Pick image from library
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'We need media library access to upload photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image.');
    }
  };

  // Take photo with camera
  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'We need camera access to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo.');
    }
  };

  // Upload image to server
  const uploadImage = async () => {
    if (!selectedImage || !userId) {
      Alert.alert('Error', 'Please select an image first.');
      return;
    }

    setIsUploading(true);
    
    try {
      // Create form data
      const formData = new FormData();
      const filename = selectedImage.split('/').pop();
      
      // Determine mime type
      let type = 'image/jpeg';
      if (filename) {
        const ext = filename.split('.').pop()?.toLowerCase();
        if (ext === 'png') type = 'image/png';
        if (ext === 'gif') type = 'image/gif';
      }
      
      formData.append('image', {
        uri: Platform.OS === 'android' ? selectedImage : selectedImage.replace('file://', ''),
        name: filename || `upload-${Date.now()}.jpg`,
        type,
      });
      
      console.log('Uploading image for userId:', userId);
      
      // Send request to server
      const response = await axios.post(
        `${ip.address}/api/patient/api/${userId}/updateimage`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      console.log('Upload response:', response.data);
      
      if (response.data.success) {
        if (onImageUploadSuccess) {
          onImageUploadSuccess(response.data.imagePath);
        }
        
        setSelectedImage(null);
        toggleModal();
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Upload Failed', 'An error occurred while uploading your image.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={toggleModal}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View style={styles.modalContent}>
        <Text style={styles.title}>Upload Profile Picture</Text>
        
        {/* Preview Selected Image */}
        {selectedImage ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <FontAwesome5 name="user-circle" size={80} color="#ccc" />
            <Text style={styles.placeholderText}>Select an image</Text>
          </View>
        )}
        
        {/* Button Container */}
        <View style={styles.buttonsContainer}>
          {/* Photo Source Buttons */}
          <View style={styles.sourceButtons}>
            <Button 
              mode="contained" 
              onPress={takePhoto}
              disabled={isUploading}
              style={styles.button}
            >
              Camera
            </Button>
            
            <Button 
              mode="contained" 
              onPress={pickImage}
              disabled={isUploading}
              style={styles.button}
            >
              Gallery
            </Button>
          </View>
          
          {/* Upload Button */}
          <Button
            mode="contained"
            onPress={uploadImage}
            disabled={!selectedImage || isUploading}
            loading={isUploading}
            style={[styles.fullButton, !selectedImage && styles.disabledButton]}
          >
            Upload Photo
          </Button>
          
          {/* Cancel Button */}
          <Button
            mode="outlined"
            onPress={toggleModal}
            disabled={isUploading}
            style={styles.fullButton}
          >
            Cancel
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    paddingBottom: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  previewContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  placeholderText: {
    marginTop: 10,
    color: '#666',
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  sourceButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  button: {
    width: '48%',
  },
  fullButton: {
    width: '100%',
    marginVertical: 5,
  },
  disabledButton: {
    opacity: 0.6,
  }
});

export default UploadImageModal;
