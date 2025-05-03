import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet, Modal as RNModal, SafeAreaView, StatusBar, Alert } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Modal from 'react-native-modal';
import CalendarPicker from 'react-native-calendar-picker';
import axios from 'axios';
import { ip } from '../../../ContentExport';
import { format } from 'date-fns';
import sd from '../../../utils/styleDictionary';
import { formatTime } from '../../../utils/formatTime';
import { Card, Divider, Button, Appbar } from 'react-native-paper';
import { FontAwesome5, Entypo } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

const RescheduleAppointmentModal = ({ isVisible, closeModal, onReschedule, appointmentData }) => {
  const theme = useTheme();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [availability, setAvailability] = useState({});
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [morningTimeRange, setMorningTimeRange] = useState("");
  const [afternoonTimeRange, setAfternoonTimeRange] = useState("");
  const [bookedSlots, setBookedSlots] = useState({ morning: 0, afternoon: 0 });
  const [availableSlots, setAvailableSlots] = useState({ morning: 0, afternoon: 0 });
  const [noAvailability, setNoAvailability] = useState(false);
  const [error, setError] = useState("");
  const [activeAppointmentStatus, setActiveAppointmentStatus] = useState(true);

  // Fetch doctors when modal becomes visible
  useEffect(() => {
    if (isVisible) {
      fetchDoctors();
    }
  }, [isVisible]);

  // Function to fetch all doctors
  const fetchDoctors = async () => {
    try {
      setLoadingDoctors(true);
      console.log("Fetching doctors...");
      const response = await axios.get(`${ip.address}/api/doctor/api/alldoctor`);
      
      if (response.data && response.data.theDoctor) {
        // Format doctors for dropdown
        const doctorOptions = response.data.theDoctor.map(doctor => ({
          label: `Dr. ${doctor.dr_firstName} ${doctor.dr_lastName} (${doctor.dr_specialty})`,
          value: doctor._id,
          data: doctor
        }));
        
        console.log(`Found ${doctorOptions.length} doctors`);
        setDoctors(doctorOptions);
        
        // Pre-select the current doctor if available
        if (appointmentData && appointmentData.doctor) {
          const currentDoctorId = appointmentData.doctor._id;
          const currentDoctor = doctorOptions.find(doc => doc.value === currentDoctorId);
          
          if (currentDoctor) {
            console.log("Setting current doctor as default:", currentDoctor.label);
            setSelectedDoctor(currentDoctor);
            
            // Also fetch availability for this doctor
            fetchDoctorDetails(currentDoctor);
          }
        }
      } else {
        console.log("No doctors found in response");
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError("Failed to load doctors. Please try again.");
    } finally {
      setLoadingDoctors(false);
    }
  };

  // Format and convert unavailable dates to be easily comparable
  const formatUnavailableDates = (dates) => {
    if (!dates || !Array.isArray(dates)) return [];
    
    // Store just the day, month, year as objects for easier comparison
    return dates.map(dateString => {
      const date = new Date(dateString);
      return {
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear()
      };
    });
  };

  // Check if a date is unavailable
  const isDateUnavailable = (date) => {
    if (!date) return false;
    
    const checkDate = new Date(date);
    const day = checkDate.getDate();
    const month = checkDate.getMonth();
    const year = checkDate.getFullYear();
    
    // Direct comparison of day, month, year values
    return unavailableDates.some(d => 
      d.day === day && 
      d.month === month && 
      d.year === year
    );
  };

  // Reset selections when doctor changes
  useEffect(() => {
    if (selectedDoctor) {
      setSelectedDate(null);
      setSelectedTime(null);
      setSelectedPeriod(null);
      setUnavailableDates([]);
    }
  }, [selectedDoctor]);

  // Fetch doctor's details when a doctor is selected
  const fetchDoctorDetails = async (doctor) => {
    if (!doctor) return;
    
    try {
      setLoading(true);
      setError("");
      console.log("Fetching doctor details:", doctor.value);
      
      const response = await axios.get(`${ip.address}/api/doctor/${doctor.value}`);
      
      if (response.data && response.data.doctor) {
        const doctorData = response.data.doctor;
        setAvailability(doctorData.availability || {});
        setActiveAppointmentStatus(doctorData.activeAppointmentStatus || true);
        
        // Get and format unavailable dates from deactivation request
        if (doctorData.deactivationRequest && 
            doctorData.deactivationRequest.confirmed === true && 
            Array.isArray(doctorData.deactivationRequest.unavailableDates)) {
          setUnavailableDates(formatUnavailableDates(doctorData.deactivationRequest.unavailableDates));
        } else {
          setUnavailableDates([]);
        }
        
        generateAvailableDates(doctorData.availability);
      } else {
        setAvailability({});
        setAvailableDates([]);
      }
    } catch (error) {
      console.error('Error fetching doctor details:', error);
      setError("Failed to load doctor's availability. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Generate available dates based on doctor's schedule
  const generateAvailableDates = (availability) => {
    const dates = [];
    const today = new Date();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    // Generate available dates for the next 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayOfWeek = days[date.getDay()];
      
      // Check if the doctor is available on this day
      if (availability && availability[dayOfWeek] && 
         (availability[dayOfWeek].morning?.available || 
          availability[dayOfWeek].afternoon?.available)) {
        
        // Skip if this date is in the unavailable dates list
        if (!isDateUnavailable(date)) {
          dates.push(date);
        }
      }
    }
    
    console.log(`Generated ${dates.length} available dates`);
    setAvailableDates(dates);
  };

  // Function to check if a date should be disabled in the calendar
  const isDateDisabled = (date) => {
    if (!date) return true;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Disable past dates
    if (date < today) return true;
    
    // Disable unavailable dates
    if (isDateUnavailable(date)) return true;
    
    // Disable dates where doctor is not available
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayOfWeek = days[date.getDay()];
    
    if (!availability || !availability[dayOfWeek] ||
        !(availability[dayOfWeek].morning?.available || 
          availability[dayOfWeek].afternoon?.available)) {
      return true;
    }
    
    return false;
  };

  // Date and time selection handlers
  const openDateModal = () => {
    setShowDateModal(true);
    if (selectedDate) {
      fetchAvailableTimesForDate(selectedDate);
    }
  };

  const closeDateModal = () => {
    setShowDateModal(false);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    
    if (isDateDisabled(date)) {
      // Just set the date but don't fetch times if date is disabled
      // UI will show unavailability message based on isDateUnavailable check in the render
      setNoAvailability(true);
      setAvailableTimes([]);
    } else {
      // Only fetch available times for valid dates
      fetchAvailableTimesForDate(date);
    }
  };

  // Generate time range string
  const generateTimeRange = (start, end) => {
    const startTime = formatTime(start);
    const endTime = formatTime(end);
    return `${startTime} - ${endTime}`;
  };

  const fetchAvailableTimesForDate = async (date) => {
    if (!selectedDoctor) return;
    
    try {
      setLoadingTimes(true);
      setError("");
      setNoAvailability(false);
      setSelectedTime(null);
      setSelectedPeriod(null);
      
      const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
      const day = daysOfWeek[date.getDay()];
      
      // Skip fetching if date is unavailable
      if (isDateUnavailable(date)) {
        setMorningTimeRange("");
        setAfternoonTimeRange("");
        setAvailableSlots({ morning: 0, afternoon: 0 });
        setNoAvailability(true);
        setLoadingTimes(false);
        return;
      }
      
      // Get the day's availability
      const dayAvailability = availability[day];
      
      // If no availability found for this day
      if (!dayAvailability) {
        setMorningTimeRange("");
        setAfternoonTimeRange("");
        setAvailableSlots({ morning: 0, afternoon: 0 });
        setNoAvailability(true);
        setLoadingTimes(false);
        return;
      }
      
      // Fetch booked appointments for this date
      const formattedDate = date.toISOString();
      console.log(`Fetching appointments for ${formattedDate}`);
      
      const response = await axios.get(
        `${ip.address}/api/appointments/doctor/${selectedDoctor.value}/count?date=${formattedDate}`
      );
      
      const { morning, afternoon } = response.data;
      setBookedSlots({ morning, afternoon });
      
      let hasMorningAvailability = false;
      let hasAfternoonAvailability = false;
      
      // Calculate morning slots
      if (dayAvailability?.morning?.available) {
        const morningSlots = dayAvailability.morning.maxPatients - morning;
        setAvailableSlots(prev => ({ ...prev, morning: Math.max(morningSlots, 0) }));
        setMorningTimeRange(generateTimeRange(
          dayAvailability.morning.startTime, 
          dayAvailability.morning.endTime
        ));
        hasMorningAvailability = morningSlots > 0;
      } else {
        setMorningTimeRange("");
        setAvailableSlots(prev => ({ ...prev, morning: 0 }));
      }
      
      // Calculate afternoon slots
      if (dayAvailability?.afternoon?.available) {
        const afternoonSlots = dayAvailability.afternoon.maxPatients - afternoon;
        setAvailableSlots(prev => ({ ...prev, afternoon: Math.max(afternoonSlots, 0) }));
        setAfternoonTimeRange(generateTimeRange(
          dayAvailability.afternoon.startTime, 
          dayAvailability.afternoon.endTime
        ));
        hasAfternoonAvailability = afternoonSlots > 0;
      } else {
        setAfternoonTimeRange("");
        setAvailableSlots(prev => ({ ...prev, afternoon: 0 }));
      }
      
      // If neither morning nor afternoon has availability
      if (!hasMorningAvailability && !hasAfternoonAvailability) {
        setNoAvailability(true);
      }
      
      // Set available times for UI
      let times = [];
      if (hasMorningAvailability) {
        times.push({
          label: "Morning",
          timeRange: morningTimeRange,
          availableSlots: availableSlots.morning,
          period: "morning",
        });
      }
      
      if (hasAfternoonAvailability) {
        times.push({
          label: "Afternoon",
          timeRange: afternoonTimeRange,
          availableSlots: availableSlots.afternoon,
          period: "afternoon",
        });
      }
      
      setAvailableTimes(times);
      console.log(`Found ${times.length} available time slots`);
      
    } catch (error) {
      console.error('Error fetching available times:', error);
      setError("Failed to check appointment availability. Please try again.");
      setAvailableTimes([]);
    } finally {
      setLoadingTimes(false);
    }
  };

  const handleTimeSelection = (time) => {
    setSelectedTime(time);
    setSelectedPeriod(time.period);
  };

  const handleReschedulePress = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      Alert.alert("Missing Information", "Please select a doctor, date, and time for your appointment.");
      return;
    }
    
    // Check if date is unavailable
    if (isDateUnavailable(selectedDate)) {
      Alert.alert("Date Unavailable", "The doctor is not available on this date. Please select another date.");
      return;
    }

    // Check if selected period has availability
    if (selectedPeriod === 'morning' && availableSlots.morning <= 0) {
      Alert.alert("No Availability", "No available slots for the selected morning period.");
      return;
    } else if (selectedPeriod === 'afternoon' && availableSlots.afternoon <= 0) {
      Alert.alert("No Availability", "No available slots for the selected afternoon period.");
      return;
    }
    
    // Confirm rescheduling
    Alert.alert(
      "Confirm Reschedule",
      `Are you sure you want to reschedule this appointment to:\n\nDoctor: ${selectedDoctor.label}\nDate: ${format(selectedDate, 'MMMM d, yyyy')}\nTime: ${selectedTime.timeRange}`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Reschedule",
          onPress: submitReschedule
        }
      ]
    );
  };
  
  // Update the submitReschedule function to NOT make API calls
  const submitReschedule = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Do NOT make API calls here - let parent component handle that
      // Just provide the data via onReschedule
      const reason = "Patient requested reschedule";
      
      // Call onReschedule with necessary data
      onReschedule(reason, {
        doctorId: selectedDoctor.value,
        doctorName: selectedDoctor.label,
        date: selectedDate.toISOString(),
        formattedDate: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime.timeRange,
        period: selectedTime.period
      });
      
      // Do NOT reset state or close modal here
      // Parent component will handle that
    } catch (error) {
      console.error('Error preparing reschedule data:', error);
      Alert.alert(
        "Error",
        "Failed to prepare reschedule data. Please try again.",
        [{ text: "OK" }]
      );
      setLoading(false);
    }
  };

  const customStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    header: {
      backgroundColor: theme.colors.primary,
    },
    headerTitle: {
      color: theme.colors.onPrimary,
      fontSize: 18,
      fontFamily: sd.fonts.semiBold,
    },
    sectionTitle: {
      fontFamily: sd.fonts.medium,
      fontSize: 18,
      //marginTop: 24,
      marginBottom: 10,
      color: theme.colors.primary,
    },
    dropdownContainer: {
      marginBottom: 24,
      alignItems: 'center',
    },
    dropdown: {
      height: 50,
      width: '90%',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
      borderColor: theme.colors.primary,
    },
    // Schedule display styles
    scheduleCard: {
      borderRadius: 12,
      marginTop: 8,
      elevation: 2,
      backgroundColor: 'white',
      marginBottom: 24,
    },
    scheduleContainer: {
      marginBottom: 10,
      backgroundColor: 'white',
    },
    daySchedule: {
      marginBottom: 12,
    },
    dayName: {
      fontFamily: sd.fonts.semiBold,
      fontSize: 15,
      color: theme.colors.primary,
      marginBottom: 4,
    },
    timePeriodsContainer: {
      paddingLeft: 8,
      marginTop: 2,
      marginBottom: 6,
    },
    timePeriod: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 2,
    },
    timeIcon: {
      marginRight: 6,
    },
    timeText: {
      fontFamily: sd.fonts.regular,
      fontSize: 14,
      color: theme.colors.onSurface,
    },
    unavailableContainer: {
      paddingLeft: 8,
      marginTop: 2,
      marginBottom: 6,
    },
    unavailableText: {
      fontFamily: sd.fonts.italic,
      fontSize: 14,
      color: '#999',
    },
    availableDivider: {
      backgroundColor: '#E3F2FD',
      height: 1,
      marginTop: 4,
    },
    unavailableDivider: {
      backgroundColor: '#F5F5F5',
      height: 1,
      marginTop: 4,
    },
    scheduleTip: {
      fontFamily: sd.fonts.italic,
      fontSize: 12,
      color: '#888',
      textAlign: 'center',
      marginTop: 8,
    },
    // Calendar modal styles
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      paddingTop: 16,
      maxHeight: '90%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.surfaceVariant,
    },
    modalTitle: {
      fontSize: sd.fontSizes.large,
      fontFamily: sd.fonts.semiBold,
      color: theme.colors.onBackground,
    },
    modalSubtitle: {
      fontSize: sd.fontSizes.medium,
      fontFamily: sd.fonts.medium,
      color: theme.colors.onSurfaceVariant,
      marginTop: 16,
      marginBottom: 8,
    },
    calendarText: {
      fontFamily: sd.fonts.regular,
      color: theme.colors.onBackground,
    },
    calendarMonthTitle: {
      fontFamily: sd.fonts.semiBold,
      fontSize: sd.fontSizes.large,
      color: theme.colors.primary,
    },
    calendarYearTitle: {
      fontFamily: sd.fonts.medium,
      fontSize: sd.fontSizes.medium,
      color: theme.colors.primary,
    },
    calendarDayLabels: {
      borderTopWidth: 0,
      borderBottomWidth: 0,
    },
    timeButton: {
      padding: 12,
      margin: 5,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ddd',
      backgroundColor: '#f8f8f8',
      width: '45%',
    },
    selectedTimeButton: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    timeButtonText: {
      textAlign: 'center',
      fontFamily: sd.fonts.regular,
      color: theme.colors.onSurfaceVariant,
    },
    selectedTimeButtonText: {
      color: 'white',
      fontFamily: sd.fonts.medium,
    },
    timeButtonsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    slotsText: {
      fontSize: sd.fontSizes.small,
      fontFamily: sd.fonts.regular,
    },
    noTimesText: {
      fontFamily: sd.fonts.italic,
      fontSize: sd.fontSizes.medium,
      color: theme.colors.error,
      textAlign: 'center',
      marginVertical: 20,
    },
    datePickerButton: {
      marginTop: 16,
      borderColor: theme.colors.primary,
      borderWidth: 2,
      marginBottom: 16,
      borderRadius: 8,
    },
    footer: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: theme.colors.surfaceVariant,
      backgroundColor: theme.colors.surface,
    },
    rescheduleButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      marginBottom: 8,
    },
    rescheduleButtonDisabled: {
      backgroundColor: '#E0E0E0', // Light grey background instead of faded primary
      borderRadius: 8,
      marginBottom: 8,
    },
    errorText: {
      color: theme.colors.error,
      marginBottom: 10,
      fontFamily: sd.fonts.regular,
      fontSize: 14,
      textAlign: 'center',
    },
    infoText: {
      color: theme.colors.primary,
      marginVertical: 5,
      fontFamily: sd.fonts.italic,
      fontSize: 13,
      textAlign: 'center',
    },
    buttonLabelStyle: {
      fontSize: sd.fontSizes.medium,
      fontFamily: sd.fonts.medium,
    },
    buttonLabelDisabled: {
      fontSize: sd.fontSizes.medium,
      fontFamily: sd.fonts.medium,
      color: '#757575', // Dark grey text for better contrast
      opacity: 1, // Ensure full opacity for the text itself
    },
    confirmButton: {
      marginTop: 20,
      backgroundColor: theme.colors.primary,
      paddingVertical: 8,
      borderRadius: 8,
    },
  });

  return (
    <RNModal
      visible={isVisible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={closeModal}
    >
      <SafeAreaView style={customStyles.container}>
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
        
        <Appbar.Header style={customStyles.header}>
          <Appbar.BackAction onPress={closeModal} color={theme.colors.onPrimary} />
          <Appbar.Content 
            title="Reschedule Appointment" 
            titleStyle={customStyles.headerTitle}
          />
        </Appbar.Header>
        
        <ScrollView style={customStyles.content}>
          {error && <Text style={customStyles.errorText}>{error}</Text>}
          
          <Text style={customStyles.sectionTitle}>Select Doctor</Text>
          <View style={customStyles.dropdownContainer}>
            {loadingDoctors ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <>
                {doctors.length === 0 ? (
                  <Text style={{color: 'red', textAlign: 'center'}}>
                    No doctors available. Please try again.
                  </Text>
                ) : (
                  <Dropdown
                    style={customStyles.dropdown}
                    data={doctors}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={
                      appointmentData?.doctor 
                        ? `Dr. ${appointmentData.doctor.dr_firstName} ${appointmentData.doctor.dr_lastName}`
                        : "Select a doctor"
                    }
                    searchPlaceholder="Search..."
                    value={selectedDoctor?.value}
                    onChange={item => setSelectedDoctor(item)}
                  />
                )}
              </>
            )}
          </View>
          
          {unavailableDates.length > 0 && (
            <Text style={customStyles.infoText}>
              Note: Some dates are unavailable as the doctor has scheduled time off.
            </Text>
          )}
          
          {selectedDoctor && (
            <>
              <Text style={customStyles.sectionTitle}>Doctor's Schedule</Text>
              {loading ? (
                <ActivityIndicator size="small" color={theme.colors.primary} style={{marginVertical: 20}} />
              ) : (
                <Card style={customStyles.scheduleCard}>
                  <Card.Content>
                    <View style={customStyles.scheduleContainer}>
                      {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                        const dayAvail = availability[day];
                        const hasMorning = dayAvail?.morning?.available;
                        const hasAfternoon = dayAvail?.afternoon?.available;
                        const isAvailable = hasMorning || hasAfternoon;
                        
                        return (
                          <View key={day} style={customStyles.daySchedule}>
                            <Text style={customStyles.dayName}>
                              {day.charAt(0).toUpperCase() + day.slice(1)}
                            </Text>
                            
                            {!isAvailable ? (
                              <View style={customStyles.unavailableContainer}>
                                <Text style={customStyles.unavailableText}>Not Available</Text>
                              </View>
                            ) : (
                              <View style={customStyles.timePeriodsContainer}>
                                {hasMorning && (
                                  <View style={customStyles.timePeriod}>
                                    <FontAwesome5 name="sun" size={12} color={theme.colors.primary} style={customStyles.timeIcon} />
                                    <Text style={customStyles.timeText}>
                                      {formatTime(dayAvail?.morning?.startTime)} - {formatTime(dayAvail?.morning?.endTime)}
                                    </Text>
                                  </View>
                                )}
                                
                                {hasAfternoon && (
                                  <View style={customStyles.timePeriod}>
                                    <FontAwesome5 name="moon" size={12} color={theme.colors.primary} style={customStyles.timeIcon} />
                                    <Text style={customStyles.timeText}>
                                      {formatTime(dayAvail?.afternoon?.startTime)} - {formatTime(dayAvail?.afternoon?.endTime)}
                                    </Text>
                                  </View>
                                )}
                              </View>
                            )}
                            
                            <Divider style={isAvailable === false ? customStyles.unavailableDivider : customStyles.availableDivider} />
                          </View>
                        );
                      })}
                    </View>
                    
                    <Text style={customStyles.scheduleTip}>
                      Tap "Choose Date & Time" below to select your preferred appointment slot
                    </Text>
                  </Card.Content>
                </Card>
              )}

              <Text style={customStyles.sectionTitle}>Select Date & Time</Text>
              <Button
                mode="outlined"
                onPress={openDateModal}
                style={customStyles.datePickerButton}
                buttonColor={theme.colors.surface}
                textColor={theme.colors.onSurface}
                icon={loadingTimes ? "loading" : "calendar"}
                loading={loadingTimes}
                labelStyle={customStyles.buttonLabelStyle}
                disabled={loading}
              >
                {loadingTimes ? "Loading available times..." : 
                  (selectedDate && selectedTime ? 
                    `${format(selectedDate, 'MMMM d, yyyy')} at ${selectedTime.timeRange}` : 
                    'Choose Date & Time')}
              </Button>
            </>
          )}
        </ScrollView>

        <View style={customStyles.footer}>
          <Button
            mode="contained"
            onPress={handleReschedulePress}
            style={loading || !selectedDoctor || !selectedDate || !selectedTime 
              ? customStyles.rescheduleButtonDisabled 
              : customStyles.rescheduleButton}
            disabled={loading || !selectedDoctor || !selectedDate || !selectedTime}
            loading={loading}
            labelStyle={loading || !selectedDoctor || !selectedDate || !selectedTime 
              ? customStyles.buttonLabelDisabled 
              : customStyles.buttonLabelStyle}
          >
            Reschedule Appointment
          </Button>
          <Button
            mode="outlined"
            onPress={closeModal}
            disabled={loading}
            labelStyle={customStyles.buttonLabelStyle}
          >
            Cancel
          </Button>
        </View>

        {/* Calendar Modal */}
        <Modal
          isVisible={showDateModal}
          onBackdropPress={() => setShowDateModal(false)}
          onSwipeComplete={() => setShowDateModal(false)}
          swipeDirection="down"
          style={{
            justifyContent: 'flex-end',
            margin: 0,
          }}
          backdropOpacity={0.7}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          propagateSwipe={true}
          useNativeDriver={true}
          hideModalContentWhileAnimating={true}
        >
          <View style={[customStyles.modalContent, { backgroundColor: theme.colors.background }]}>
            <View style={customStyles.modalHeader}>
              <Text style={customStyles.modalTitle}>Select Date & Time</Text>
              <TouchableOpacity onPress={() => setShowDateModal(false)}>
                <Entypo name="cross" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>

            <CalendarPicker
              onDateChange={handleDateSelect}
              selectedStartDate={selectedDate}
              minDate={new Date()}
              textStyle={customStyles.calendarText}
              monthTitleStyle={customStyles.calendarMonthTitle}
              yearTitleStyle={customStyles.calendarYearTitle}
              dayLabelsWrapper={customStyles.calendarDayLabels}
            />

            {/* Only show Available Times section after a date is selected */}
            {selectedDate && (
              <>
                <Text style={customStyles.modalSubtitle}>Available Times</Text>
                {loadingTimes ? (
                  <ActivityIndicator size="large" color={theme.colors.primary} style={{marginVertical: 20}} />
                ) : isDateUnavailable(selectedDate) ? (
                  <Text style={customStyles.noTimesText}>
                    The doctor is not available on this date. Please select another date.
                  </Text>
                ) : noAvailability ? (
                  <Text style={customStyles.noTimesText}>
                    No availability for this date. Please select another date.
                  </Text>
                ) : availableTimes.length > 0 ? (
                  <View style={customStyles.timeButtonsContainer}>
                    {availableTimes.map((slot, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          customStyles.timeButton,
                          selectedTime === slot && customStyles.selectedTimeButton,
                        ]}
                        onPress={() => handleTimeSelection(slot)}
                      >
                        <Text style={[
                          customStyles.timeButtonText,
                          selectedTime === slot && customStyles.selectedTimeButtonText,
                        ]}>
                          {slot.label}
                          {'\n'}
                          {slot.timeRange}
                          {slot.availableSlots > 1 && (
                            <Text style={customStyles.slotsText}>{'\n'}({slot.availableSlots} slots)</Text>
                          )}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <Text style={customStyles.noTimesText}>
                    No available slots for this date. Please select another date.
                  </Text>
                )}
              </>
            )}

            <Button
              mode="contained"
              onPress={() => setShowDateModal(false)}
              style={customStyles.confirmButton}
              labelStyle={customStyles.buttonLabelStyle}
              disabled={!selectedDate || !selectedTime}
            >
              Confirm Selection
            </Button>
          </View>
        </Modal>
      </SafeAreaView>
    </RNModal>
  );
};

export default RescheduleAppointmentModal;
