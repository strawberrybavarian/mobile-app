import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import RNPickerSelect from 'react-native-picker-select';
import { Entypo } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { getData } from '../../storageUtility';
import { ip } from '../../../ContentExport';
import { useTheme, Button } from 'react-native-paper';
import sd from '../../../utils/styleDictionary';

const ProfileForm = ({ navigation }) => {
  const [userId, setUserId] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [patientData, setPatientData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const theme = useTheme();
  
  // Fixed: Create styles inside the component using theme
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 16,
    },
    scrollContainer: {
      flexGrow: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      marginTop: 30,
    },
    title: {
      fontSize: 20,
      fontFamily: sd.fonts.bold,
      color: theme.colors.primary,
      textAlign: 'center',
      flex: 2,
    },
    profilePicture: {
      width: 100,
      height: 100,
      borderRadius: 50,
      alignSelf: 'center',
      marginBottom: 20,
      marginTop: 10,
    },
    inputContainer: {
      position: 'relative',
      marginBottom: 16,
    },
    label: {
      fontSize: 12,
      position: 'absolute',
      top: 8,
      left: 14,
      zIndex: 1,
      color: theme.colors.onSurfaceVariant,
      backgroundColor: 'transparent',
      paddingHorizontal: 4,
      fontFamily: sd.fonts.regular,
    },
    input: {
      height: 60,
      borderColor: theme.colors.outline,
      borderWidth: 1,
      borderRadius: 8,
      paddingLeft: 14,
      paddingTop: 25,
      paddingBottom: 8,
      fontFamily: sd.fonts.regular,
      color: theme.colors.onSurface,
    },
    calendarContainer: {
      alignItems: 'center',
      marginTop: 12,
      marginBottom: 16,
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 8,
      padding: 10,
    },
    subtitle: {
      fontSize: 16,
      marginBottom: 12,
      fontFamily: sd.fonts.medium,
      color: theme.colors.primary,
    },
    pickerContainer: {
      marginBottom: 16,
      position: 'relative',
    },
    pickerLabel: {
      fontSize: 12,
      position: 'absolute',
      top: 8,
      left: 14,
      zIndex: 1,
      color: theme.colors.onSurfaceVariant,
      backgroundColor: 'transparent',
      paddingHorizontal: 4,
      fontFamily: sd.fonts.regular,
    },
    picker: {
      height: 60,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      backgroundColor: 'transparent',
      paddingLeft: 14,
      paddingTop: 25,
      paddingBottom: 8,
      color: theme.colors.onSurface,
      fontFamily: sd.fonts.regular,
    },
    button: {
      marginVertical: 20,
      marginBottom: 40,
    },
    buttonText: {
      color: theme.colors.onPrimary,
      fontSize: 16,
      fontFamily: sd.fonts.medium,
    },
    errorText: {
      color: theme.colors.error,
      marginBottom: 16,
      fontFamily: sd.fonts.regular,
    },
    dateButton: {
      borderColor: theme.colors.primary,
      borderWidth: 1,
      borderRadius: 8,
      padding: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    dateButtonText: {
      fontFamily: sd.fonts.regular,
      color: theme.colors.onSurface,
    },
  });

  // Custom TextInput component with styled label
  const OvalLabelTextInput = ({ label, value, onChangeText, onTouch }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={(text) => onChangeText(text)}
        onTouchStart={onTouch}
      />
    </View>
  );

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getData('userId');
        if (id) {
          console.log("userId: " + id);
          setUserId(id);
        } else {
          console.log('User not found');
          setError('User not found');
        }
      } catch (err) {
        console.log(err);
        setError('Error fetching user data');
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;
    
    setLoading(true);
    
    axios.get(`${ip.address}/api/patient/api/onepatient/${userId}`)
      .then(res => {
        console.log(res.data.thePatient);
        setPatientData(res.data.thePatient);
        // If there's already a date of birth, set it
        if (res.data.thePatient.patient_dob) {
          setSelectedDate(new Date(res.data.thePatient.patient_dob));
        }
      })
      .catch(err => {
        console.log(err);
        setError('Error loading profile data');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  const handleUpdate = () => {
    if (!userId) {
      setError('User ID is missing');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // Include the selected date in the patientData
    const updatedData = {
      ...patientData,
      patient_dob: selectedDate
    };
    
    axios.put(`${ip.address}/api/patient/api/${userId}/updateinfo`, updatedData)
      .then((res) => {
        console.log('Profile updated successfully:', res.data);
        navigation.goBack();
      })
      .catch((err) => {
        console.log('Error updating profile:', err);
        setError('Failed to update profile');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setPatientData({
      ...patientData,
      patient_dob: date
    });
    setShowDatePicker(false);
  };
  
  const formatDate = (date) => {
    if (!date) return '';
    return date.toDateString();
  };
  
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ flex: 1 }}>
            <Entypo name="chevron-small-left" size={30} color={theme.colors.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
          <View style={{ flex: 1 }} />
        </View>
  
        <Image
          style={styles.profilePicture}
          source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD29ZbwcUoURx5JZQ0kEwp6y4_NmjEJhh2Z6OdKRkbUw&s' }}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
  
        <OvalLabelTextInput 
          label="First Name" 
          value={patientData.patient_firstName} 
          onChangeText={(text) => {
            setPatientData({
              ...patientData,
              patient_firstName: text
            });
          }} 
        />
        
        <OvalLabelTextInput 
          label="Last Name" 
          value={patientData.patient_lastName} 
          onChangeText={(text) => {
            setPatientData({
              ...patientData,
              patient_lastName: text
            });
          }} 
        />
  
        {/* Date selection */}
        <Text style={styles.subtitle}>Date of Birth</Text>
        <TouchableOpacity 
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {selectedDate ? formatDate(selectedDate) : 'Select date of birth'}
          </Text>
          <Entypo name="calendar" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
  
        {showDatePicker && (
          <View style={styles.calendarContainer}>
            <CalendarPicker
              onDateChange={handleDateChange}
              selectedStartDate={selectedDate}
              selectedDayColor={theme.colors.primary}
              selectedDayTextColor={theme.colors.onPrimary}
              todayBackgroundColor={theme.colors.surfaceVariant}
              todayTextStyle={{ color: theme.colors.onSurface }}
              textStyle={{ color: theme.colors.onSurface }}
              monthTitleStyle={{ fontFamily: sd.fonts.semiBold, color: theme.colors.primary }}
              yearTitleStyle={{ fontFamily: sd.fonts.medium, color: theme.colors.primary }}
              dayLabelsWrapper={{ borderTopWidth: 0, borderBottomWidth: 0 }}
              width={300}
            />
          </View>
        )}
  
        <OvalLabelTextInput 
          label="Email" 
          value={patientData.patient_email} 
          onChangeText={(text) => {
            setPatientData({
              ...patientData,
              patient_email: text
            });
          }} 
        />

        <OvalLabelTextInput 
          label="Phone Number" 
          value={patientData.patient_contactNumber} 
          onChangeText={(text) => {
            setPatientData({
              ...patientData,
              patient_contactNumber: text
            });
          }} 
        />
  
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Gender</Text>
          <RNPickerSelect
            placeholder={{ label: 'Select Gender', value: null }}
            onValueChange={(value) => setPatientData({
              ...patientData,
              patient_gender: value
            })}
            items={[
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
              { label: 'Other', value: 'other' },
            ]}
            style={{
              inputIOS: styles.picker,
              inputAndroid: styles.picker,
            }}
            value={patientData.patient_gender}
          />
        </View>
  
        {/* Submit button matching BookServices style */}
        <Button
          mode="contained"
          buttonColor={theme.colors.primary}
          textColor={theme.colors.onPrimary}
          onPress={handleUpdate}
          style={styles.button}
          loading={loading}
        >
          Save Changes
        </Button>
      </View>
    </ScrollView>
  );
};

export default ProfileForm;