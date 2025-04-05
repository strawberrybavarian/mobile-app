import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import sd from '../../../../utils/styleDictionary';

const RescheduleModal = ({ isVisible, onClose, onReschedule, appointment }) => {
  const [reason, setReason] = useState('');
  const theme = useTheme();
  
  const handleSubmit = () => {
    onReschedule(reason, appointment?._id);
    setReason('');
  };
  
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      swipeDirection={['down']}
      onSwipeComplete={onClose}
      backdropOpacity={0.7}
    >
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.headerTitle}>Reschedule Appointment</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
        
        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.label}>Reason for rescheduling:</Text>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={3}
            value={reason}
            onChangeText={setReason}
            placeholder="Enter reason here..."
            textAlignVertical="top"
          />
          
          {/* Patient name and date display */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <MaterialIcons name="person" size={14} color={theme.colors.primary} style={styles.icon} />
              <Text style={styles.detailText}>
                {appointment?.patient?.patient_firstName} {appointment?.patient?.patient_lastName}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <MaterialIcons name="event" size={14} color={theme.colors.primary} style={styles.icon} />
              <Text style={styles.detailText}>
                {appointment ? new Date(appointment.date).toLocaleDateString() : ''} | {appointment?.time || ''}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]} 
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Close</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.confirmButton, { backgroundColor: theme.colors.primary }]} 
            onPress={handleSubmit}
            disabled={!reason.trim()}
          >
            <Text style={styles.confirmButtonText}>Reschedule</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12
  },
  headerTitle: {
    color: 'white',
    fontSize: 16,
    fontFamily: sd.fonts.medium
  },
  closeButton: {
    padding: 3
  },
  content: {
    padding: 12
  },
  label: {
    fontSize: 14,
    fontFamily: sd.fonts.medium,
    marginBottom: 8,
    color: '#444'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
    minHeight: 70,
    fontFamily: sd.fonts.regular
  },
  detailsContainer: {
    marginTop: 12,
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 6
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  icon: {
    marginRight: 6
  },
  detailText: {
    fontSize: 13,
    fontFamily: sd.fonts.regular,
    color: '#555'
  },
  buttonRow: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    justifyContent: 'space-between'
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    minWidth: 80,
    alignItems: 'center'
  },
  cancelButton: {
    backgroundColor: '#f2f2f2'
  },
  confirmButton: {
    backgroundColor: '#1976D2'
  },
  cancelButtonText: {
    color: '#555',
    fontFamily: sd.fonts.medium,
    fontSize: 13
  },
  confirmButtonText: {
    color: 'white',
    fontFamily: sd.fonts.medium,
    fontSize: 13
  }
});

export default RescheduleModal;
