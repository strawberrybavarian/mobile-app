// AppointmentModal.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import styles from './DoctorUpcomingStyles'; // Adjust path if necessary
import CancelModal from './ButtonModals/CancelModal';
import RescheduleModal from './ButtonModals/RescheduleModal';
import AcceptModal from './ButtonModals/AcceptModal';
import sd from '../../../utils/styleDictionary';

const AppointmentDetail = ({ label, value }) => {
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
    // const [isCancelModalVisible, setCancelModalVisible] = useState(false);
    // const [isAcceptModalVisible, setAcceptModalVisible] = useState(false);
    // const [isRescheduleModalVisible, setRescheduleModalVisible] = useState(false);

    // const handleCancel = () => setCancelModalVisible(true);
    // const handleAccept = () => setAcceptModalVisible(true);
    // const handleReschedule = () => setRescheduleModalVisible(true);

    

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
        <View style={styles.modalContent}>
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
