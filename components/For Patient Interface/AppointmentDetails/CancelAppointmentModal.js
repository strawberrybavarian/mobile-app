import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

const CancelAppointmentModal = ({ isVisible, closeModal, onCancel }) => {
  const [cancelReason, setCancelReason] = useState('');

  const handleCancelPress = () => {
    onCancel(cancelReason);
    closeModal();
  };

  return (
    <Modal 
      //transparent={true} 
      isVisible={isVisible} 
      //animationType="fade"
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
          <Text style={styles.title}>Reason for Cancellation</Text>
          <TextInput
            placeholder="Enter reason"
            value={cancelReason}
            onChangeText={setCancelReason}
            style={styles.input}
          />
          <TouchableOpacity style={styles.button} onPress={handleCancelPress}>
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
  modal : {
    margin: 0,  // Ensures the modal takes up the entire screen
    justifyContent: 'center',
    height: '100%',
    flex: 1,
  },
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
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: '#ff5c5c',
    padding: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CancelAppointmentModal;
