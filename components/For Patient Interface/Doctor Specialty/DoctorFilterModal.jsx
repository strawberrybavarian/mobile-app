import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Dialog, Portal, Button, Chip, IconButton } from 'react-native-paper';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { TimePickerModal } from 'react-native-paper-dates';
import sd from '../../../utils/styleDictionary';

const DAYS_DISPLAY = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun"
};

const DoctorFilterModal = ({ 
  visible, 
  onDismiss,
  onApply,
  onReset,
  tempSelectedDays,
  setTempSelectedDays,
  tempAvailability, 
  setTempAvailability,
  tempClinicHoursRange,
  setTempClinicHoursRange
}) => {
  const [startTimeVisible, setStartTimeVisible] = useState(false);
  const [endTimeVisible, setEndTimeVisible] = useState(false);

  // Initialize temporary states when modal opens
  useEffect(() => {
    if (visible) {
      // Reset or initialize temp states when modal opens
      setTempSelectedDays({...tempSelectedDays});
      setTempAvailability({...tempAvailability});
      setTempClinicHoursRange({...tempClinicHoursRange});
    }
  }, [visible]);

  const handleTempDayChange = (day) => {
    setTempSelectedDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  const handleTempAvailabilityChange = (period) => {
    setTempAvailability(prev => ({
      ...prev,
      [period]: !prev[period]
    }));
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    if (hours && minutes) {
      const hour = parseInt(hours, 10);
      const period = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${period}`;
    }
    return timeString;
  };

  const onStartTimeConfirm = ({ hours, minutes }) => {
    const hoursFormatted = hours.toString().padStart(2, '0');
    const minutesFormatted = minutes.toString().padStart(2, '0');
    const formattedTime = `${hoursFormatted}:${minutesFormatted}`;
    setTempClinicHoursRange(prev => ({
      ...prev,
      start: formattedTime
    }));
    setStartTimeVisible(false);
  };

  const onEndTimeConfirm = ({ hours, minutes }) => {
    const hoursFormatted = hours.toString().padStart(2, '0');
    const minutesFormatted = minutes.toString().padStart(2, '0');
    const formattedTime = `${hoursFormatted}:${minutesFormatted}`;
    setTempClinicHoursRange(prev => ({
      ...prev,
      end: formattedTime
    }));
    setEndTimeVisible(false);
  };

  const handleReset = () => {
    // Reset all temp states
    setTempSelectedDays({
      monday: false, tuesday: false, wednesday: false, 
      thursday: false, friday: false, saturday: false, sunday: false
    });
    setTempAvailability({ am: false, pm: false });
    setTempClinicHoursRange({ start: '', end: '' });
    
    // Call parent's reset function
    onReset();
  };

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
        style={styles.filterDialog}
      >
        <Dialog.Title style={styles.dialogTitle}>Advanced Filters</Dialog.Title>
        <Dialog.Content style={styles.dialogContent}>
          <ScrollView style={styles.scrollView}>
            {/* Days filter */}
            <View style={styles.filterSection}>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={styles.filterSectionTitle}>
                <View>
                <FontAwesome5 name="calendar-alt" size={12} style={{marginRight: 5}} color={sd.colors.blue} />
                </View>
                <Text style={{marginLeft: 5}}>Available Days</Text>
                </Text>
              </View>
              <View style={styles.daysContainer}>
                {Object.entries(DAYS_DISPLAY).map(([day, label]) => (
                  <Chip
                    key={day}
                    selected={tempSelectedDays[day]}
                    onPress={() => handleTempDayChange(day)}
                    style={[
                      styles.dayChip,
                      tempSelectedDays[day] && styles.selectedDayChip
                    ]}
                    textStyle={[
                      styles.dayChipText,
                      tempSelectedDays[day] && styles.selectedDayChipText
                    ]}
                    size="small"
                  >
                    {label}
                  </Chip>
                ))}
              </View>
            </View>
            
            {/* AM/PM filter */}
            <View style={styles.filterSection}>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={styles.filterSectionTitle}>
                  <View>
                    <FontAwesome5 name="clock" size={12} style={{marginRight: 5}} color={sd.colors.blue} />
                  </View>
                  <Text style={{marginLeft: 5}}>Time of Day</Text>
                </Text>
              </View>
              <View style={styles.timeContainer}>
                <TouchableOpacity
                  style={[
                    styles.timeButton,
                    tempAvailability.am && styles.selectedTimeButton
                  ]}
                  onPress={() => handleTempAvailabilityChange('am')}
                >
                  <Text style={[
                    styles.timeButtonText,
                    tempAvailability.am && styles.selectedTimeButtonText
                  ]}>AM</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.timeButton,
                    tempAvailability.pm && styles.selectedTimeButton
                  ]}
                  onPress={() => handleTempAvailabilityChange('pm')}
                >
                  <Text style={[
                    styles.timeButtonText,
                    tempAvailability.pm && styles.selectedTimeButtonText
                  ]}>PM</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Clinic Hours filter */}
            <View style={styles.filterSection}>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={styles.filterSectionTitle}>
                  <View>
                    <FontAwesome5 name="clinic-medical" size={12} style={{marginRight: 5}} color={sd.colors.blue} />
                  </View>
                  <Text style={{marginLeft: 5}}>Clinic Hours</Text>
                </Text>
              </View>
              <View style={styles.timePickerContainer}>
                <View style={styles.timePickerItem}>
                  <Text style={styles.timePickerLabel}>From:</Text>
                  <TouchableOpacity
                    style={styles.timePickerButton}
                    onPress={() => setStartTimeVisible(true)}
                  >
                    <Text style={styles.timePickerButtonText}>
                      {tempClinicHoursRange.start ? formatTime(tempClinicHoursRange.start) : 'Select time'}
                    </Text>
                    <Ionicons name="time-outline" size={16} color={sd.colors.blue} />
                  </TouchableOpacity>
                  {tempClinicHoursRange.start && (
                    <IconButton
                      icon="close-circle"
                      size={16}
                      iconColor={sd.colors.blue}
                      onPress={() => {
                        setTempClinicHoursRange(prev => ({...prev, start: ''}));
                      }}
                      style={styles.clearTimeButton}
                    />
                  )}
                </View>
                <View style={styles.timePickerItem}>
                  <Text style={styles.timePickerLabel}>To:</Text>
                  <TouchableOpacity
                    style={styles.timePickerButton}
                    onPress={() => setEndTimeVisible(true)}
                  >
                    <Text style={styles.timePickerButtonText}>
                      {tempClinicHoursRange.end ? formatTime(tempClinicHoursRange.end) : 'Select time'}
                    </Text>
                    <Ionicons name="time-outline" size={16} color={sd.colors.blue} />
                  </TouchableOpacity>
                  {tempClinicHoursRange.end && (
                    <IconButton
                      icon="close-circle"
                      size={16}
                      iconColor={sd.colors.blue}
                      onPress={() => {
                        setTempClinicHoursRange(prev => ({...prev, end: ''}));
                      }}
                      style={styles.clearTimeButton}
                    />
                  )}
                </View>
              </View>
              <TimePickerModal
                visible={startTimeVisible}
                onDismiss={() => setStartTimeVisible(false)}
                onConfirm={onStartTimeConfirm}
                hours={tempClinicHoursRange.start ? parseInt(tempClinicHoursRange.start.split(':')[0]) : 8}
                minutes={tempClinicHoursRange.start ? parseInt(tempClinicHoursRange.start.split(':')[1]) : 0}
              />
              <TimePickerModal
                visible={endTimeVisible}
                onDismiss={() => setEndTimeVisible(false)}
                onConfirm={onEndTimeConfirm}
                hours={tempClinicHoursRange.end ? parseInt(tempClinicHoursRange.end.split(':')[0]) : 17}
                minutes={tempClinicHoursRange.end ? parseInt(tempClinicHoursRange.end.split(':')[1]) : 0}
              />
            </View>
          </ScrollView>
        </Dialog.Content>
        <Dialog.Actions style={styles.dialogActions}>
          <Button 
            mode="text" 
            onPress={handleReset}
            contentStyle={{ paddingHorizontal: 8 }}
            labelStyle={{ fontSize: 12 }}
          >
            Reset
          </Button>
          <Button 
            mode="contained" 
            onPress={onApply}
            contentStyle={{ paddingHorizontal: 12 }}
            labelStyle={{ fontSize: 12 }}
          >
            Apply
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  filterDialog: {
    borderRadius: 12,
    width: '85%',
    alignSelf: 'center',
  },
  dialogTitle: {
    textAlign: 'center',
    fontFamily: sd.fonts.semiBold,
    color: sd.colors.blue,
    fontSize: 16,
    paddingVertical: 8,
    marginBottom: 0
  },
  dialogContent: {
    paddingVertical: 6
  },
  scrollView: {
    maxHeight: 260
  },
  filterSection: {
    marginBottom: 12
  },
  filterSectionTitle: {
    fontSize: 13,
    fontFamily: sd.fonts.medium,
    marginBottom: 6,
    color: '#424242',
    gap: 10,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayChip: {
    margin: 4,
    backgroundColor: '#F0F0F0',
    borderColor: 'transparent',
    height: 'auto'
  },
  selectedDayChip: {
    backgroundColor: `${sd.colors.blue}20`,
    borderColor: sd.colors.blue
  },
  dayChipText: {
    fontSize: sd.fontSizes.small,
    fontFamily: sd.fonts.regular,
    color: '#616161'
  },
  selectedDayChipText: {
    color: sd.colors.blue
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  timeButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    backgroundColor: '#F0F0F0',
    marginRight: 10
  },
  selectedTimeButton: {
    backgroundColor: `${sd.colors.blue}20`,
    borderColor: sd.colors.blue,
    borderWidth: 1
  },
  timeButtonText: {
    fontSize: 12,
    fontFamily: sd.fonts.medium,
    color: '#616161'
  },
  selectedTimeButtonText: {
    color: sd.colors.blue
  },
  timePickerContainer: {
    marginTop: 8,
  },
  timePickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timePickerLabel: {
    width: 40,
    fontSize: 13,
    fontFamily: sd.fonts.regular,
    color: '#424242',
  },
  timePickerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 36,
  },
  timePickerButtonText: {
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: '#212121',
  },
  clearTimeButton: {
    margin: 0,
    padding: 0,
  },
  timeInput: {
    flex: 1,
    padding: 8,
    height: 36,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginRight: 8,
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: '#212121'
  },
  dialogActions: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    justifyContent: 'space-between'
  }
});

export default DoctorFilterModal;