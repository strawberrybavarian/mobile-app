import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import styles from '../DoctorUpcomingStyles';
import sd from '../../../../utils/styleDictionary';

const CancelModal = ({ isVisible, onClose, onCancel, appointment }) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.centeredModal} // Updated style for centering the modal
      animationIn="slideInUp"
      animationOut="slideOutDown"
      swipeDirection={['down']}
      onSwipeComplete={onClose}
      coverScreen={true}
    >
      <View style={styles.floatingModalContent}> 
        <Text style={styles.label}>Cancel Appointment</Text>
        <Text>Are you sure you want to cancel this appointment?</Text>
        
        <View style={styles.floatingButtonContainer}>
          <TouchableOpacity onPress={onClose} style={[styles.button, {backgroundColor: sd.colors.blue}]}>
            <Text style={styles.buttonText}>No</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            onCancel(appointment.cancelReason, appointment); 
            onClose();
          }} style={styles.button}>
            <Text style={styles.buttonText}>Yes, Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CancelModal;
