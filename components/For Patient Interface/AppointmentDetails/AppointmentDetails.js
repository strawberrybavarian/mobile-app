import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { MaterialIcons } from '@expo/vector-icons';
import { Button, useTheme } from 'react-native-paper';
import axios from 'axios'; // Added missing axios import
import CancelAppointmentModal from './CancelAppointmentModal';
import RescheduleModal from './RescheduleAppointmentModal';
import { getData } from '../../storageUtility';
import { ip } from '../../../ContentExport';
import sd from '../../../utils/styleDictionary';

const AppointmentDetails = ({ appointmentData, closeModal, isVisible }) => {
  const theme = useTheme(); // Access the theme using the useTheme hook
  const [isCancelModalVisible, setCancelModalVisible] = useState(false);
  const [isRescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const styles = DetailStyles(theme);

  useEffect(() => {
    if (appointmentData && (appointmentData.status === 'Pending' || appointmentData.status === 'Scheduled')) {
      setIsButtonVisible(true);
    } else {
      setIsButtonVisible(false);
    }
  }, [appointmentData]);

  if (!appointmentData) return null;

  const handleCancel = async (cancelReason) => {
    try {
      const userId = await getData('userId');
      if (userId) {
        await axios.put(`${ip.address}/api/patient/${appointmentData._id}/updateappointment`, { cancelReason });
        closeModal();
      }
    } catch (error) {
      console.error(error);
    }
  };

//   const handleReschedule = async (newDate, newTime) => {
//     try {
//       const userId = await getData('userId');
//       if (userId) {
//         const rescheduleData = { newDate, newTime };
//         await axios.put(`${ip.address}/api/doctor/${appointmentData._id}/rescheduleappointment`, rescheduleData);
//         closeModal();
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return theme.colors.success || '#4CAF50';
      case 'Cancelled':
        return theme.colors.error;
      case 'Scheduled':
        return theme.colors.primary;
      case 'Pending':
        return theme.colors.notification || '#FFC107';
      default:
        return theme.colors.text;
    }
  };

  const InfoCard = ({ icon, title, value }) => (
    <View style={styles.infoCard}>
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.surfaceVariant || '#EAF4FF' }]}>
        <MaterialIcons name={icon} size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.infoContent}>
        <Text style={[styles.infoTitle, { color: theme.colors.onSurfaceVariant || '#555' }]}>{title}</Text>
        <Text style={[styles.infoValue, { color: theme.colors.onSurface || '#333' }]}>{value || 'N/A'}</Text>
      </View>
    </View>
  );

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={closeModal}
      onSwipeComplete={closeModal}
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
            <Text style={[styles.headerBadgeText, { color: theme.colors.onBackground || '#fff' }]}>
              ID: {appointmentData._id}
            </Text>
          </View>
        </View>

        {/* Appointment Details */}
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.detailsGrid}>
            <InfoCard
              icon="event"
              title="Date"
              value={new Date(appointmentData.date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            />
            <InfoCard icon="schedule" title="Time" value={appointmentData.time} />
            <InfoCard
              icon="person"
              title="Doctor"
              value={`Dr. ${appointmentData.doctor.dr_firstName} ${appointmentData.doctor.dr_lastName}`}
            />
            <InfoCard
              icon="medical-services"
              title="Appointment Type"
              value={appointmentData.appointment_type?.appointment_type}
            />
            <InfoCard 
              icon="info" 
              title="Status" 
              value={appointmentData.status} 
            />
            {appointmentData.reason && (
              <InfoCard icon="comment" title="Primary Concern" value={appointmentData.reason} />
            )}
          </View>
        </ScrollView>

        {/* Action Buttons */}
        {isButtonVisible && (
          <View style={styles.modalActions}>
            <Button
              mode="contained"
              onPress={() => setCancelModalVisible(true)}
              style={styles.cancelButton}
              buttonColor={theme.colors.error}
              textColor={theme.colors.onError || '#fff'}
            >
                <Text style={{ fontSize: sd.fontSizes.lg, fontFamily: sd.fonts.semiBold }}>
                Cancel Appointment
                </Text>
              
            </Button>
            {/* <Button
              mode="contained"
              onPress={() => setRescheduleModalVisible(true)}
              style={styles.rescheduleButton}
              buttonColor={theme.colors.primary}
              textColor={theme.colors.onPrimary || '#fff'}
            >
              Reschedule
            </Button> */}
          </View>
        )}

        {/* Cancel Appointment Modal */}
        <CancelAppointmentModal
          closeModal={() => setCancelModalVisible(false)}
          onCancel={handleCancel}
          isVisible={isCancelModalVisible}
        />
        {/* <RescheduleModal
          closeModal={() => setRescheduleModalVisible(false)}
          onReschedule={handleReschedule}
          isVisible={isRescheduleModalVisible}
        /> */}
      </View>
    </Modal>
  );
};

const DetailStyles = (theme) => StyleSheet.create({
  modalContainer: {
    height: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: theme?.colors.surfaceVariant,
    paddingBottom: 50,
  },
  scrollContainer: {
    flex: 1,
    marginTop: 10,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },

  // Header Section
  header: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: sd.fontSizes.xl,
    fontFamily: sd.fonts.bold,
    marginBottom: 10,
  },
  headerBadge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  headerBadgeText: {
    fontSize: 14,
    fontFamily: sd.fonts.medium,
    color: theme.colors.onBackground || '#fff',
  },

  // Details Grid
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },

  // Info Card
  infoCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontFamily: sd.fonts.medium,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: sd.fonts.bold,
  },

  // Action Buttons
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    borderRadius: 8,
  },
  rescheduleButton: {
    flex: 1,
    borderRadius: 8,
  },
});

export default AppointmentDetails;