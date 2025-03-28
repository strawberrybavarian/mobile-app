import sd from '@/utils/styleDictionary';
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { Button, useTheme } from 'react-native-paper';

const CancelAppointmentModal = ({ isVisible, closeModal, onCancel }) => {
  const theme = useTheme(); // Access the theme
  const [cancelReason, setCancelReason] = useState('');

  const handleCancelPress = () => {
    onCancel(cancelReason);
    closeModal();
  };

  return (
    <Modal
      isVisible={isVisible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      onBackdropPress={closeModal}
      onSwipeComplete={closeModal}
      propagateSwipe={true}
      style={styles.modal}
      coverScreen={true}
      hideModalContentWhileAnimating={true}
      useNativeDriver={true}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            Reason for Cancellation
          </Text>
          <TextInput
            placeholder="Enter reason"
            placeholderTextColor={theme.colors.onSurfaceVariant}
            value={cancelReason}
            onChangeText={setCancelReason}
            style={[
              styles.input,
              {
                borderColor: theme.colors.outline,
                color: theme.colors.onSurface,
              },
            ]}
          />
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleCancelPress}
              style={styles.submitButton}
              buttonColor={theme.colors.error}
              textColor={theme.colors.onError}
            >
               <Text style={{ fontSize: sd.fontSizes.lg, fontFamily: sd.fonts.semiBold }}>
                Submit
                </Text>
            </Button>
            <Button
              mode="outlined"
              onPress={closeModal}
              style={styles.closeButton}
              textColor={theme.colors.primary}
            >
               <Text style={{ fontSize: sd.fontSizes.lg, fontFamily: sd.fonts.semiBold }}>
                Close
                </Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0, // Ensures the modal takes up the entire screen
    justifyContent: 'center',
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitButton: {
    flex: 1,
    marginRight: 10,
    borderRadius: 5,
  },
  closeButton: {
    flex: 1,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default CancelAppointmentModal;