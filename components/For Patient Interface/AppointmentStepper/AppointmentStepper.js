import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import sd from '../../../utils/styleDictionary';

// Match web version status steps
const STATUS_STEPS = [
  'Pending',
  'Scheduled',
  'Ongoing', 
  'For Payment',
  'To-send',
  'Completed',
  'Rescheduled',
  'Cancelled',
];

// Icons for each status step
const STATUS_ICONS = {
  'Pending': 'hourglass-half',
  'Scheduled': 'calendar-check',
  'Ongoing': 'user-md',
  'For Payment': 'money-bill-wave',
  'To-send': 'paper-plane',
  'Completed': 'check-circle',
  'Cancelled': 'times-circle',
  'Rescheduled': 'redo'
};

const { width } = Dimensions.get('window');
const STEP_WIDTH = width * 0.25; // Each step takes 25% of screen width

const AppointmentStepper = ({ currentStatus, appointment }) => {
  const scrollViewRef = useRef(null);
  
  // Map "Archived" status to display as "Completed" for UI purposes
  const displayStatus = currentStatus === 'Archived' ? 'Completed' : currentStatus;
  
  // Find the index of current status in our steps
  const activeStep = STATUS_STEPS.indexOf(displayStatus);
  
  // Helper function to get status color
  const getStatusColor = (status) => {
    // First map "Archived" to "Completed" for consistent coloring
    const mappedStatus = status === 'Archived' ? 'Completed' : status;
    
    switch(mappedStatus) {
      case 'Completed': return sd.colors.green || '#28a745';
      case 'Cancelled': return sd.colors.red || '#dc3545';
      case 'Rescheduled': return sd.colors.yellow || '#ffc107';
      case 'Ongoing': return sd.colors.orange || '#fd7e14';
      case 'For Payment': return sd.colors.blue || '#007bff';
      case 'To-send': return sd.colors.purple || '#6f42c1';
      case 'Missed': return sd.colors.red || '#dc3545';
      default: return sd.colors.blue || '#007bff';
    }
  };
  
  // Helper function to determine step style based on current status
  const getStepStyle = (stepIndex) => {
    const cancelledIndex = STATUS_STEPS.indexOf('Cancelled');
    const rescheduledIndex = STATUS_STEPS.indexOf('Rescheduled');
    
    // Special handling for Cancelled and Rescheduled statuses
    if (displayStatus === 'Cancelled' && stepIndex === cancelledIndex) {
      return 'active';
    }
    
    if (displayStatus === 'Rescheduled' && stepIndex === rescheduledIndex) {
      return 'active';
    }
    
    if (stepIndex === activeStep) return 'active';
    if (stepIndex < activeStep) return 'completed';
    return 'pending';
  };
  
  // Format appointment date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric'
    });
  };
  
  // Format time to 12-hour format
  const formatTime = (timeString) => {
    if (!timeString) return 'Time not assigned';
    
    // Check if time is already in a formatted string with range
    if (timeString.includes(' - ')) {
      return timeString; // Return as is if it's already a range
    }
    
    // Try to parse as 24-hour time
    try {
      const [hours, minutes] = timeString.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12;
      return `${hour12}:${String(minutes).padStart(2, '0')} ${period}`;
    } catch (e) {
      return timeString; // Return original if parsing fails
    }
  };
  
  // Get appointment type
  const getAppointmentType = () => {
    if (!appointment || !appointment.appointment_type) return 'N/A';
    
    if (Array.isArray(appointment.appointment_type) && appointment.appointment_type.length > 0) {
      return appointment.appointment_type[0].appointment_type || 'N/A';
    }
    
    return appointment.appointment_type.appointment_type || 'N/A';
  };

  // Scroll to active step when component mounts or when status changes
  React.useEffect(() => {
    // Create a timer reference so we can clear it if needed
    let scrollTimer = null;
    
    if (activeStep >= 0) {
      // Add a longer delay to ensure the ScrollView is fully rendered
      scrollTimer = setTimeout(() => {
        // Double-check that the ref is still valid before scrolling
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({
            x: Math.max(0, (activeStep - 1) * STEP_WIDTH),
            animated: true
          });
        }
      }, 500); // Increased from 300ms to 500ms
    }
    
    // Clean up the timer if the component unmounts
    return () => {
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
    };
  }, [activeStep]);

  return (
    <View style={styles.container}>
      <Text style={styles.stepperTitle}>Appointment Progress</Text>

      {/* Horizontally scrollable stepper */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.stepperScrollContent}
        style={styles.stepperScroll}
      >
        {STATUS_STEPS.map((step, index) => (
          <View key={step} style={[styles.stepItem, { width: STEP_WIDTH }]}>
            <View style={styles.stepMarker}>
              <View style={[
                styles.stepCircle,
                styles[`${getStepStyle(index)}StepCircle`]
              ]}>
                <FontAwesome5 
                  name={STATUS_ICONS[step]} 
                  size={14} 
                  color={getStepStyle(index) === 'pending' ? '#6c757d' : '#fff'} 
                />
              </View>
              
              {/* Connect line - don't show for last item */}
              {index < STATUS_STEPS.length - 1 && (
                <View style={[
                  styles.stepLine,
                  getStepStyle(index) === 'completed' ? styles.completedStepLine : {}
                ]} />
              )}
            </View>
            
            <Text style={[
              styles.stepLabel,
              styles[`${getStepStyle(index)}StepLabel`]
            ]}>
              {step}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Active appointment card */}
      <View style={[styles.appointmentCard, { borderLeftColor: getStatusColor(currentStatus) }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Current Appointment</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(currentStatus), alignSelf: 'flex-start', marginBottom: 8 }]}>
          <Text style={styles.statusText}>{displayStatus}</Text>
        </View>
        <View style={styles.appointmentDetails}>
          <View style={styles.detailRow}>
            <FontAwesome5 name="user-md" size={16} color={sd.colors.blue} style={styles.detailIcon} />
            <Text style={styles.detailText}>
              {appointment?.doctor ? 
                `Dr. ${appointment.doctor.dr_firstName} ${appointment.doctor.dr_lastName}` : 
                'Doctor not assigned'}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <FontAwesome5 name="calendar" size={16} color={sd.colors.blue} style={styles.detailIcon} />
            <Text style={styles.detailText}>
              {appointment?.date ? formatDate(appointment.date) : 'Date not set'}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <FontAwesome5 name="clock" size={16} color={sd.colors.blue} style={styles.detailIcon} />
            <Text style={styles.detailText}>
              {appointment?.time ? formatTime(appointment.time) : 'Time not set'}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <FontAwesome5 name="notes-medical" size={16} color={sd.colors.blue} style={styles.detailIcon} />
            <Text style={styles.detailText}>
              {getAppointmentType()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  stepperTitle: {
    fontSize: 16,
    fontFamily: sd.fonts.semiBold,
    color: '#333',
    marginBottom: 8,
    textAlign: 'center'
  },
  stepperScroll: {
    maxHeight: 80,
    marginBottom: 15,
  },
  stepperScrollContent: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  appointmentCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: sd.fonts.semiBold,
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    maxWidth: '70%', // Add this to prevent overflow
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontFamily: sd.fonts.medium,
    flexShrink: 1,         // Allow text to shrink/wrap
    flexWrap: 'wrap',      // Allow wrapping
    textAlign: 'center',   // Center text if it wraps
  },
  appointmentDetails: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    marginRight: 12,
    width: 20,
  },
  detailText: {
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: '#555',
  },
  stepItem: {
    alignItems: 'center',
  },
  stepMarker: {
    alignItems: 'center',
    position: 'relative',
    flexDirection: 'row',
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    marginBottom: 6,
    zIndex: 2,
  },
  activeStepCircle: {
    backgroundColor: sd.colors.blue,
    transform: [{scale: 1.1}],
  },
  completedStepCircle: {
    backgroundColor: sd.colors.green || '#28a745',
  },
  pendingStepCircle: {
    backgroundColor: '#e9ecef',
  },
  stepLine: {
    height: 3,
    backgroundColor: '#e9ecef',
    width: STEP_WIDTH - 30, // Width between circles
    zIndex: 1,
  },
  completedStepLine: {
    backgroundColor: sd.colors.green || '#28a745',
  },
  stepLabel: {
    fontSize: 11,
    textAlign: 'center',
    fontFamily: sd.fonts.regular,
    color: '#6c757d',
    width: '100%',
  },
  activeStepLabel: {
    color: sd.colors.blue,
    fontFamily: sd.fonts.medium,
  },
  completedStepLabel: {
    color: sd.colors.green || '#28a745',
    fontFamily: sd.fonts.regular,
  },
  pendingStepLabel: {
    color: '#6c757d',
    fontFamily: sd.fonts.regular,
  },
});

export default AppointmentStepper;