// AppointmentModal.js
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import sd from '../../../utils/styleDictionary';

const InfoCard = ({ icon, title, value }) => {
  const theme = useTheme();
  
  if (!value || value.length === 0) {
    value = "N/A";
  }
  
  return (
    <View style={styles.infoCard}>
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.surfaceVariant || '#EAF4FF' }]}>
        <MaterialIcons name={icon} size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
};

const AppointmentModal = ({ isVisible, appointment, onClose, onCancel, onAccept, onReschedule, fetchAppointments }) => {
  const theme = useTheme();
  
  if (!appointment) return null;
  
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      propagateSwipe={true}
      coverScreen={true}
      hideModalContentWhileAnimating={true}
      useNativeDriver={true}
    >
      <View style={[styles.modalContainer, { backgroundColor: theme.colors.surface }]}>
        {/* Header Section */}
        <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.headerTitle, { color: theme.colors.onPrimary || '#fff' }]}>
            Appointment Details
          </Text>
          <View style={[styles.headerBadge, { backgroundColor: theme.colors.primaryContainer || '#0056b3' }]}>
            <Text style={[styles.headerBadgeText, { color: theme.colors.onPrimary || '#fff' }]}>
              ID: {appointment._id?.substring(0, 8)}...
            </Text>
          </View>
        </View>

        {/* Appointment Details */}
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.detailsGrid}>
            <InfoCard
              icon="person"
              title="Patient"
              value={`${appointment.patient.patient_firstName} ${appointment.patient.patient_lastName}`}
            />
            <InfoCard
              icon="event"
              title="Date"
              value={new Date(appointment.date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            />
            <InfoCard 
              icon="schedule" 
              title="Time" 
              value={appointment.time} 
            />
            <InfoCard 
              icon="info" 
              title="Status" 
              value={appointment.status} 
            />
            <InfoCard 
              icon="description" 
              title="Reason" 
              value={appointment.reason} 
            />
            <InfoCard 
              icon="science" 
              title="Laboratory Results" 
              value={appointment.laboratoryResults} 
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',

  },
  modalContainer: {
    height: '80%',
    backgroundColor: sd.colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerTitle: {
    fontSize: sd.fontSizes.large,
    fontFamily: sd.fonts.bold,
    color: '#fff',
  },
  headerBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  headerBadgeText: {
    fontSize: 12,
    color: 'blue',
    fontWeight: 'bold',
    
  },
  scrollContainer: {
    marginTop: 10,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoCard: {
    width: '48%',
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoContent: {
    alignItems: 'flex-start',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 12,
    color: '#555',
  },
});

export default AppointmentModal;
