import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Switch, Alert, ActivityIndicator, TextInput } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { ip } from '../../../ContentExport';
import sd from '../../../utils/styleDictionary';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../../../UserContext';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const initialTimeSlot = { startTime: '', endTime: '', maxPatients: '', available: false };

const initialAvailability = {
  monday: { available: false, morning: { ...initialTimeSlot }, afternoon: { ...initialTimeSlot } },
  tuesday: { available: false, morning: { ...initialTimeSlot }, afternoon: { ...initialTimeSlot } },
  wednesday: { available: false, morning: { ...initialTimeSlot }, afternoon: { ...initialTimeSlot } },
  thursday: { available: false, morning: { ...initialTimeSlot }, afternoon: { ...initialTimeSlot } },
  friday: { available: false, morning: { ...initialTimeSlot }, afternoon: { ...initialTimeSlot } },
  saturday: { available: false, morning: { ...initialTimeSlot }, afternoon: { ...initialTimeSlot } },
  sunday: { available: false, morning: { ...initialTimeSlot }, afternoon: { ...initialTimeSlot } },
};

const DoctorAvailability = () => {
  const [availability, setAvailability] = useState(initialAvailability);
  const [activeAppointmentStatus, setActiveAppointmentStatus] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [currentEditingSlot, setCurrentEditingSlot] = useState(null);
  const navigation = useNavigation();
  const { user } = useUser();

  const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await axios.get(`${ip.address}/api/doctor/${user._id}/available`);
        const { availability: fetchedAvailability, activeAppointmentStatus } = response.data;

        const updatedAvailability = { ...initialAvailability };
        if (fetchedAvailability) {
          Object.keys(fetchedAvailability).forEach(day => {
            if (fetchedAvailability[day]) {
              updatedAvailability[day] = {
                ...fetchedAvailability[day],
                available: fetchedAvailability[day].available !== undefined
                  ? fetchedAvailability[day].available
                  : (fetchedAvailability[day].morning?.available || fetchedAvailability[day].afternoon?.available),
              };
            }
          });
        }

        setAvailability(updatedAvailability);
        setActiveAppointmentStatus(activeAppointmentStatus);
      } catch (error) {
        console.error('Error fetching availability:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user._id) {
      fetchAvailability();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleToggleDay = (day) => {
    setAvailability((prev) => {
      const isDayBecomingAvailable = !prev[day].available;

      return {
        ...prev,
        [day]: {
          ...prev[day],
          available: !prev[day].available,
          morning: isDayBecomingAvailable
            ? { ...prev[day].morning }
            : { ...prev[day].morning, available: false },
          afternoon: isDayBecomingAvailable
            ? { ...prev[day].afternoon }
            : { ...prev[day].afternoon, available: false },
        },
      };
    });
  };

  const handleToggleAvailability = (day, period) => {
    setAvailability((prev) => {
      const isPeriodBecomingAvailable = !prev[day][period].available;

      return {
        ...prev,
        [day]: {
          ...prev[day],
          available: isPeriodBecomingAvailable ? true : prev[day].available,
          [period]: {
            ...prev[day][period],
            available: !prev[day][period].available,
          },
        },
      };
    });
  };

  const handleTimeChange = (day, period, field, selectedTime) => {
    const formattedTime = selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [period]: {
          ...prev[day][period],
          [field]: formattedTime,
        },
      },
    }));
    setTimePickerVisible(false);
  };

  const showTimePicker = (day, period, field) => {
    setCurrentEditingSlot({ day, period, field });
    setTimePickerVisible(true);
  };

  const handleInputChange = (day, period, field, value) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [period]: {
          ...prev[day][period],
          [field]: value,
        },
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`${ip.address}/api/doctor/${user._id}/availability`, { 
        availability,
        activeAppointmentStatus 
      });
      Alert.alert('Success', 'Availability updated successfully.');
    } catch (error) {
      console.error('Error saving availability:', error);
      Alert.alert('Error', 'Failed to update availability. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const renderTimeSlot = (day, period, label) => {
    const slot = availability[day][period];

    return (
      <View style={[styles.timeSlotContainer, !availability[day].available && styles.disabledTimeSlot]}>
        <View style={styles.timeSlotHeader}>
          <Text style={styles.timeSlotLabel}>{label}</Text>
          <Switch
            value={slot.available}
            onValueChange={() => handleToggleAvailability(day, period)}
            trackColor={{ false: '#ccc', true: sd.colors.blue }}
            thumbColor={slot.available ? '#fff' : '#f4f3f4'}
            disabled={!availability[day].available}
          />
        </View>
        {slot.available && availability[day].available && (
          <View style={styles.timeSlotInputs}>
            <View style={styles.timeInputContainer}>
              <Text style={styles.inputLabel}>Start Time:</Text>
              <TouchableOpacity
                style={styles.timeInput}
                onPress={() => showTimePicker(day, period, 'startTime')}
              >
                <Text style={styles.timeInputText}>
                  {slot.startTime || 'Set Start Time'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.timeInputContainer}>
              <Text style={styles.inputLabel}>End Time:</Text>
              <TouchableOpacity
                style={styles.timeInput}
                onPress={() => showTimePicker(day, period, 'endTime')}
              >
                <Text style={styles.timeInputText}>
                  {slot.endTime || 'Set End Time'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.maxPatientsContainer}>
              <Text style={styles.inputLabel}>Max Patients:</Text>
              <TextInput
                style={styles.input}
                placeholder="Max Patients"
                keyboardType="numeric"
                value={slot.maxPatients?.toString() || ''}
                onChangeText={(value) => handleInputChange(day, period, 'maxPatients', value)}
              />
            </View>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={sd.colors.blue} />
        <Text style={styles.loadingText}>Loading availability...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerNav}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome5 name="chevron-left" size={20} color={sd.colors.blue} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Availability</Text>
        <View style={styles.backButton} />
      </View>
      
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Doctor Availability</Text>
          <Text style={styles.headerSubtitle}>Set your weekly availability for appointments</Text>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Appointment Status:</Text>
          <TouchableOpacity
            style={[
              styles.statusButton,
              activeAppointmentStatus ? styles.activeStatus : styles.inactiveStatus,
            ]}
            onPress={() => setActiveAppointmentStatus(!activeAppointmentStatus)}
          >
            <Text style={[
              styles.statusButtonText,
              activeAppointmentStatus ? styles.activeStatusText : styles.inactiveStatusText
            ]}>
              {activeAppointmentStatus ? 'Active' : 'Inactive'}
            </Text>
          </TouchableOpacity>
        </View>

        {dayNames.map((day) => (
          <View key={day} style={styles.dayContainer}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayLabel}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
              <Switch
                value={availability[day].available}
                onValueChange={() => handleToggleDay(day)}
                trackColor={{ false: '#ccc', true: sd.colors.blue }}
                thumbColor={availability[day].available ? '#fff' : '#f4f3f4'}
              />
            </View>
            
            {availability[day].available && (
              <>
                {renderTimeSlot(day, 'morning', 'Morning')}
                {renderTimeSlot(day, 'afternoon', 'Afternoon')}
              </>
            )}
          </View>
        ))}

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.disabledSaveButton]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save Availability'}</Text>
        </TouchableOpacity>
      </ScrollView>

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={(selectedTime) => {
          if (currentEditingSlot) {
            const { day, period, field } = currentEditingSlot;
            handleTimeChange(day, period, field, selectedTime);
          }
        }}
        onCancel={() => setTimePickerVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
    width: 40,
  },
  navTitle: {
    fontSize: 18,
    fontFamily: sd.fonts.semiBold,
    color: sd.colors.textPrimary,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: sd.fonts.bold,
    color: sd.colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: sd.colors.textSecondary,
    marginTop: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    ...sd.shadows.medium,
  },
  statusLabel: {
    fontSize: 16,
    fontFamily: sd.fonts.medium,
    color: sd.colors.textPrimary,
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  activeStatus: {
    backgroundColor: '#e8f5e9',
  },
  inactiveStatus: {
    backgroundColor: '#ffebee',
  },
  activeStatusText: {
    color: '#2e7d32',
  },
  inactiveStatusText: {
    color: '#c62828',
  },
  statusButtonText: {
    fontSize: 14,
    fontFamily: sd.fonts.medium,
  },
  dayContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    ...sd.shadows.medium,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dayLabel: {
    fontSize: 18,
    fontFamily: sd.fonts.semiBold,
    color: sd.colors.textPrimary,
  },
  timeSlotContainer: {
    marginBottom: 16,
    paddingVertical: 8,
  },
  disabledTimeSlot: {
    opacity: 0.5,
  },
  timeSlotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  timeSlotLabel: {
    fontSize: 16,
    fontFamily: sd.fonts.medium,
    color: sd.colors.textPrimary,
  },
  timeSlotInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeInputContainer: {
    flex: 1,
    marginRight: 8,
  },
  maxPatientsContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: sd.fonts.medium,
    color: sd.colors.textSecondary,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: sd.colors.textPrimary,
  },
  timeInput: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeInputText: {
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: sd.colors.textPrimary,
  },
  saveButton: {
    backgroundColor: sd.colors.blue,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    ...sd.shadows.small,
  },
  disabledSaveButton: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: sd.fonts.semiBold,
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: sd.fonts.medium,
    color: sd.colors.textSecondary,
  },
});

export default DoctorAvailability;