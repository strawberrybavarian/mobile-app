// AppointmentModal.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Animated } from 'react-native';
import Modal from 'react-native-modal';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import sd from '../../../utils/styleDictionary';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const ApptStyles = (theme) => StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: sd.colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  collapsedContainer: {
    height: screenHeight * 0.7, // Increase from 60% to 70%
  },
  expandedContainer: {
    height: screenHeight * 0.95, // Keep at 95%
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: sd.fonts.bold,
    color: '#fff',
  },
  headerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  headerBadgeText: {
    fontSize: 10,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingBottom: 20, // Add padding at bottom for better scroll experience
  },
  contentContainer: {
    paddingBottom: 20,
  },
  detailsGrid: {
    paddingTop: 8,
  },
  infoCard: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.5,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  infoContent: {
    flex: 1,
    alignItems: 'flex-start',
  },
  infoTitle: {
    fontSize: sd.fontSizes.small,
    fontFamily: sd.fonts.semiBold,
    marginBottom: 3,
  },
  infoValue: {
    fontSize: sd.fontSizes.small,
    fontFamily: sd.fonts.regular,
    color: '#555',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  dragIndicator: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e0e0e0',
    marginTop: 8,
    marginBottom: 8,
  },
  expandButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 15,
    padding: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  actionButtonText: {
    fontSize: sd.fontSizes.small,
    fontFamily: sd.fonts.medium,
    marginLeft: 5,
  },
});

const InfoCard = ({ icon, title, value }) => {
  const theme = useTheme();
  
  if (!value || value.length === 0) {
    value = "N/A";
  }
  const styles = ApptStyles(theme);
  
  return (
    <View style={styles.infoCard}>
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.surfaceVariant || '#EAF4FF' }]}>
        <MaterialIcons name={icon} size={20} color={theme.colors.primary} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
};

const AppointmentModal = ({ isVisible, appointment, onClose, onCancel, onAccept, onReschedule, fetchAppointments, status }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  
  if (!appointment) return null;
  const styles = ApptStyles(theme);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  
  const showAcceptButton = status === 'Pending';
  const showRescheduleButton = ['Scheduled', 'Pending'].includes(status);
  const showCancelButton = ['Scheduled', 'Pending'].includes(status);
  
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      coverScreen={true}
      backdropOpacity={0.7}
      statusBarTranslucent={true}
      deviceHeight={screenHeight}
      useNativeDriver={true}
    >
      <View style={[
        styles.modalContainer,
        expanded ? styles.expandedContainer : styles.collapsedContainer,
        { backgroundColor: theme.colors.surface }
      ]}>
        <View style={styles.dragIndicator} />
        
        <TouchableOpacity 
          style={styles.expandButton}
          onPress={toggleExpand}
        >
          <MaterialIcons 
            name={expanded ? "fullscreen-exit" : "fullscreen"} 
            size={20} 
            color={theme.colors.primary} 
          />
        </TouchableOpacity>
        
        <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.headerTitle, { color: theme.colors.onPrimary || '#fff' }]}>
            Appointment Details
          </Text>
          <View style={[styles.headerBadge, { backgroundColor: theme.colors.primaryContainer || '#0056b3' }]}>
            <Text style={[styles.headerBadgeText, { color: theme.colors.primary || 'blue' }]}>
              ID: {appointment._id?.substring(0, 8)}...
            </Text>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollContainer} 
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true} // Add this to ensure nested scrolling works
          scrollEnabled={true} // Ensure scrolling is enabled
          bounces={true} // Add bounce effect for better UX feedback
        >
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
            <InfoCard 
              icon="local-hospital" 
              title="Service" 
              value={appointment.service || 'General Consultation'} 
            />
            <InfoCard 
              icon="phone" 
              title="Contact" 
              value={appointment.patient.patient_contactNumber || 'No contact info'} 
            />
            
            {appointment.cancelReason && (
              <InfoCard 
                icon="cancel" 
                title="Cancellation Reason" 
                value={appointment.cancelReason} 
              />
            )}
          </View>
        </ScrollView>
        
        <View style={styles.buttonsContainer}>
          {showAcceptButton && (
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
              onPress={onAccept}
            >
              <MaterialIcons name="check" size={16} color="white" />
              <Text style={[styles.actionButtonText, { color: 'white' }]}>Accept</Text>
            </TouchableOpacity>
          )}
          
          {showRescheduleButton && (
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.colors.tertiary || '#ff9800' }]}
              onPress={onReschedule}
            >
              <MaterialIcons name="schedule" size={16} color="white" />
              <Text style={[styles.actionButtonText, { color: 'white' }]}>Reschedule</Text>
            </TouchableOpacity>
          )}
          
          {showCancelButton && (
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.colors.error || '#f44336' }]}
              onPress={onCancel}
            >
              <MaterialIcons name="close" size={16} color="white" />
              <Text style={[styles.actionButtonText, { color: 'white' }]}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default AppointmentModal;
