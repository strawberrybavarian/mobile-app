import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import axios from 'axios';
import { Avatar, Button, Card, DataTable, Dialog, Portal, Paragraph, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import  CalendarPicker from 'react-native-calendar-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getData } from '../../storageUtility';
import { ip } from '../../../ContentExport';
import sd from '../../../utils/styleDictionary';
import { formatTime } from '../../../utils/formatTime';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import BookAppointmentStyles from './BookAppointmentStyles';
import { Entypo } from '@expo/vector-icons';

const BookAppointment = ({ navigation, route }) => {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState(""); // Automatically set today's date in useEffect
  const [time, setTime] = useState("");
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
  const [loading, setLoading] = useState(true); // Loading state
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
    console.log(item)
    const today = new Date();

    // Fetch doctor's availability and name
    axios
      .get(`${ip.address}/api/doctor/${item._id}`)
      .then((response) => {
        const doctor = response.data.doctor;
        //console.log("Doctor API response:", response.data);
        console.log("Doctor API bookedslots:", doctor.bookedSlots);
        console.log("Doctor API availability:", doctor.availability);
        setDoctorName(`${doctor.dr_firstName} ${doctor.dr_lastName}`);
        setAvailability(doctor.availability || {});
        setImageUri(`${ip.address}/${doctor.dr_image}`);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getData("userId");
        if (id) {
          axios
            .get(`${ip.address}/api/patient/api/onepatient/${id}`)
            .then((res) => {
              console.log(res.data.thePatient);
              setPatient(res.data.thePatient);
            })
            .catch((err) => console.log(err));
        } else {
          console.log("User not found");
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchUserId();
  }, [])

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

  const confirmAppointment = () => {
    const formData = {
      doctor: item._id ,
      date: selectedDate || null,
      time: selectedHour || null,
      reason,
      appointment_type: {
        appointment_type: "Consultation",
        category: "General",
      },
    };

    axios
      .post(`${ip.address}/api/patient/api/${patient._id}/createappointment`, formData)
      .then(() => {
        Alert.alert("Success", "Appointment created successfully!");
        hideDialog();

        const updatedAvailableTimes = availableTimes.map((slot) => {
          if (slot.timeRange === selectedHour) {
            return { ...slot, availableSlots: slot.availableSlots - 1 };
          }
          return slot;
        });

        setAvailableTimes(updatedAvailableTimes);
        const period = updatedAvailableTimes.find(
          (slot) => slot.timeRange === selectedHour
        )?.period;
        setBookedPatients((prev) => ({
          ...prev,
          [period]: prev[period] + 1,
        }));

        navigation.navigate("ptnmain");
      })
      .catch((err) => {
        if (err.response) {
          Alert.alert("Error", err.response.data.message);
        } else {
          console.log(err);
          Alert.alert("Error", "An error occurred while creating the appointment.");
        }
      });
  };
  
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
       {selectedHour === slot.timeRange ? <Entypo name = 'check' size={'large'} style = {{margin : 10}}/> : null}
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

export default BookAppointment;
