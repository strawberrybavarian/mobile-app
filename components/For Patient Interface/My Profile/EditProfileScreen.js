import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, useTheme, ActivityIndicator, Badge, Avatar } from 'react-native-paper';
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
  
  // Replace simple state with field validators
  const [firstName, setFirstName] = useState(createFieldValidator());
  const [middleInitial, setMiddleInitial] = useState(createFieldValidator());
  const [lastName, setLastName] = useState(createFieldValidator());
  const [contactNumber, setContactNumber] = useState(createFieldValidator());
  const [email, setEmail] = useState(createFieldValidator());
  const [gender, setGender] = useState(createFieldValidator());
  const [streetAddress, setStreetAddress] = useState(createFieldValidator());
  const [barangayAddress, setBarangayAddress] = useState(createFieldValidator());
  const [cityAddress, setCityAddress] = useState(createFieldValidator());
  const [zipCodeField, setZipCodeField] = useState(createFieldValidator());
  const [provinceField, setProvinceField] = useState(createFieldValidator());
  const [regionField, setRegionField] = useState(createFieldValidator());
  
  const [address, setAddress] = useState({
    street: '',
    barangay: '',
    city: '',
    region: '',
    province: '',
    zipCode: ''
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
    axios.get(`https://psgc.gitlab.io/api/regions/`)
      .then(res => {
        const formattedRegions = res.data.map((element) => ({
          label: element.name,
          value: element.code
        }));
        setRegionArr(formattedRegions);
      })
      .catch(err => console.log('Error fetching regions:', err));
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
          
          // Update validator objects with initial values
          setFirstName(createFieldValidator(patientData.patient_firstName || ''));
          setMiddleInitial(createFieldValidator(patientData.patient_middleInitial || ''));
          setLastName(createFieldValidator(patientData.patient_lastName || ''));
          setContactNumber(createFieldValidator(patientData.patient_contactNumber || ''));
          setEmail(createFieldValidator(patientData.patient_email || ''));
          setGender(createFieldValidator(patientData.patient_gender || ''));
          
          if (patientData.patient_address) {
            setStreetAddress(createFieldValidator(patientData.patient_address.street || ''));
            setBarangayAddress(createFieldValidator(patientData.patient_address.barangay || ''));
            setCityAddress(createFieldValidator(patientData.patient_address.city || ''));
            setZipCodeField(createFieldValidator(patientData.patient_address.zipCode || ''));
            setProvinceField(createFieldValidator(patientData.patient_address.province || ''));
            setRegionField(createFieldValidator(patientData.patient_address.region || ''));
            
            setAddress({
              street: patientData.patient_address.street || '',
              barangay: patientData.patient_address.barangay || '',
              city: patientData.patient_address.city || '',
              region: patientData.patient_address.region || '',
              province: patientData.patient_address.province || '',
              zipCode: patientData.patient_address.zipCode || ''
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

  useEffect(() => {
    if (patient?.patient_address) {
      const patientAddress = patient.patient_address;
      
      // Find region in regionArr
      const foundRegion = regionArr.find(r => 
        r.label.toLowerCase() === patientAddress.region?.toLowerCase()
      );
      
      if (foundRegion) {
        setRegion(foundRegion);
        setRegionField(createFieldValidator(foundRegion));
        
        // Fetch cities for region
        if (foundRegion.value) {
          // Check if NCR
          const isNCR = foundRegion.label.includes('National Capital Region') || foundRegion.label === 'NCR';
          
          if (isNCR) {
            // For NCR, directly fetch cities
            axios.get(`https://psgc.gitlab.io/api/regions/${foundRegion.value}/cities-municipalities`)
              .then(res => {
                const formattedCities = res.data.map(element => ({
                  label: element.name,
                  value: element.code
                }));
                setCityArr(formattedCities);
                
                // Find city in cityArr
                const foundCity = formattedCities.find(c => 
                  c.label.toLowerCase() === patientAddress.city?.toLowerCase()
                );
                
                if (foundCity) {
                  setCity(foundCity);
                  setCityAddress(createFieldValidator(foundCity));
                  
                  // Fetch barangays for the selected city
                  fetchBarangays(foundCity.value);
                }
              })
              .catch(err => console.log('Error fetching cities:', err));
          } else {
            // For non-NCR regions, fetch provinces first
            axios.get(`https://psgc.gitlab.io/api/regions/${foundRegion.value}/provinces`)
              .then(res => {
                const formattedProvinces = res.data.map(element => ({
                  label: element.name,
                  value: element.code
                }));
                setProvinceArr(formattedProvinces);
                
                // Find province in provinceArr
                const foundProvince = formattedProvinces.find(p => 
                  p.label.toLowerCase() === patientAddress.province?.toLowerCase()
                );
                
                if (foundProvince) {
                  setProvince(foundProvince);
                  setProvinceField(createFieldValidator(foundProvince));
                  
                  // Fetch cities for the selected province
                  axios.get(`https://psgc.gitlab.io/api/provinces/${foundProvince.value}/cities-municipalities`)
                    .then(res => {
                      const formattedCities = res.data.map(element => ({
                        label: element.name,
                        value: element.code
                      }));
                      setCityArr(formattedCities);
                      
                      // Find city in cityArr
                      const foundCity = formattedCities.find(c => 
                        c.label.toLowerCase() === patientAddress.city?.toLowerCase()
                      );
                      
                      if (foundCity) {
                        setCity(foundCity);
                        setCityAddress(createFieldValidator(foundCity));
                        
                        // Fetch barangays for the selected city
                        fetchBarangays(foundCity.value);
                      }
                    })
                    .catch(err => console.log('Error fetching cities:', err));
                }
              })
              .catch(err => console.log('Error fetching provinces:', err));
          }
        }
      }
      
      // Set zipCode
      if (patientAddress.zipCode) {
        setZipCodeField(createFieldValidator(patientAddress.zipCode));
      }
    }
  }, [patient, regionArr]);

  const fetchBarangays = (cityCode) => {
    axios.get(`https://psgc.gitlab.io/api/cities-municipalities/${cityCode}/barangays`)
      .then(res => {
        const formattedBarangays = res.data.map((element) => ({
          label: element.name,
          value: element.code
        }));
        setBarangayArr(formattedBarangays);
        
        // Find barangay in barangayArr if patient data is loaded
        if (patient?.patient_address?.barangay) {
          const foundBarangay = formattedBarangays.find(b => 
            b.label.toLowerCase() === patient.patient_address.barangay.toLowerCase()
          );
          
          if (foundBarangay) {
            setBarangay(foundBarangay);
            setBarangayAddress(createFieldValidator(foundBarangay));
          }
        }
      })
      .catch(err => console.log('Error fetching barangays:', err));
  };

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

  const handleFieldChange = (field, setField, validationFn, ...args) => (value) => {
    const updatedField = field.setValue(value);
    
    // Check if the field is empty after trimming whitespace
    if (value && value.trim() === '') {
      const fieldName = getFieldNameFromSetter(setField);
      updatedField.setError(`${fieldName} cannot be only spaces.`);
    } else {
      const error = validationFn ? validationFn(value, ...args) : null;
      updatedField.setError(error);
    }
    
    setField({...updatedField});
  };

  const getFieldNameFromSetter = (setterFn) => {
    const fnName = setterFn.name || '';
    
    if (fnName.startsWith('set')) {
      const fieldName = fnName.substring(3);
      return fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
    }
    
    return 'Field';
  };

  const handleFirstNameChange = (value) => {
    const updatedField = firstName.setValue(value);
    if (value && value.trim() === '') {
      updatedField.setError("First name cannot be only spaces.");
    } else {
      const error = validateFirstName(value);
      if (!error && value.length < 2) {
        updatedField.setError("First name must be at least 2 characters.");
      } else if (!error && value.length > 50) {
        updatedField.setError("First name cannot exceed 50 characters.");
      } else {
        updatedField.setError(error);
      }
    }
    setFirstName({...updatedField});
  };

  const handleMiddleInitialChange = (value) => {
    const updatedField = middleInitial.setValue(value);
    if (value && value.length > 1) {
      updatedField.setError("Middle initial should be a single character.");
    } else {
      const error = validateMiddleInitial(value);
      updatedField.setError(error);
    }
    setMiddleInitial({...updatedField});
  };

  const handleLastNameChange = (value) => {
    const updatedField = lastName.setValue(value);
    if (value && value.trim() === '') {
      updatedField.setError("Last name cannot be only spaces.");
    } else {
      const error = validateLastName(value);
      if (!error && value.length < 2) {
        updatedField.setError("Last name must be at least 2 characters.");
      } else if (!error && value.length > 50) {
        updatedField.setError("Last name cannot exceed 50 characters.");
      } else {
        updatedField.setError(error);
      }
    }
    setLastName({...updatedField});
  };

  const handleContactNumberChange = (value) => {
    const updatedField = contactNumber.setValue(value);
    const error = validateContactNumber(value);
    
    if (!error && (value.length < 10 || value.length > 11)) {
      updatedField.setError("Contact number should be 10-11 digits.");
    } else {
      updatedField.setError(error);
    }
    setContactNumber({...updatedField});
  };

  const handleGenderChange = (item) => {
    const updatedField = {...gender, touched: true, value: item.value};
    const error = validateGender(item.value);
    updatedField.setError(error);
    setGender(updatedField);
  };

  const handleStreetChange = (value) => {
    handleFieldChange(streetAddress, setStreetAddress, validateStreet)(value);
    setAddress(prev => ({...prev, street: value}));
  };
  
  const handleBarangayChange = (item) => {
    setBarangay(item);
    setAddress(prev => ({ ...prev, barangay: item.label }));
    
    const updatedBarangayField = barangayAddress.setValue(item);
    updatedBarangayField.setTouched(true);
    setBarangayAddress({...updatedBarangayField});
  };
  
  const handleCityChange = (item) => {
    setCity(item);
    setAddress(prev => ({ ...prev, city: item.label }));
    
    const updatedCityField = cityAddress.setValue(item);
    updatedCityField.setTouched(true);
    setCityAddress({...updatedCityField});
    
    fetchBarangays(item.value);
  };

  const handleProvinceChange = (item) => {
    setCity({});
    setCityArr([]);
    setBarangay({});
    setBarangayArr([]);
    
    setProvince(item);
    setAddress(prev => ({ ...prev, province: item.label }));
    
    const updatedProvinceField = provinceField.setValue(item);
    updatedProvinceField.setTouched(true);
    setProvinceField({...updatedProvinceField});
    
    axios.get(`https://psgc.gitlab.io/api/provinces/${item.value}/cities-municipalities`)
      .then(res => {
        const formattedCities = res.data.map(element => ({
          label: element.name,
          value: element.code
        }));
        setCityArr(formattedCities);
      })
      .catch(err => {
        console.log('Error fetching cities:', err);
        setCityArr([]);
      });
  };

  const handleRegionChange = (item) => {
    setProvince({});
    setProvinceArr([]);
    setCity({});
    setCityArr([]);
    setBarangay({});
    setBarangayArr([]);
    
    setRegion(item);
    setAddress(prev => ({ ...prev, region: item.label }));
    
    const updatedRegionField = regionField.setValue(item);
    updatedRegionField.setTouched(true);
    setRegionField({...updatedRegionField});
    
    const isNCR = item.label.includes('National Capital Region') || item.label === 'NCR';
    
    if (isNCR) {
      axios.get(`https://psgc.gitlab.io/api/regions/${item.value}/cities-municipalities`)
        .then(res => {
          const formattedCities = res.data.map(element => ({
            label: element.name,
            value: element.code
          }));
          setCityArr(formattedCities);
        })
        .catch(err => {
          console.log('Error fetching cities:', err);
          setCityArr([]);
        });
    } else {
      axios.get(`https://psgc.gitlab.io/api/regions/${item.value}/provinces`)
        .then(res => {
          const formattedProvinces = res.data.map((element) => ({
            label: element.name,
            value: element.code
          }));
          setProvinceArr(formattedProvinces);
        })
        .catch(err => {
          console.log('Error fetching provinces:', err);
          setProvinceArr([]);
        });
    }
  };

  const handleZipCodeChange = (value) => {
    const updatedField = zipCodeField.setValue(value);
    setZipCodeField({...updatedField});
    setAddress(prev => ({ ...prev, zipCode: value }));
  };

  const isFieldDisabled = () => {
    return daysRemaining > 0;
  };

  // Add validation functions for address fields
  const validateAddress = (value) => {
    if (!value) return "This field is required";
    if (typeof value === 'string' && value.trim() === '') return "This field is required";
    if (typeof value === 'object' && (!value.label || value.label.trim() === '')) return "This field is required";
    return null;
  };

  const handleSave = async () => {
    setFirstName({...firstName, touched: true});
    setLastName({...lastName, touched: true});
    setMiddleInitial({...middleInitial, touched: true});
    setContactNumber({...contactNumber, touched: true});
    setGender({...gender, touched: true});
    setStreetAddress({...streetAddress, touched: true});
    setRegionField({...regionField, touched: true});
    setCityAddress({...cityAddress, touched: true});
    setBarangayAddress({...barangayAddress, touched: true});
    setZipCodeField({...zipCodeField, touched: true});
    
    // Check if any required address fields are empty
    if (!region.value) {
      setRegionField({...regionField, touched: true, error: "Region is required"});
    }
    
    if (!city.value) {
      setCityAddress({...cityAddress, touched: true, error: "City/Municipality is required"});
    }
    
    if (!barangay.value) {
      setBarangayAddress({...barangayAddress, touched: true, error: "Barangay is required"});
    }
    
    if (!(region.label?.includes('National Capital Region') || region.label === 'NCR') && !province.value) {
      setProvinceField({...provinceField, touched: true, error: "Province is required"});
    }
    
    if (!zipCodeField.value) {
      setZipCodeField({...zipCodeField, touched: true, error: "ZIP Code is required"});
    }
    
    // Check for validation errors and empty required fields
    if (
      firstName.error || 
      lastName.error || 
      middleInitial.error || 
      contactNumber.error || 
      gender.error || 
      streetAddress.error ||
      regionField.error ||
      cityAddress.error ||
      barangayAddress.error || 
      zipCodeField.error ||
      !region.value ||
      !city.value ||
      !barangay.value ||
      (!province.value && !(region.label?.includes('National Capital Region') || region.label === 'NCR')) ||
      !zipCodeField.value
    ) {
      Alert.alert(
        'Validation Error', 
        'Please complete all required address fields before saving.'
      );
      return;
    }
    
    if (daysSinceLastUpdate < 30) {
      Alert.alert(
        'Update Restricted',
        `You can only update your profile every 30 days. Please try again in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}.`
      );
      return;
    }
    
    if (!showConfirmDialog) {
      setShowConfirmDialog(true);
      return;
    }
    
    setShowConfirmDialog(false);
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

  const renderInput = (label, field, onChangeText, keyboardType = 'default') => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={field.value}
        style={[
          styles.input,
          field.touched && field.error ? styles.inputError : {},
          isFieldDisabled() && styles.disabledInput
        ]}
        onChangeText={onChangeText}
        onBlur={() => {
          if (!field.touched) {
            const updatedField = {...field, touched: true};
            if (label === 'First Name') setFirstName(updatedField);
            else if (label === 'Middle Initial') setMiddleInitial(updatedField);
            else if (label === 'Last Name') setLastName(updatedField);
            else if (label === 'Contact Number') setContactNumber(updatedField);
            else if (label === 'Street') setStreetAddress(updatedField);
            else if (label === 'ZIP Code') setZipCodeField(updatedField);
          }
        }}
        placeholder={`Enter ${label}`}
        placeholderTextColor={isFieldDisabled() ? '#aaa' : theme.colors.onSurfaceVariant}
        editable={!isFieldDisabled()}
        keyboardType={keyboardType}
      />
      {field.touched && field.error && (
        <Text style={styles.errorText}>{field.error}</Text>
      )}
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
    profileImageContainer: {
      alignItems: 'center',
      marginBottom: 24,
    },
    imagePickerButton: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: '#f0f0f0',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
      position: 'relative',
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
    },
    profileImageTouchable: {
      width: 120,
      height: 120,
      borderRadius: 60,
      overflow: 'hidden',
    },

    loadingOverlay: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: sd.colors.blue,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#fff',
    },
    changePasswordButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#e0e0e0',
    },
    changePasswordText: {
      fontSize: 14,
      fontFamily: sd.fonts.medium,
      color: sd.colors.blue,
    },
    passwordIcon: {
      marginRight: 8,
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
    dropdown: {
      height: 50,
      borderColor: theme.colors.outline,
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
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
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
      marginBottom: 30,
    },
    saveButton: {
      flex: 1,
      marginLeft: 8,
    },
    disabledButton: {
      backgroundColor: '#e0e0e0',
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
          {renderInput('Street', streetAddress, handleStreetChange)}
          {renderDropdown('Region', regionField, regionArr, handleRegionChange, region)}
          
          {region.value && !(region.label.includes('National Capital Region') || region.label === 'NCR') && (
            renderDropdown('Province', provinceField, provinceArr, handleProvinceChange, province, !region.value)
          )}
          
          {renderDropdown('City/Municipality', cityAddress, cityArr, handleCityChange, city, !region.value)}
          {renderDropdown('Barangay', barangayAddress, barangayArr, handleBarangayChange, barangay, !city.value)}
          {renderInput('ZIP Code', zipCodeField, handleZipCodeChange, 'numeric')}
        </View>

        
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => {
              if (daysRemaining > 0) {
                Alert.alert(
                  'Update Restricted',
                  `You can only update your profile every 30 days. Please try again in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}.`
                );
              } else {
                setShowConfirmDialog(true);
              }
            }}
            loading={isSubmitting}
            disabled={isSubmitting || daysRemaining > 0}
            style={[styles.saveButton, daysRemaining > 0 && styles.disabledButton]}
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