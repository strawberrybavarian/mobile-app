// AppointmentList.js
import React from 'react';
import { Text, View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import DoctorUpcomingStyles from './DoctorUpcomingStyles';
import { useTheme } from 'react-native-paper';

const filterAppointments = (appointments, status) => {
  return appointments.filter(appointment => appointment.status === status);
};

const AppointmentList = ({ appointments, status, setSelectedAppointment }) => {
  const styles = DoctorUpcomingStyles();
  const theme = useTheme();

  const filteredAppointments = filterAppointments(appointments, status);

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.cont}>
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <TouchableOpacity 
              style={styles.cardcont}
              key={appointment._id}
              onPress={() => setSelectedAppointment(appointment)} // Open modal with selected appointment
            > 
              <View style={styles.container1}>
                <View style={styles.datecontainer}>
                  <Text style={styles.monthText}>{new Date(appointment.date).toLocaleString('en-US', { month: 'short' })}</Text>
                  <Text style={styles.dateText}>{new Date(appointment.date).toLocaleString('en-US', { day: '2-digit' })}</Text>
                </View>
                <View style={{ borderRightColor: 'black', borderRightWidth: StyleSheet.hairlineWidth, height: '100%', marginHorizontal: 10 }}></View>
                <View style={styles.infoCont}>
                  <Text style={styles.doctorName}>
                    {appointment.patient.patient_firstName} {appointment.patient.patient_lastName}
                  </Text>
                  <Text style={styles.dateTime}>
                    {new Date(appointment.date).toLocaleDateString('en-US')} | {appointment.time}
                  </Text>
                </View>
              </View>  
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noAppointments}>No appointments available.</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default AppointmentList;
