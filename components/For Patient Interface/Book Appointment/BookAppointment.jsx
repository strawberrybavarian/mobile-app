import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import doctorImage1 from '../../../assets/pictures/Doc.png';
import NavigationBar from '../Navigation/NavigationBar';
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import axios from 'axios';
import { Card, DataTable, TextInput } from 'react-native-paper';
import { getSpecialtyDisplayName } from '../../For Doctor Interface/DoctorStyleSheet/DoctorSpecialtyConverter';
import { getData } from '../../storageUtility';
import { ip } from '../../../ContentExport';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import sd from '../../../utils/styleDictionary';

const BookAppointment = ({ navigation, route }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  const [reason, setReason] = useState('');
  const [userId, setUserId] = useState(null);
  const [availability, setAvailability] = useState({});
  const [availableTimes, setAvailableTimes] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [bookedPatients, setBookedPatients] = useState({ morning: 0, afternoon: 0 }); // Track booked patients

  const { item } = route.params || {};

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getData('userId');
        if (id) {
          setUserId(id);
        } else {
          console.log('User not found');
        }
      } catch (err) {
        console.log(err);
      }
    };

    const fetchDoctorAvailability = async () => {
      try {
        const response = await axios.get(`${ip.address}/api/doctor/${item._id}/available`);
        setAvailability(response.data.availability);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserId();
    fetchDoctorAvailability();
  }, []);

  const getAvailableTimes = (day) => {
    const dayAvailability = availability[day];
    if (!dayAvailability) return [];
  
    let times = [];
  
    // Check morning availability
    if (dayAvailability.morning && dayAvailability.morning.available) {
      const availableSlots = dayAvailability.morning.maxPatients - (bookedPatients.morning || 0); // Fallback to 0 if undefined
      console.log('Morning slots:', { availableSlots }); // Debugging line
  
      if (availableSlots > 0) {
        const startTime = formatTime(dayAvailability.morning.startTime);
        const endTime = formatTime(dayAvailability.morning.endTime);
        times.push({
          label: "Morning",
          timeRange: `${startTime} - ${endTime}`,
          availableSlots,
        });
      }
    }
  
    // Check afternoon availability
    if (dayAvailability.afternoon && dayAvailability.afternoon.available) {
      const availableSlots = dayAvailability.afternoon.maxPatients - (bookedPatients.afternoon || 0); // Fallback to 0 if undefined
      console.log('Afternoon slots:', { availableSlots }); // Debugging line
  
      if (availableSlots > 0) {
        const startTime = formatTime(dayAvailability.afternoon.startTime);
        const endTime = formatTime(dayAvailability.afternoon.endTime);
        times.push({
          label: "Afternoon",
          timeRange: `${startTime} - ${endTime}`,
          availableSlots,
        });
      }
    }
  
    return times;
  };
   

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const time = new Date();
    time.setHours(hours);
    time.setMinutes(minutes);

    return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  // Inside the component
useEffect(() => {
  // Inside the fetchBookedPatients function
  const fetchBookedPatients = async () => {
    try {
      const response = await axios.get(`${ip.address}/api/appointments/${item._id}/count?date=${selectedDate}`);
      const { morning = 0, afternoon = 0 } = response.data || {}; // Set default values
  
      console.log('Fetched booked patients:', { morning, afternoon }); // Debugging line
      setBookedPatients({ morning, afternoon });
  
      const selectedDay = new Date(selectedDate).getDay();
      const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
      const day = daysOfWeek[selectedDay];
  
      const times = getAvailableTimes(day);
      setAvailableTimes(times);
  
      // Clear selected hour when the date changes
      if (times.length > 0) {
        setSelectedHour(null); // Clear selected hour to force re-selection
      } else {
        setSelectedHour(null); // Clear selected hour if no available times
      }
    } catch (err) {
      console.log('Error fetching booked patients:', err);
      setBookedPatients({ morning: 0, afternoon: 0 });
    }
  };
  
  if (selectedDate) {
    fetchBookedPatients();
    console.log('Selected date:', selectedDate);
    console.log('Booked patients:', bookedPatients);
    console.log('Availability:', availability);
  } else {
    setAvailableTimes([]); // Clear available times if no date is selected
    setSelectedHour(null); // Clear selected hour as well
  }
}, [selectedDate, availability]); // Add availability as a dependency


  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleHourSelect = (hour) => {
    setSelectedHour(hour);
  };

  const handleReason = (input) => {
    setReason(input);
  };

  const handleCreateAppointment = async () => {
    if (!selectedDate || !selectedHour || !reason || !userId) {
      Alert.alert('Validation Error', 'Please fill all fields');
      return;
    }

    try {
      const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');
      const formattedTime = dayjs(selectedHour).format('HH:mm');

      const appointmentData = {
        doctor: item._id,
        date: formattedDate,
        time: formattedTime,
        reason,
        medium: 'in-person',
        appointment_type: {
          appointment_type: 'Consultation',
          category: 'General Consultation',
        },
      };

      const response = await axios.post(`${ip.address}/api/patient/api/${userId}/createappointment`, appointmentData);
      console.log('Appointment created:', response.data);
      Alert.alert('Success', 'Appointment created successfully');
      navigation.navigate('ptnmain');
    } 
    catch (err) {
      console.error('Error creating appointment: ', err.response?.data?.status);
      Alert.alert('Error', `${err.response?.data?.message || err.message} `);
    }
  };

  const renderAvailability = (day) => {
    const dayAvailability = availability[day.toLowerCase()];
    if (!dayAvailability) return { morning: 'Not available', afternoon: 'Not available' };

    const formatTime = (time) => {
      const [hour, minute] = time.split(':');
      const parsedHour = parseInt(hour);
      if (parsedHour === 12) return `${hour}:${minute} PM`;
      if (parsedHour > 12) return `${parsedHour - 12}:${minute} PM`;
      return `${hour}:${minute} AM`;
    };

    return {
      morning: dayAvailability.morning?.available
        ? `${formatTime(dayAvailability.morning.startTime)} - ${formatTime(dayAvailability.morning.endTime)}`
        : 'Not available',
      afternoon: dayAvailability.afternoon?.available
        ? `${formatTime(dayAvailability.afternoon.startTime)} - ${formatTime(dayAvailability.afternoon.endTime)}`
        : 'Not available',
    };
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <Entypo name='chevron-small-left' size={30} color={sd.colors.blue} onPress={() => navigation.goBack()} style={{ flex: 1 }} />
          <Text style={styles.title}>Book Appointment</Text>
          <View style={{ flex: 1 }} />
        </View>

        <Card style={{ marginVertical: 10, backgroundColor: sd.colors.white, borderColor: sd.colors.blue }} mode='outlined'>
          <Card.Content>
            <View style={{ flexDirection: 'row' }}>
              <Image source={{ uri: `${ip.address}/${item.dr_image}` }} style={{ width: 50, height: 50, borderRadius: 50 }} />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.drName}>{`Dr. ${item.dr_firstName} ${item.dr_lastName}`}</Text>
                <Text style={styles.drSpecialty}>{item.dr_specialty}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Text style={styles.subtitle}>Availability</Text>

        <Card style={{ marginVertical: 10, backgroundColor: sd.colors.white, borderColor: sd.colors.blue }} mode='outlined'>
          <Card.Content>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Day</DataTable.Title>
                <DataTable.Title>Morning </DataTable.Title>
                <DataTable.Title>Afternoon </DataTable.Title>
              </DataTable.Header>

              {days.map((day) => {
                const availability = renderAvailability(day);
                return (
                  <DataTable.Row key={day}>
                    <DataTable.Cell>{day}</DataTable.Cell>
                    <DataTable.Cell>{availability.morning}</DataTable.Cell>
                    <DataTable.Cell>{availability.afternoon}</DataTable.Cell>
                  </DataTable.Row>
                );
              })}
            </DataTable>
          </Card.Content>
        </Card>

        <Text style={styles.subtitle}>Select a Date</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
          <Text style={styles.dateButtonText}>
            {selectedDate ? dayjs(selectedDate).format('MMMM D, YYYY') : 'Choose a Date'}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <RNDateTimePicker value={selectedDate || new Date()} mode="date" display="default" onChange={handleDateChange} minimumDate={new Date()} />
        )}

        <Text style={styles.subtitle}>Select Hour</Text>
        {availableTimes.length != 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.timeSelection}>
              {availableTimes.map((timeSlot, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.timeButton,
                    selectedHour === timeSlot.timeRange && styles.selectedTimeButton,
                  ]}
                  onPress={() => handleHourSelect(timeSlot.timeRange)}>
                  <Text style={styles.timeButtonText}>{timeSlot.timeRange}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        ) : (
          <Text style={styles.noAvailableTimes}>No available times for the selected date</Text>
        )}

        <Text style={styles.subtitle}>Reason for Appointment</Text>
        <TextInput
          mode="outlined"
          multiline
          value={reason}
          onChangeText={handleReason}
          style={styles.textArea}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleCreateAppointment}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: sd.colors.backgroundGray,
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: sd.colors.blue,
    flex: 2,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    color: sd.colors.darkGray,
  },
  drName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: sd.colors.black,
  },
  drSpecialty: {
    fontSize: 14,
    color: sd.colors.gray,
  },
  dateButton: {
    backgroundColor: sd.colors.lightBlue,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  dateButtonText: {
    fontSize: 16,
    color: sd.colors.darkBlue,
  },
  timeSelection: {
    flexDirection: 'row',
  },
  timeButton: {
    backgroundColor: sd.colors.lightBlue,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  selectedTimeButton: {
    backgroundColor: sd.colors.darkBlue,
  },
  timeButtonText: {
    fontSize: 16,
    color: sd.colors.white,
  },
  noAvailableTimes: {
    color: sd.colors.red,
    textAlign: 'center',
    marginVertical: 10,
  },
  textArea: {
    backgroundColor: sd.colors.white,
    borderRadius: 10,
    borderColor: sd.colors.lightBlue,
    borderWidth: 1,
    padding: 10,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: sd.colors.blue,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
    marginBottom: 100,
  },
  submitButtonText: {
    fontSize: 18,
    color: sd.colors.white,
    fontWeight: 'bold',
  },
});

export default BookAppointment;
