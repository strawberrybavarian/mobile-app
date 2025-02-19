// AppointmentModal.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import DoctorUpcomingStyles from './DoctorUpcomingStyles'; // Adjust path if necessary
import CancelModal from './ButtonModals/CancelModal';
import RescheduleModal from './ButtonModals/RescheduleModal';
import AcceptModal from './ButtonModals/AcceptModal';
import sd from '../../../utils/styleDictionary';
import { useTheme } from 'react-native-paper';

const AppointmentDetail = ({ label, value }) => {
    const styles = DoctorUpcomingStyles();

    if (!value || value.length == 0 ){
        value = "N/A"
    }
    return (
  <View style={styles.modalTextCont}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.modalText}>{value}</Text>
  </View>
)};

const AppointmentModal = ({ isVisible, appointment, onClose, onCancel, onAccept, onReschedule, fetchAppointments }) => {
  const styles = DoctorUpcomingStyles();
  const theme = useTheme();

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
      propagateSwipe={true}
    >
      {appointment && (
        <View style={[styles.modalContent, {height: Dimensions.get('window').height*0.65}]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>{`<   Close`}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Appointment Details</Text>
          
          <AppointmentDetail 
            label="Patient:" 
            value={`${appointment.patient.patient_firstName} ${appointment.patient.patient_lastName}`} 
          />
          <AppointmentDetail 
            label="Date:" 
            value={new Date(appointment.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })} 
          />
          <AppointmentDetail 
            label="Timeslot:" 
            value={appointment.time} 
          />
          <AppointmentDetail 
            label="Status:" 
            value={appointment.status} 
          />
          <AppointmentDetail 
            label="Reason:" 
            value={appointment.reason} 
          />
          <AppointmentDetail 
            label="Laboratory Results:" 
            value={appointment.laboratoryResults} 
          />
         
        </View>
      )}
         
      

        
      
    </Modal>
  );
};

export default AppointmentModal;
