import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import styles from '../DoctorUpcomingStyles'; // Adjust path if necessary
import axios from 'axios';
import { ip } from '../../../../ContentExport';

const AcceptModal = ({ isVisible, onClose, onAccept, appointment }) => {

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
        <Text style={styles.title}>Accept Appointment</Text>
        <Text>Are you sure you want to accept this appointment?</Text>

        {/* Add any specific action for acceptance here */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={onClose} style={styles.button}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            onAccept(appointment);
            onClose();
          }} style={styles.button}>
            <Text style={styles.buttonText}>Yes, Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AcceptModal;
