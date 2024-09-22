import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Picker } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';

const RescheduleModal = ({ isVisible, closeModal, onReschedule }) => {
  const [newDate, setNewDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  const availableTimeSlots = [
    { label: "8:00 AM to 11:00 AM", value: "8:00 AM to 11:00 AM" },
    { label: "3:00 PM to 4:00 PM", value: "3:00 PM to 4:00 PM" }
  ];

  const handleReschedulePress = () => {
    if (newDate && selectedTimeSlot) {
      onReschedule(newDate, selectedTimeSlot);
      closeModal();
    } else {
      alert("Please select both a date and a time slot");
    }
  };

  return (
    <Modal transparent={true} visible={isVisible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Reschedule Appointment</Text>

          <Text style={styles.subtitle}>Select a Date</Text>
          <CalendarPicker
            onDateChange={(date) => setNewDate(date)}
            selectedDayColor="#92a3fd"
            selectedDayTextColor="white"
            todayBackgroundColor="transparent"
            todayTextStyle={{ color: '#000' }}
            textStyle={{ color: '#000', fontFamily: 'Poppins' }}
            dayShape="circle"
            width={250} // Reduce width to make the calendar smaller
            height={250} // Optional: adjust height
          />

          <Text style={styles.subtitle}>Select a Time Slot</Text>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={selectedTimeSlot}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedTimeSlot(itemValue)}
            >
              <Picker.Item label="Select a timeslot..." value={null} />
              {availableTimeSlots.map((slot, index) => (
                <Picker.Item key={index} label={slot.label} value={slot.value} />
              ))}
            </Picker>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleReschedulePress}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={closeModal}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginVertical: 10,
  },
  dropdownContainer: {
    width: '100%',
    borderColor: '#d3d3d3',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    height: 40,
    width: '100%',
  },
  button: {
    backgroundColor: '#5c85ff',
    padding: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default RescheduleModal;
