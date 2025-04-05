import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { Avatar, Button, Card, DataTable, Dialog, Portal, Paragraph, TextInput, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import CalendarPicker from 'react-native-calendar-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getData } from '../../storageUtility';
import { ip } from '../../../ContentExport';
import sd from '../../../utils/styleDictionary';
import { formatTime } from '../../../utils/formatTime';
import { useTheme } from 'react-native-paper';
import BookAppointmentStyles from './BookAppointmentStyles';
import { Entypo } from '@expo/vector-icons';
import { useUser } from '@/UserContext';
import { storeData } from '../../storageUtility';
import { useRoute } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import { FlatList } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Modal } from 'react-native';

const BookAppointment = ({ navigation, route }) => {
  const { user } = useUser(); // Use the hook to get authenticated user
  const [reason, setReason] = useState("");
  const [patient, setPatient] = useState({});
  const [availableTimes, setAvailableTimes] = useState([]);
  const [availability, setAvailability] = useState({});
  const [imageUri, setImageUri] = useState(null);
  const [doctorName, setDoctorName] = useState("");
  const [bookedPatients, setBookedPatients] = useState({
    morning: 0,
    afternoon: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  const { item, serviceData, isServiceAppointment } = route.params;
  const theme = useTheme();
  const styles = BookAppointmentStyles(theme);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const [availableServices, setAvailableServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [selectedService, setSelectedService] = useState(
    serviceData || { name: "Consultation", category: "General" }
  );
  const [showDateModal, setShowDateModal] = useState(false);
  const [loadingTimes, setLoadingTimes] = useState(false);

  const appointmentTypeText = selectedService ? selectedService.name : "Consultation";
  const appointmentCategoryText = selectedService ? selectedService.category : "General";

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
    
    // Also fetch times for the modal
    if (showDateModal) {
      fetchAvailableTimesForModal(date);
    }
  };
  useEffect(() => {
    console.log(item);
    
    // Fetch doctor's availability and name
    axios
      .get(`${ip.address}/api/doctor/${item._id}`)
      .then((response) => {
        const doctor = response.data.doctor;
        setDoctorName(`${doctor.dr_firstName} ${doctor.dr_lastName}`);
        setAvailability(doctor.availability || {});
        setImageUri(`${ip.address}/${doctor.dr_image}`);
      })
      .catch((err) => {
        console.log("Error fetching doctor data:", err);
        Alert.alert("Error", "Failed to load doctor information");
      });
  }, [item]);

  // Update the useEffect function that loads user data:

// Update the user data loading effect

useEffect(() => {
  // Only try to fetch patient data if we have a user
  if (user && user._id) {
    console.log("User available, fetching patient data");
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(`${ip.address}/api/patient/api/onepatient/${user._id}`);
        console.log("Patient data loaded successfully");
        setPatient(response.data.thePatient);
      } catch (err) {
        console.log("Error fetching patient data:", err);
        
        // Check specifically for auth error
        if (err.response && err.response.status === 401) {
          // Get stored token as a backup
          const storedToken = await getData("authToken");
          
          if (storedToken) {
            // Try to restore token
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            console.log("Attempting to restore session from stored token");
            
            // Try the request again
            try {
              const retryResponse = await axios.get(`${ip.address}/api/patient/api/onepatient/${user._id}`);
              setPatient(retryResponse.data.thePatient);
              return; // Exit if successful
            } catch (retryErr) {
              console.log("Retry failed, token may be invalid");
            }
          }
          
          // Check current route using navigation state instead of getCurrentRoute
          const currentRouteName = navigation.getState().routes[navigation.getState().index].name;
          if (currentRouteName !== "SigninPage") {
            Alert.alert(
              "Session Expired", 
              "Your session has expired. Please sign in again.",
              [{ text: "OK", onPress: () => navigation.navigate("SigninPage") }]
            );
          }
        } else {
          Alert.alert("Error", "Failed to load your profile");
        }
      }
    };
    
    fetchPatientData();
  } else {
    // Don't immediately alert/redirect - check current screen first
    console.log("No authenticated user");
    
    // Check current route using navigation state
    const currentRouteName = navigation.getState().routes[navigation.getState().index].name;
    if (currentRouteName !== "SigninPage") {
      Alert.alert(
        "Authentication Required", 
        "Please sign in to book an appointment",
        [{ text: "OK", onPress: () => navigation.navigate("SigninPage") }]
      );
    }
  }
}, [user?._id, navigation]); // Add navigation back to dependencies

  
  useEffect(() => {
    if (selectedDate) {
      const fetchAppointments = async () => {
        try {
          setLoading(true); // Set loading before fetching data

          const daysOfWeek = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
          ];
          const day = daysOfWeek[selectedDate.getDay()];
  
          // Fetch booked patients for the selected date
          const response = await axios.get(
            `${ip.address}/api/appointments/doctor/${item._id}/count?date=${selectedDate}`
          );
  
          console.log("Booked patients API response:", response.data, selectedDate);
          const { morning, afternoon } = response.data;
  
          setBookedPatients({ morning, afternoon });
  
          // Once booked patients are set, update the available times
          const updatedTimes = getAvailableTimes(day, morning, afternoon);
          setAvailableTimes(updatedTimes);
  
        } catch (err) {
          console.log("Error fetching appointments:", err);
        } finally {
          setLoading(false); // Always set loading to false after fetching
        }
      };
  
      fetchAppointments(); // Invoke the async function
      console.log('xxx:', availableTimes);
    } else {
      setAvailableTimes([]); // Reset if no date selected
      setLoading(false); // Ensure loading state is set to false
    }
  }, [selectedDate, availability, item._id]);

  useEffect(() => {
    axios
      .get(`${ip.address}/api/doctor/${item._id}/available`)
      .then((res) => {
        setAvailability(res.data.availability);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [item]);

  const getAvailableTimes = (day, morningCount = 0, afternoonCount = 0) => {
    const dayAvailability = availability[day];
    if (!dayAvailability) return [];

    let times = [];

    if (dayAvailability.morning?.available) {
      const startTime = formatTime(dayAvailability.morning.startTime);
      const endTime = formatTime(dayAvailability.morning.endTime);
      const availableSlots = Math.max(
        dayAvailability.morning.maxPatients - morningCount,
        0
      );

      if (availableSlots > 0) {
        times.push({
          label: "Morning",
          timeRange: `${startTime} - ${endTime}`,
          availableSlots,
          period: "morning",
        });
      }
    }

    if (dayAvailability.afternoon?.available) {
      const startTime = formatTime(dayAvailability.afternoon.startTime);
      const endTime = formatTime(dayAvailability.afternoon.endTime);
      const availableSlots = Math.max(
        dayAvailability.afternoon.maxPatients - afternoonCount,
        0
      );

      if (availableSlots > 0) {
        times.push({
          label: "Afternoon",
          timeRange: `${startTime} - ${endTime}`,
          availableSlots,
          period: "afternoon",
        });
      }
    }
    return times;
  };

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  const createAppointment = () => {
    if (!selectedDate || !selectedHour) {
      Alert.alert("Invalid Selection", "Please select a valid date and time for the appointment.");
      return;
    }
    showDialog();
  };

  // Replace the entire confirmAppointment function with this version that will solve your issues:

// Complete the confirmAppointment function in BookAppointment.jsx:

const confirmAppointment = async () => {
  try {
    // Get stored token directly
    const storedToken = await getData("authToken");
    const userRole = await getData("userRole");
    
    if (!storedToken) {
      Alert.alert("Session Expired", "Please sign in again.");
      navigation.navigate("SigninPage");
      return;
    }
    
    // Format the date properly for the API
    const formattedDate = selectedDate.toISOString().split('T')[0];
    
    const formData = {
      doctor: item._id,
      patient: user._id,
      date: formattedDate,
      time: selectedHour,
      reason: reason,
      appointment_type: {
        appointment_type: appointmentTypeText,
        category: appointmentCategoryText,
      },
      // Include role explicitly for mobile apps
      _role: userRole,
      // Add service reference if this is a service appointment
      ...(isServiceAppointment && { serviceId: serviceData._id })
    };
    
    console.log("Appointment data:", JSON.stringify(formData, null, 2));
    
    // Use the built-in fetch API instead of axios
    const response = await fetch(`${ip.address}/api/patient/api/${user._id}/createappointment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${storedToken}`
      },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.log("Response error:", response.status, errorData);
      throw new Error(errorData.message || "Failed to create appointment");
    }
    
    const data = await response.json();
    console.log("Appointment created successfully:", data);
    
    // Hide dialog first
    hideDialog();
    
    // Update UI
    const updatedAvailableTimes = availableTimes.map((slot) => {
      if (slot.timeRange === selectedHour) {
        return { ...slot, availableSlots: slot.availableSlots - 1 };
      }
      return slot;
    });
    
    setAvailableTimes(updatedAvailableTimes);
    
    // Show success message
    Alert.alert(
      "Success", 
      "Appointment created successfully!", 
      [{ text: "OK", onPress: () => navigation.goBack() }]
    );
    
  } catch (err) {
    console.error("Appointment creation error:", err.message);
    
    if (err.message.includes("401") || err.message.includes("Unauthorized")) {
      // Try silent re-login
      try {
        const userEmail = await getData("userEmail");
        const userPassword = await getData("userPassword");
        
        if (userEmail && userPassword) {
          Alert.alert(
            "Session Expired",
            "Please try signing in again.",
            [{ text: "OK", onPress: () => navigation.navigate("SigninPage") }]
          );
        } else {
          navigation.navigate("SigninPage");
        }
      } catch (loginErr) {
        console.error("Login retry failed:", loginErr);
        navigation.navigate("SigninPage");
      }
    } else {
      Alert.alert("Booking Failed", err.message || "Could not create appointment");
    }
  }
};

  // Add these functions to your component (before the return statement)
const openDateModal = () => {
  setShowDateModal(true);
  if (selectedDate) {
    // Trigger time loading if date already selected
    fetchAvailableTimesForModal(selectedDate);
  }
};

const closeDateModal = () => {
  setShowDateModal(false);
};

const handleTimeSelection = (time) => {
  setSelectedHour(time.timeRange);
};

const fetchAvailableTimesForModal = async (date) => {
  setLoadingTimes(true);
  try {
    const daysOfWeek = [
      "sunday", "monday", "tuesday", "wednesday", 
      "thursday", "friday", "saturday"
    ];
    const day = daysOfWeek[date.getDay()];

    // Fetch booked patients for the selected date
    const response = await axios.get(
      `${ip.address}/api/appointments/doctor/${item._id}/count?date=${date}`
    );
    
    const { morning, afternoon } = response.data;
    
    // Use your existing function to get available times
    const times = getAvailableTimes(day, morning, afternoon);
    setAvailableTimes(times);
  } catch (error) {
    console.error('Error fetching available times:', error);
    Alert.alert("Error", "Failed to load available times for this date");
  } finally {
    setLoadingTimes(false);
  }
};

  useEffect(() => {
    const fetchServices = async () => {
      setServicesLoading(true);
      try {
        const response = await axios.get(`${ip.address}/api/services`);
        
        if (response.data && response.data.services) {
          // Make sure consultation is always available
          const hasConsultation = response.data.services.some(
            service => service.name === "Consultation"
          );
          
          const services = hasConsultation 
            ? response.data.services 
            : [{ _id: 'consultation', name: 'Consultation', category: 'General' }, ...response.data.services];
            
          setAvailableServices(services);
        } else {
          setAvailableServices([
            { _id: 'consultation', name: 'Consultation', category: 'General' },
            { _id: 'laboratory', name: 'Laboratory', category: 'Diagnostics' },
            { _id: 'vaccination', name: 'Vaccination', category: 'Preventive' },
          ]);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        // Set default services
        setAvailableServices([
          { _id: 'consultation', name: 'Consultation', category: 'General' },
          { _id: 'laboratory', name: 'Laboratory', category: 'Diagnostics' },
          { _id: 'vaccination', name: 'Vaccination', category: 'Preventive' },
        ]);
      } finally {
        setServicesLoading(false);
      }
    };
    
    
    fetchServices();
  }, []);

  // Replace your ServiceSelectionSection with this dropdown version
  const ServiceSelectionSection = () => {
    const isFromDoctorSelection = !!item; // Check if we have doctor item to determine flow
    
    return (
      <View style={{marginBottom: 30}}>
        <Text style={styles.subtitle}>
          {isFromDoctorSelection ? "Service" : "Select Service"}
        </Text>
        
        
      </View>
    );
  };
// Update your main return statement to be context-aware
return (
  <SafeAreaView style={styles.container}>
    <KeyboardAwareScrollView style={styles.scrollContainer}>
      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ flex: 1 }}>
          <Entypo name="chevron-small-left" size={30} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Book Appointment</Text>
        <View style={{ flex: 1 }} />
      </View>

      {/* Only show doctor info if there is an item (doctor-first flow) */}
      {item ? (
        <>
          {/* Doctor card */}
          <View style={{marginBottom: 10}}>
            <Card 
              style={styles.card}
              mode='elevated'
            >
              <Card.Content style={styles.doctorInfo}>
                <Avatar.Image size={80} source={{ uri: imageUri }} />
                <View style={styles.doctorDetails}>
                  <Text style={styles.drName}>{`Dr. ${item.dr_firstName} ${item.dr_lastName}`}</Text>
                  <Text style={styles.drSpecialty}>{item.dr_specialty}</Text>
                </View>
              </Card.Content>
              <Card.Actions>
                <Button
                  mode='outlined'
                  textColor={theme.colors.onSurface}
                  labelStyle={{ fontFamily: sd.fonts.semiBold}}
                  onPress={() => navigation.navigate('aboutdoctor', {item: item})}
                >
                  View Profile
                </Button>
              </Card.Actions>
            </Card>
          </View>

<View style={{marginBottom: 16}}>
  <Text style={styles.subtitle}>Doctor's Schedule</Text>
  <Card style={[
    styles.scheduleCard,
    { backgroundColor: 'white' }  // Force white background
  ]}>
    <Card.Content>
      <View style={styles.scheduleContainer}>
        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
          const dayAvail = availability[day];
          const hasMorning = dayAvail?.morning?.available;
          const hasAfternoon = dayAvail?.afternoon?.available;
          const isAvailable = hasMorning || hasAfternoon;
          
          return (
            <View key={day} style={styles.daySchedule}>
              <Text style={styles.dayName}>
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </Text>
              
              {!isAvailable ? (
                <View style={styles.unavailableContainer}>
                  <Text style={styles.unavailableText}>Not Available</Text>
                </View>
              ) : (
                <View style={styles.timePeriodsContainer}>
                  {hasMorning && (
                    <View style={styles.timePeriod}>
                      <FontAwesome5 name="sun" size={12} color={theme.colors.primary} style={styles.timeIcon} />
                      <Text style={styles.timeText}>
                        {formatTime(dayAvail?.morning?.startTime)} - {formatTime(dayAvail?.morning?.endTime)}
                      </Text>
                    </View>
                  )}
                  
                  {hasAfternoon && (
                    <View style={styles.timePeriod}>
                      <FontAwesome5 name="moon" size={12} color={theme.colors.primary} style={styles.timeIcon} />
                      <Text style={styles.timeText}>
                        {formatTime(dayAvail?.afternoon?.startTime)} - {formatTime(dayAvail?.afternoon?.endTime)}
                      </Text>
                    </View>
                  )}
                </View>
              )}
              
              <Divider style={isAvailable === false ? styles.unavailableDivider : styles.availableDivider} />
            </View>
          );
        })}
      </View>
      
      <Text style={styles.scheduleTip}>
        Tap "Choose Date & Time" below to select your preferred appointment slot
      </Text>
    </Card.Content>
  </Card>
</View>

          {/* Date selection button - opens modal */}
          <Text style={styles.subtitle}>Select Date & Time</Text>
          <Button
            mode="outlined"
            onPress={openDateModal}
            style = {{borderColor: theme.colors.primary, borderWidth: 2}}
            buttonColor={theme.colors.surface}
            textColor={theme.colors.onSurface}
            icon="calendar"
          >
            {selectedDate && selectedHour 
              ? `${selectedDate.toLocaleDateString()} at ${selectedHour}`
              : 'Choose Date & Time'}
          </Button>

          {/* Date/Time Selection Modal */}
          <Modal
            visible={showDateModal}
         
            transparent={true}
            onRequestClose={closeDateModal}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Date & Time</Text>
                  <TouchableOpacity onPress={closeDateModal}>
                    <Entypo name="cross" size={24} color={theme.colors.primary} />
                  </TouchableOpacity>
                </View>
                
                <CalendarPicker
                  onDateChange={handleDateChange}
                  selectedStartDate={selectedDate}
                  minDate={new Date()}
                  textStyle={styles.calendarText}
                  todayBackgroundColor={theme.colors.surfaceVariant}
                  selectedDayColor={theme.colors.primary}
                  selectedDayTextColor={theme.colors.onPrimary}
                  monthTitleStyle={styles.calendarMonthTitle}
                  yearTitleStyle={styles.calendarYearTitle}
                  dayLabelsWrapper={styles.calendarDayLabels}
                />

                <Text style={styles.modalSubtitle}>Available Times</Text>
                
                {loadingTimes ? (
                  <ActivityIndicator size="large" color={theme.colors.primary} style={{marginVertical: 20}} />
                ) : (
                  availableTimes.length > 0 ? (
                    <View style={styles.timeButtonsContainer}>
                      {availableTimes.map((slot, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.timeButton,
                            selectedHour === slot.timeRange && styles.selectedTimeButton
                          ]}
                          onPress={() => handleTimeSelection(slot)}
                        >
                          <Text style={[
                            styles.timeButtonText,
                            selectedHour === slot.timeRange && styles.selectedTimeButtonText
                          ]}>
                            {slot.timeRange}
                            {slot.availableSlots > 1 && (
                              <Text style={styles.slotsText}> ({slot.availableSlots} slots)</Text>
                            )}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.noTimesText}>No available slots for this date.</Text>
                  )
                )}

                <Button
                  mode="contained"
                  onPress={closeDateModal}
                  style={styles.modalCloseButton}
                  labelStyle={styles.modalCloseButtonText}
                  disabled={!selectedDate || !selectedHour}
                >
                  Confirm Selection
                </Button>
              </View>
            </View>
          </Modal>

          {/* reason card - only show if doctor selected */}
          <View style={{marginBottom: 40}}>
            <Text style={styles.subtitle}>Reason for Appointment</Text>
            <TextInput
              mode="outlined"
              multiline
              value={reason}
              onChangeText={setReason}
              style={styles.textArea}
            />
          </View>

          {/* submit button - only show if doctor selected */}
          <Button
            mode='elevated'
            buttonColor={theme.colors.primary}
            textColor={theme.colors.onPrimary}
            onPress={createAppointment}
            style={{marginVertical: 20, marginBottom: 100}}
          >
            Submit
          </Button>
        </>
      ) : (
        /* Service-first flow - show service info and button to select doctor */
        <View style={styles.serviceFirstContainer}>
          <View style={styles.serviceHighlight}>
            <FontAwesome5 
              // name={getServiceIcon(selectedService)} 
              size={48} 
              color={theme.colors.primary}
            />
            <Text style={styles.serviceHighlightTitle}>{selectedService?.name}</Text>
            <Text style={styles.serviceHighlightCategory}>{selectedService?.category || 'General'}</Text>
            <Text style={styles.serviceDescription}>
              {selectedService?.description || 'Please select a doctor for this service to continue with your booking.'}
            </Text>
          </View>
          
          <Button
            mode="contained"
            buttonColor={theme.colors.primary}
            textColor={theme.colors.onPrimary}
            onPress={() => navigation.navigate('doctorspecialty', { 
              serviceData: selectedService,
              isServiceAppointment: true
            })}
            style={styles.findDoctorButton}
          >
            Find Available Doctors
          </Button>
        </View>
      )}
    </KeyboardAwareScrollView>
    
    {/* Dialog remains the same */}
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Title>Confirm Appointment</Dialog.Title>
        <Dialog.Content>
          <Paragraph>Doctor: {doctorName}</Paragraph>
          <Paragraph>
            Service: {selectedService?.name} 
            <Text style={{fontStyle: 'italic', color: '#666'}}>
              {" "}- {selectedService?.category || 'General'}
            </Text>
          </Paragraph>
          <Paragraph>Date: {selectedDate?.toLocaleDateString()}</Paragraph>
          <Paragraph>Time: {selectedHour}</Paragraph>
          <Paragraph>Reason: {reason}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>Cancel</Button>
          <Button onPress={confirmAppointment}>Confirm</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  </SafeAreaView>
);
};

// Replace the response interceptor with this more forgiving version:
const responseInterceptor = axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      !error.config.url.includes('/api/verify-token') &&
      !error.config.url.includes('/createappointment') && // Don't logout during appointment creation
      !error.config._isRetry // Prevent infinite retry loops
    ) {
      console.log("401 error detected in non-appointment endpoint");
      
      try {
        // Try to refresh token first
        const storedToken = await getData('authToken');
        const userId = await getData('userId');
        
        if (storedToken && userId) {
          // Mark this request as a retry
          error.config._isRetry = true;
          
          // Try the request again with the existing token
          return axios(error.config);
        } else {
          console.log("No stored credentials for refresh, logging out");
          logout();
        }
      } catch (refreshErr) {
        console.log("Token refresh failed:", refreshErr);
        // Don't auto-logout on every error
      }
    }
    return Promise.reject(error);
  }
);


export default BookAppointment;