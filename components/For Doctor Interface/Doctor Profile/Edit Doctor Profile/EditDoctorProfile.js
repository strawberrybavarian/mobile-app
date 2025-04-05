import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, Image, TouchableOpacity, 
  ScrollView, Alert, ActivityIndicator 
} from 'react-native';
import { 
  TextInput, Button, Badge, useTheme, Divider 
} from 'react-native-paper';
import { Entypo, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import Modal from "react-native-modal";
import axios from 'axios';
import { Dropdown } from 'react-native-element-dropdown';
import sd from '@/utils/styleDictionary';
import { ip } from '@/ContentExport';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '@/UserContext';
import ChangePasswordModal from './ChangePasswordModal'; // Add this component if needed
import DoctorScheduleModal from './DoctorScheduleModal';
import DoctorHMOsModal from './DoctorHMOsModal';
import DoctorServicesModal from './DoctorServicesModal';

const EditDoctorProfile = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { user, updateUser } = useUser();
  
  // Doctor Data States
  const [firstName, setFirstName] = useState('');
  const [middleInitial, setMiddleInitial] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  
  // Professional Info
  const [specialty, setSpecialty] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [medicalSchool, setMedicalSchool] = useState('');
  const [experience, setExperience] = useState('');
  const [hospitalAffiliation, setHospitalAffiliation] = useState('');
  const [biography, setBiography] = useState('');
  
  // Schedule and Services
  const [availableDays, setAvailableDays] = useState([]);
  const [consultationFee, setConsultationFee] = useState('');
  const [selectedHmos, setSelectedHmos] = useState([]);
  const [services, setServices] = useState([]);
  
  // Image Upload States
  const [profileImage, setProfileImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  
  // Form Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
  const [isHMOsModalVisible, setIsHMOsModalVisible] = useState(false);
  const [isServicesModalVisible, setIsServicesModalVisible] = useState(false);

  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  useEffect(() => {
    if (user) {
      axios.get(`${ip.address}/api/doctor/one/${user._id}`)
        .then((response) => {
          if (response.data && response.data.doctor) {
            const doctor = response.data.doctor;
            setFirstName(doctor.dr_firstName || '');
            setMiddleInitial(doctor.dr_middleInitial || '');
            setLastName(doctor.dr_lastName || '');
            setGender(doctor.dr_gender || '');
            setContactNumber(doctor.dr_contactNumber || '');
            setSpecialty(doctor.dr_specialty || '');
            setLicenseNo(doctor.dr_licenseNo || '');
            setMedicalSchool(doctor.dr_medicalSchool || '');
            setExperience(doctor.dr_experience ? doctor.dr_experience.toString() : '');
            setHospitalAffiliation(doctor.dr_hospitalAffiliation || '');
            setBiography(doctor.dr_biography || '');
            
            // Set HMOs and services if available
            if (doctor.dr_hmos) {
              setSelectedHmos(doctor.dr_hmos || []);
            }
            
            if (doctor.dr_services) {
              setServices(doctor.dr_services || []);
            }

            // Properly handle the image path
            if (doctor.dr_image) {
              // Check if dr_image already contains the full URL
              if (doctor.dr_image.startsWith('http')) {
                setProfileImage(doctor.dr_image);
              } else {
                // Otherwise, construct the URL correctly
                setProfileImage(`${ip.address}/${doctor.dr_image.replace(/^\//, '')}`);
              }
            }
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log("Error fetching doctor data:", err);
          setLoading(false);
          Alert.alert("Error", "Failed to load profile data. Please try again.");
        });
    } else {
      setLoading(false);
    }
  }, [user]);

  // Image picker
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

  // Upload image
  const uploadImage = async () => {
    if (!selectedImage || !user?._id) return;
    
    try {
      setUploadingImage(true);
      
      const formData = new FormData();
      formData.append('image', {
        uri: selectedImage,
        type: 'image/jpeg',
        name: 'doctor-profile.jpg',
      });
      
      const response = await axios.post(
        `${ip.address}/api/doctor/api/${user._id}/updateimage`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      if (response.data.updatedDoctor) {
        const updatedImagePath = response.data.updatedDoctor.dr_image;
        setProfileImage(`${ip.address}/${updatedImagePath}`);
        setSelectedImage(null);
        
        // Update the user context
        updateUser({
          ...user,
          dr_image: updatedImagePath
        });
        
        Alert.alert('Success', 'Profile picture updated successfully!');
      } else {
        Alert.alert('Error', 'Failed to update profile picture.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image. Please try again later.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Cancel image upload
  const handleCancelUpload = () => {
    setSelectedImage(null);
    setIsImageModalVisible(false);
  };

  // Save doctor profile
  const handleSave = async () => {
    // Basic validation
    if (!firstName || !lastName || !contactNumber || !specialty || !licenseNo) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const updatedData = {
        dr_firstName: firstName,
        dr_middleInitial: middleInitial,
        dr_lastName: lastName,
        dr_gender: gender,
        dr_contactNumber: contactNumber,
        dr_specialty: specialty,
        dr_licenseNo: licenseNo,
        dr_medicalSchool: medicalSchool,
        dr_experience: experience ? parseInt(experience) : null,
        dr_hospitalAffiliation: hospitalAffiliation,
        dr_biography: biography,
        dr_hmos: selectedHmos,
        dr_services: services
      };
      
      const response = await axios.put(
        `${ip.address}/api/doctor/api/${user._id}/updateDetails`,
        updatedData
      );
      
      if (response.data.updatedDoctor) {
        // Update the user context with new data
        updateUser({
          ...user,
          ...updatedData
        });
        
        Alert.alert(
          'Success', 
          'Profile updated successfully!',
          [
            { text: 'OK', onPress: () => navigation.goBack() }
          ]
        );
      } else {
        Alert.alert('Error', response.data.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Input field renderer
  const renderInput = (label, value, onChangeText, keyboardType = 'default', maxLength = undefined, placeholder = '') => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        mode="outlined"
        outlineColor="#E0E0E0"
        activeOutlineColor={theme.colors.primary}
        style={styles.input}
        keyboardType={keyboardType}
        maxLength={maxLength}
        placeholder={placeholder}
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

  const navigateToSchedule = () => {
    setIsScheduleModalVisible(true);
  };

  const navigateToHMOs = () => {
    setIsHMOsModalVisible(true);
  };

  const navigateToServices = () => {
    setIsServicesModalVisible(true);
  };

  if (loading || !user) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text>Loading your profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ flex: 1 }}>
            <Entypo name="chevron-small-left" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
          <View style={{ flex: 1 }} />
        </View>
        
        {/* Profile Image and Change Password Button */}
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
              size={24}
              style={styles.editBadge}
            >
              <FontAwesome5 name="pencil-alt" size={12} color="#FFF" />
            </Badge>
          </View>
          
          <View style={styles.profileActions}>
            <Button
              mode="contained"
              onPress={() => setIsPasswordModalVisible(true)}
              style={styles.changePasswordButton}
            >
              <Text style={{fontFamily: sd.fonts.regular, fontSize: 12}}>Change Password</Text>
            </Button>
          </View>
        </View>
        
        {/* Personal Information Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          {renderInput('First Name', firstName, setFirstName)}
          {renderInput('Middle Initial', middleInitial, setMiddleInitial, 'default', 1)}
          {renderInput('Last Name', lastName, setLastName)}
          {renderDropdown('Gender', gender, setGender, genderOptions)}
          {renderInput('Contact Number', contactNumber, setContactNumber, 'phone-pad', 11)}
        </View>
        
        {/* Professional Information Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Professional Information</Text>
          {renderInput('Specialty', specialty, setSpecialty)}
          {renderInput('License Number', licenseNo, setLicenseNo)}
          {renderInput('Medical School', medicalSchool, setMedicalSchool)}
          {renderInput('Years of Experience', experience, setExperience, 'numeric')}
          {renderInput('Hospital Affiliation', hospitalAffiliation, setHospitalAffiliation)}
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Biography</Text>
            <TextInput
              value={biography}
              onChangeText={setBiography}
              mode="outlined"
              outlineColor="#E0E0E0"
              activeOutlineColor={theme.colors.primary}
              style={[styles.input, { minHeight: 100 }]}
              multiline={true}
              numberOfLines={4}
            />
          </View>
        </View>
        
        {/* Doctor Schedule, HMO and Services Management */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Practice Management</Text>
          
          <TouchableOpacity 
            style={styles.managementButton}
            onPress={navigateToHMOs}
          >
            <FontAwesome5 name="hospital" size={18} color={theme.colors.primary} />
            <Text style={styles.managementButtonText}>Manage HMOs</Text>
            <Entypo name="chevron-small-right" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.managementButton}
            onPress={navigateToServices}
          >
            <MaterialIcons name="medical-services" size={18} color={theme.colors.primary} />
            <Text style={styles.managementButtonText}>Manage Services</Text>
            <Entypo name="chevron-small-right" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
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
      </KeyboardAwareScrollView>

      {/* Image Preview Modal */}
      <Modal
        isVisible={isImageModalVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        onBackdropPress={() => setIsImageModalVisible(false)}
        backdropTransitionOutTiming={0}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Preview Profile Photo</Text>
          
          <Image
            source={{ uri: selectedImage }}
            style={styles.previewImage}
          />
          
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalCancelButton]}
              onPress={handleCancelUpload}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalUploadButton]}
              onPress={() => {
                uploadImage();
                setIsImageModalVisible(false);
              }}
              disabled={uploadingImage}
            >
              {uploadingImage ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.modalUploadText}>Upload Photo</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Change Password Modal */}
      {isPasswordModalVisible && (
        <ChangePasswordModal
          isVisible={isPasswordModalVisible}
          onClose={() => setIsPasswordModalVisible(false)}
          userId={user._id}
          theme={theme}
        />
      )}

      <DoctorHMOsModal
        visible={isHMOsModalVisible}
        onClose={() => setIsHMOsModalVisible(false)}
        userId={user._id}
        selectedHmos={selectedHmos}
        onSave={(newHmos) => {
          setSelectedHmos(newHmos);
        }}
      />

      <DoctorServicesModal
        visible={isServicesModalVisible}
        onClose={() => setIsServicesModalVisible(false)}
        userId={user._id}
        services={services}
        onSave={(newServices) => {
          setServices(newServices);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: sd.fonts.bold,
    color: '#333',
    flex: 2,
    textAlign: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  imageContainer: {
    marginRight: 16,
    position: 'relative',
  },
  profileImageTouchable: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#F0F0F0',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2196F3',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileActions: {
    flex: 1,
    paddingLeft: 8,
  },
  changePasswordButton: {
    borderRadius: 8,
    paddingVertical: 6,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: sd.fonts.semiBold,
    color: '#2196F3',
    marginBottom: 12,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontFamily: sd.fonts.medium,
    color: '#333333',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    height: 45,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 24,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    borderColor: '#2196F3',
    borderWidth: 1,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#2196F3',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: sd.fonts.semiBold,
    color: '#2196F3',
    marginBottom: 16,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalCancelButton: {
    backgroundColor: '#F2F2F2',
  },
  modalUploadButton: {
    backgroundColor: '#2196F3',
  },
  modalCancelText: {
    color: '#333',
    fontSize: 14,
    fontFamily: sd.fonts.medium,
  },
  modalUploadText: {
    color: 'white',
    fontSize: 14,
    fontFamily: sd.fonts.medium,
  },
  dropdown: {
    height: 45,
    borderColor: '#E0E0E0',
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
  },
  placeholderStyle: {
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: '#999999',
  },
  selectedTextStyle: {
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: '#333333',
  },
  iconStyle: {
    width: 16,
    height: 16,
  },
  inputSearchStyle: {
    height: 36,
    fontSize: 14,
    fontFamily: sd.fonts.regular,
  },
  managementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 10,
  },
  managementButtonText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontFamily: sd.fonts.medium,
    color: '#333',
  }
});

export default EditDoctorProfile;