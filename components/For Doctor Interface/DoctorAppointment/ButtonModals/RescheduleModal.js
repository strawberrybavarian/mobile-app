import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import styles from '../DoctorUpcomingStyles'; // Adjust path if necessary
import CalendarPicker from 'react-native-calendar-picker';
import { Picker } from '@react-native-picker/picker';

const RescheduleModal = ({ isVisible, onClose, onReschedule, appointment }) => {

    const [newDate, setNewDate] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

    const availableTimeSlots = [
        { label: "8:00 AM to 11:00 AM", value: "8:00 AM to 11:00 AM" },
        { label: "3:00 PM to 4:00 PM", value: "3:00 PM to 4:00 PM" }
    ];


    return (
        <Modal
        isVisible={isVisible}
        onBackdropPress={onClose}
        style={styles.modal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        swipeDirection={['down']}
        onSwipeComplete={onClose}
        coverScreen={true}
        >
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
            <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} style={styles.button}>
                <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onReschedule(newDate, selectedTimeSlot, appointment._id)} style={styles.button}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            
            </View>
        </View>
        </Modal>
    );
};

export default RescheduleModal;
