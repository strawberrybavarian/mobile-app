import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import axios from 'axios';
import { Avatar, Button, Card, DataTable, Dialog, Portal, Paragraph, TextInput } from 'react-native-paper';
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
  const { item } = route.params;
  const theme = useTheme();
  const styles = BookAppointmentStyles(theme);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
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
        appointment_type: "Consultation",
        category: "General",
      },
      // Include role explicitly for mobile apps
      _role: userRole
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

  const renderAvailableHours = () => {
    console.log('availableTimes:', availableTimes);
    return availableTimes.map((slot, index) => (
      <Button
        key={index}
        mode={selectedHour === slot.timeRange ? 'elevated' : 'outlined'}
        buttonColor={selectedHour === slot.timeRange ? theme.colors.primary : theme.colors.surface}
        textColor={selectedHour === slot.timeRange ? theme.colors.onPrimary : theme.colors.primary}
        onPress={() =>
          setSelectedHour(selectedHour === slot.timeRange ? null : slot.timeRange)
        }      
      >
       {availableTimes.length > 0 ? slot.timeRange : 'No slots for this day.'}
       {selectedHour === slot.timeRange ? <Entypo name="check" size={24} style={{margin: 10}}/> : null}
      </Button>
    ));
  };

  const renderMorningAvailability = (day) => {
    const dayAvailability = availability[day] || {};
    return dayAvailability.morning?.available
      ? `${formatTime(dayAvailability.morning.startTime)} - ${formatTime(dayAvailability.morning.endTime)}`
      : "Not available";
  };
  
  const renderAfternoonAvailability = (day) => {
    const dayAvailability = availability[day] || {};
    return dayAvailability.afternoon?.available
      ? `${formatTime(dayAvailability.afternoon.startTime)} - ${formatTime(dayAvailability.afternoon.endTime)}`
      : "Not available";
  };

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

    <View style = {{marginBottom: 10}}>

    {/* doctor card */}

    {item && (
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
            mode = 'outlined'
            //buttonColor={theme.colors.secondary}
            textColor={theme.colors.onSurface}
            labelStyle = {{ fontFamily: sd.fonts.semiBold}}
            onPress = {() => navigation.navigate('aboutdoctor', {item})}
          >
            View Profile
          </Button>
        </Card.Actions>
      </Card>
    )}
    </View>

    {/* availability card */}

    <Text style={styles.subtitle}>Availability</Text>
    <Card style={[styles.card, {padding: 0, marginBottom: 30}]}>
      <Card.Content style={{paddingHorizontal:0, paddingVertical:0}}> 
        <DataTable 
          style={styles.dataTableView}
          theme={{ colors: { text: theme.colors.onSurface } }}
        >
          <DataTable.Header
            style={styles.dataTableHeaderView}
            theme = {theme}
          >
            <DataTable.Title textStyle={[styles.dataTableHeaderText, {flex : 0.7}]}>Day</DataTable.Title>
            <DataTable.Title textStyle={styles.dataTableHeaderText}>Morning</DataTable.Title>
            <DataTable.Title textStyle={styles.dataTableHeaderText}>Afternoon</DataTable.Title>
          </DataTable.Header> 
          {days
          .filter((day) => 
            availability[day]?.morning?.available || availability[day]?.afternoon?.available
          )
          .map((day) => (
            <DataTable.Row key={day} style={{height: 50}}>
              <DataTable.Cell style = {[styles.dataTableCell, {flex: 0.7}]}>
                <Text style = {styles.dataTableText}>
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell style = {styles.dataTableCell}>
                <Text style = {styles.dataTableText}>
                  {renderMorningAvailability(day)}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell style = {styles.dataTableCell}>
                <Text style = {styles.dataTableText}>
                  {renderAfternoonAvailability(day)}
                </Text>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </Card.Content>
    </Card>

    {/* date card */}

    <View style = {{marginBottom: 10}}>
    <Text style={styles.subtitle}>Select a Date</Text>
    <Button
      mode='elevated'
      onPress={() => setShowDatePicker(!showDatePicker)}
      buttonColor= {theme.colors.primary}
      textColor={theme.colors.onPrimary}
      style = {{marginVertical: 10}}
    >
      {selectedDate ? new Date(selectedDate).toLocaleDateString() : 'Choose a Date'}
    </Button>
    
    {showDatePicker ? (
      <View style = {{padding : 20}}>
        <CalendarPicker
          initialDate={selectedDate ? selectedDate : new Date()}
          onDateChange={handleDateChange}
          selectedStartDate={selectedDate}
          minDate={new Date()}
          style = {{padding : 20, marginVertical: 10}}
        />
      </View>
    ) : null}
    </View>

    {/* hour card */}

    <View style = {{marginBottom: 40}}>
      <Text style={styles.subtitle}>Select Hour</Text>
      {loading ? (
        <Text>Loading available times...</Text>
      ) : (
        <View>{ 
          availableTimes.length === 0 ? 
          <Text style = {{color : theme.colors.error, fontSize: sd.fonts.small, fontFamily: sd.fonts.italic}}>No available slots for this day.</Text> :
          renderAvailableHours()
          }
        </View>
      )}
    </View>

    {/* reason card */}

    <View style = {{marginBottom: 40}}>
    <Text style={styles.subtitle}>Reason for Appointment</Text>
    <TextInput
      mode="outlined"
      multiline
      value={reason}
      onChangeText={setReason}
      style={styles.textArea}
    />
    </View>

    {/* submit button */}

    <Button
      mode='elevated'
      buttonColor={theme.colors.primary}
      textColor={theme.colors.onPrimary}
      onPress={createAppointment}
      style = {{marginVertical: 20, marginBottom: 100}}
    >
      Submit
    </Button>

    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Title>Confirm Appointment</Dialog.Title>
        <Dialog.Content>
          <Paragraph>Doctor: {doctorName}</Paragraph>
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
      </KeyboardAwareScrollView>
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