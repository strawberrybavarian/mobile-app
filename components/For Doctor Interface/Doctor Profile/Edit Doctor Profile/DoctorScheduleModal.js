import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { TextInput, Switch, Button, Divider, useTheme } from 'react-native-paper';
import Modal from 'react-native-modal';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import sd from '@/utils/styleDictionary';

const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const initialTimeSlot = { startTime: '', endTime: '', maxPatients: '', available: false };

const initialAvailability = {
  monday: { morning: { ...initialTimeSlot }, afternoon: { ...initialTimeSlot } },
  tuesday: { morning: { ...initialTimeSlot }, afternoon: { ...initialTimeSlot } },
  wednesday: { morning: { ...initialTimeSlot }, afternoon: { ...initialTimeSlot } },
  thursday: { morning: { ...initialTimeSlot }, afternoon: { ...initialTimeSlot } },
  friday: { morning: { ...initialTimeSlot }, afternoon: { ...initialTimeSlot } },
  saturday: { morning: { ...initialTimeSlot }, afternoon: { ...initialTimeSlot } },
  sunday: { morning: { ...initialTimeSlot }, afternoon: { ...initialTimeSlot } },
};

const DoctorScheduleModal = ({ visible, onClose, availability: initialSchedule, onSave }) => {
  // Use the theme hook internally instead of receiving as prop
  const theme = useTheme();
  
  const [availability, setAvailability] = useState(initialSchedule || initialAvailability);
  const [expandedDays, setExpandedDays] = useState({
    monday: true,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const toggleDay = (day) => {
    setExpandedDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  const handleAvailabilityChange = (day, period, value) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [period]: {
          ...prev[day][period],
          available: value
        }
      }
    }));
    validateTimeSlot(day, period);
  };

  const handleTimeChange = (day, period, field, value) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [period]: {
          ...prev[day][period],
          [field]: value
        }
      }
    }));
    validateTimeSlot(day, period);
  };

  const validateTimeSlot = (day, period) => {
    const slot = availability[day][period];
    const newErrors = { ...errors };
    
    if (slot.available) {
      if (!slot.startTime || !slot.endTime || !slot.maxPatients) {
        newErrors[`${day}-${period}`] = 'Please fill all fields';
      } else if (parseInt(slot.maxPatients) <= 0) {
        newErrors[`${day}-${period}`] = 'Max patients must be greater than 0';
      } else {
        delete newErrors[`${day}-${period}`];
      }
    } else {
      delete newErrors[`${day}-${period}`];
    }
    
    setErrors(newErrors);
  };

  const validateAll = () => {
    const newErrors = {};
    let isValid = true;
    
    DAYS_OF_WEEK.forEach(day => {
      ['morning', 'afternoon'].forEach(period => {
        const slot = availability[day][period];
        if (slot.available) {
          if (!slot.startTime || !slot.endTime || !slot.maxPatients) {
            newErrors[`${day}-${period}`] = 'Please fill all fields';
            isValid = false;
            setExpandedDays(prev => ({ ...prev, [day]: true }));
          } else if (parseInt(slot.maxPatients) <= 0) {
            newErrors[`${day}-${period}`] = 'Max patients must be greater than 0';
            isValid = false;
            setExpandedDays(prev => ({ ...prev, [day]: true }));
          }
        }
      });
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (validateAll()) {
      setIsSaving(true);
      
      // Process and save data
      setTimeout(() => {
        onSave(availability);
        setIsSaving(false);
        onClose();
      }, 500);
    }
  };

  const formatDayName = (day) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      backdropTransitionOutTiming={0}
      style={styles.modal}
      avoidKeyboard
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Manage Schedule</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Entypo name="cross" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.scrollView}>
          <Text style={styles.description}>
            Set your availability schedule for patient appointments
          </Text>
          
          {DAYS_OF_WEEK.map((day) => (
            <View key={day} style={styles.dayContainer}>
              <TouchableOpacity 
                style={[
                  styles.dayHeader, 
                  expandedDays[day] && styles.dayHeaderActive
                ]} 
                onPress={() => toggleDay(day)}
              >
                <Text style={styles.dayTitle}>{formatDayName(day)}</Text>
                <Entypo 
                  name={expandedDays[day] ? "chevron-up" : "chevron-down"} 
                  size={24} 
                  color={theme.colors.primary} 
                />
              </TouchableOpacity>
              
              {expandedDays[day] && (
                <View style={styles.dayContent}>
                  {/* Morning section */}
                  <View style={styles.periodSection}>
                    <Text style={styles.periodTitle}>Morning</Text>
                    <View style={styles.switchRow}>
                      <Text style={styles.switchLabel}>Available</Text>
                      <Switch
                        value={availability[day]?.morning?.available}
                        onValueChange={(value) => handleAvailabilityChange(day, 'morning', value)}
                        color={theme.colors.primary}
                      />
                    </View>
                    
                    {availability[day]?.morning?.available && (
                      <View style={styles.timeSlotContainer}>
                        <View style={styles.inputRow}>
                          <View style={styles.inputHalf}>
                            <Text style={styles.inputLabel}>Start Time</Text>
                            <TextInput
                              mode="outlined"
                              placeholder="08:00"
                              value={availability[day]?.morning?.startTime}
                              onChangeText={(text) => handleTimeChange(day, 'morning', 'startTime', text)}
                              style={styles.timeInput}
                              keyboardType="default"
                              outlineColor="#E0E0E0"
                              activeOutlineColor={theme.colors.primary}
                              right={<TextInput.Icon icon="clock" color={theme.colors.primary} />}
                            />
                          </View>
                          <View style={styles.inputHalf}>
                            <Text style={styles.inputLabel}>End Time</Text>
                            <TextInput
                              mode="outlined"
                              placeholder="12:00"
                              value={availability[day]?.morning?.endTime}
                              onChangeText={(text) => handleTimeChange(day, 'morning', 'endTime', text)}
                              style={styles.timeInput}
                              keyboardType="default"
                              outlineColor="#E0E0E0"
                              activeOutlineColor={theme.colors.primary}
                              right={<TextInput.Icon icon="clock" color={theme.colors.primary} />}
                            />
                          </View>
                        </View>
                        <View style={styles.inputRow}>
                          <View style={styles.inputHalf}>
                            <Text style={styles.inputLabel}>Max Patients</Text>
                            <TextInput
                              mode="outlined"
                              placeholder="5"
                              value={availability[day]?.morning?.maxPatients.toString()}
                              onChangeText={(text) => handleTimeChange(day, 'morning', 'maxPatients', text)}
                              style={styles.timeInput}
                              keyboardType="number-pad"
                              outlineColor="#E0E0E0"
                              activeOutlineColor={theme.colors.primary}
                              right={<TextInput.Icon icon="account-multiple" color={theme.colors.primary} />}
                            />
                          </View>
                        </View>
                        {errors[`${day}-morning`] && (
                          <Text style={styles.errorText}>{errors[`${day}-morning`]}</Text>
                        )}
                      </View>
                    )}
                  </View>
                  
                  <Divider style={styles.divider} />
                  
                  {/* Afternoon section */}
                  <View style={styles.periodSection}>
                    <Text style={styles.periodTitle}>Afternoon</Text>
                    <View style={styles.switchRow}>
                      <Text style={styles.switchLabel}>Available</Text>
                      <Switch
                        value={availability[day]?.afternoon?.available}
                        onValueChange={(value) => handleAvailabilityChange(day, 'afternoon', value)}
                        color={theme.colors.primary}
                      />
                    </View>
                    
                    {availability[day]?.afternoon?.available && (
                      <View style={styles.timeSlotContainer}>
                        <View style={styles.inputRow}>
                          <View style={styles.inputHalf}>
                            <Text style={styles.inputLabel}>Start Time</Text>
                            <TextInput
                              mode="outlined"
                              placeholder="13:00"
                              value={availability[day]?.afternoon?.startTime}
                              onChangeText={(text) => handleTimeChange(day, 'afternoon', 'startTime', text)}
                              style={styles.timeInput}
                              keyboardType="default"
                              outlineColor="#E0E0E0"
                              activeOutlineColor={theme.colors.primary}
                              right={<TextInput.Icon icon="clock" color={theme.colors.primary} />}
                            />
                          </View>
                          <View style={styles.inputHalf}>
                            <Text style={styles.inputLabel}>End Time</Text>
                            <TextInput
                              mode="outlined"
                              placeholder="17:00"
                              value={availability[day]?.afternoon?.endTime}
                              onChangeText={(text) => handleTimeChange(day, 'afternoon', 'endTime', text)}
                              style={styles.timeInput}
                              keyboardType="default"
                              outlineColor="#E0E0E0"
                              activeOutlineColor={theme.colors.primary}
                              right={<TextInput.Icon icon="clock" color={theme.colors.primary} />}
                            />
                          </View>
                        </View>
                        <View style={styles.inputRow}>
                          <View style={styles.inputHalf}>
                            <Text style={styles.inputLabel}>Max Patients</Text>
                            <TextInput
                              mode="outlined"
                              placeholder="5"
                              value={availability[day]?.afternoon?.maxPatients.toString()}
                              onChangeText={(text) => handleTimeChange(day, 'afternoon', 'maxPatients', text)}
                              style={styles.timeInput}
                              keyboardType="number-pad"
                              outlineColor="#E0E0E0"
                              activeOutlineColor={theme.colors.primary}
                              right={<TextInput.Icon icon="account-multiple" color={theme.colors.primary} />}
                            />
                          </View>
                        </View>
                        {errors[`${day}-afternoon`] && (
                          <Text style={styles.errorText}>{errors[`${day}-afternoon`]}</Text>
                        )}
                      </View>
                    )}
                  </View>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
        
        <View style={styles.footer}>
          <Button 
            mode="outlined" 
            onPress={onClose}
            style={styles.cancelButton}
            labelStyle={styles.buttonLabel}
          >
            Cancel
          </Button>
          <Button 
            mode="contained" 
            onPress={handleSave}
            style={styles.saveButton}
            labelStyle={styles.buttonLabel}
            disabled={isSaving}
            loading={isSaving}
          >
            Save Schedule
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
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontFamily: sd.fonts.bold,
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    padding: 16,
  },
  description: {
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: '#666',
    marginBottom: 16,
  },
  dayContainer: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
  },
  dayHeaderActive: {
    backgroundColor: '#e8f4f8',
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  dayTitle: {
    fontSize: 16,
    fontFamily: sd.fonts.medium,
    color: '#333',
  },
  dayContent: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  periodSection: {
    marginVertical: 4,
  },
  periodTitle: {
    fontSize: 15,
    fontFamily: sd.fonts.medium,
    color: '#2196F3',
    marginBottom: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: '#333',
  },
  timeSlotContainer: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  inputHalf: {
    width: '48%',
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: sd.fonts.medium,
    color: '#666',
    marginBottom: 4,
  },
  timeInput: {
    backgroundColor: '#fff',
    height: 40,
  },
  divider: {
    marginVertical: 12,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    fontFamily: sd.fonts.regular,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    borderColor: '#2196F3',
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#2196F3',
  },
  buttonLabel: {
    fontFamily: sd.fonts.medium,
  }
});

export default DoctorScheduleModal;