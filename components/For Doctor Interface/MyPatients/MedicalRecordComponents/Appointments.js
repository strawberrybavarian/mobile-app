// Appointments.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Appointments = ({ displayInfo }) => {
  // Check if there are appointments to display
  if (!displayInfo || displayInfo.length === 0) {
    return <Text style={styles.noDataText}>No appointments available</Text>;
  }

  return (
    <View style={styles.container}>
      {displayInfo.map((appointment, index) => (
        <View key={appointment._id || index} style={styles.appointmentContainer}>
          <Text style={styles.title}>Appointment {index + 1}</Text>
          <Text style={styles.text}>Date: {new Date(appointment.date).toLocaleDateString()}</Text>
          <Text style={styles.text}>Time: {appointment.time}</Text>
          <Text style={styles.text}>Type: {appointment.appointment_type[0].appointment_type}</Text>
          <Text style={styles.text}>Category: {appointment.appointment_type[0].category}</Text>
          <Text style={styles.text}>Reason: {appointment.reason || 'Not provided'}</Text>
          <Text style={styles.text}>Status: {appointment.status}</Text>
          <Text style={styles.text}>Follow-Up: {appointment.followUp ? 'Yes' : 'No'}</Text>
          <Text style={styles.text}>
            Doctor License: {appointment.doctor?.dr_licenseNo || 'Not available'}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  appointmentContainer: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    marginVertical: 2,
  },
  noDataText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Appointments;
