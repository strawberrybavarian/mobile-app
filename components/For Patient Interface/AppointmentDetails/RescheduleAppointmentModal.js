import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { styles } from './ModalStyles'; // Importing styles from a separate file
import moment from 'moment'; // moment.js for date manipulation
import Modal from 'react-native-modal';

const RescheduleModal = ({ isVisible, closeModal, onReschedule }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  const availableTimeSlots = [
    { label: "8:00 AM to 11:00 AM", value: "8:00 AM to 11:00 AM" },
    { label: "3:00 PM to 4:00 PM", value: "3:00 PM to 4:00 PM" }
  ];

  const days = Array.from({ length: 31 }, (_, i) => ({ label: `${i + 1}`, value: i + 1 }));
  const months = Array.from({ length: 12 }, (_, i) => ({ label: moment().month(i).format('MMMM'), value: i + 1 }));
  const years = Array.from({ length: 5 }, (_, i) => ({ label: `${moment().year() + i}`, value: moment().year() + i }));

  useEffect(() => {
    // Clear selection if the selected date becomes invalid
    if (selectedDate && selectedMonth && selectedYear) {
      const selectedFullDate = moment(`${selectedYear}-${selectedMonth}-${selectedDate}`, 'YYYY-MM-DD');
      const today = moment().startOf('day');
      if (selectedFullDate.isBefore(today) || selectedFullDate.isSame(today.add(1, 'day'))) {
        setSelectedDate(null); // Clear invalid date
        alert("Selected date cannot be today, in the past, or tomorrow.");
      }
    }
  }, [selectedDate, selectedMonth, selectedYear]);

  const handleReschedulePress = () => {
    if (selectedDate && selectedMonth && selectedYear && selectedTimeSlot) {
      const rescheduledDate = moment(`${selectedYear}-${selectedMonth}-${selectedDate}`, 'YYYY-MM-DD').toDate();
      onReschedule(rescheduledDate, selectedTimeSlot);
      closeModal();
    } else {
      alert("Please select a valid date and a time slot.");
    }
  };

  return (
    <Modal 
      //transparent={true} 
      isVisible={isVisible} 
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      onBackdropPress={closeModal}
      onSwipeComplete={closeModal}
      propagateSwipe={true}
      style = {styles.modal}
      coverScreen = {true}
      hideModalContentWhileAnimating={true}
      useNativeDriver={true}
      >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Reschedule Appointment</Text>

          <View style = {styles.dropdownBody}>
            <Text style={styles.subtitle}>Select a Date</Text>
            <View style = {styles.dropdownParent}>

              <View style={styles.dropdownContainer}>
                <Dropdown
                  style={styles.dropdown}
                  data={months}
                  labelField="label"
                  valueField="value"
                  placeholder="Month"
                  value={selectedMonth}
                  onChange={(item) => setSelectedMonth(item.value)}
                />
              </View>

              <View style={styles.dropdownContainer}>
                <Dropdown
                  style={styles.dropdown}
                  data={days}
                  labelField="label"
                  valueField="value"
                  placeholder="Day"
                  value={selectedDate}
                  onChange={(item) => setSelectedDate(item.value)}
                />
              </View>

              <View style={styles.dropdownContainer}>
                <Dropdown
                  style={styles.dropdown}
                  data={years}
                  labelField="label"
                  valueField="value"
                  placeholder="Year"
                  value={selectedYear}
                  onChange={(item) => setSelectedYear(item.value)}
                />
              </View>
            </View>

            <Text style={styles.subtitle}>Select a Time Slot</Text>
            <View style={styles.dropdownContainer}>
              <Dropdown
                style={styles.dropdown}
                data={availableTimeSlots}
                labelField="label"
                valueField="value"
                placeholder="Select a timeslot..."
                value={selectedTimeSlot}
                onChange={(item) => setSelectedTimeSlot(item.value)}
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleReschedulePress}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={closeModal}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RescheduleModal;
