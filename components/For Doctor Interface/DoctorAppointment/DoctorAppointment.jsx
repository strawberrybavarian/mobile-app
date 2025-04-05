import React, { useState, useCallback, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme, Divider, Menu } from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { ip } from '../../../ContentExport';
import { getData } from '../../storageUtility';
import AppointmentList from './AppointmentList';
import AppointmentModal from './AppointmentModal';
import sd from '../../../utils/styleDictionary';

// Import Modal Components
import AcceptModal from './ButtonModals/AcceptModal';
import CancelModal from './ButtonModals/CancelModal';
import RescheduleModal from './ButtonModals/RescheduleModal';

const DoctorAppointment = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [allAppointments, setAllAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Status filter state
  const [currentStatus, setCurrentStatus] = useState('upcoming');
  const [menuVisible, setMenuVisible] = useState(false);
  
  // Modal states
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [acceptModalVisible, setAcceptModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  
  // Status options for the dropdown
  const statusOptions = [
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Today', value: 'today' },
    { label: 'Ongoing', value: 'ongoing' },
    { label: 'Completed', value: 'completed' }
  ];
  
  // Fetch all appointments
  const fetchAppointments = useCallback(async () => {
    try {
      const id = await getData('userId');
      if (id) {
        const response = await axios.get(`${ip.address}/api/doctor/appointments/${id}`);
        
        if (response.data && Array.isArray(response.data)) {
          setAllAppointments(response.data);
          console.log('Fetched appointments:', response.data);
        } else {
          console.error('Invalid appointment data format:', response.data);
          setAllAppointments([]);
        }
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAllAppointments([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);
  
  // Fetch appointments when screen gets focus
  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, [fetchAppointments])
  );
  
  // Handle pull-to-refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAppointments();
  }, [fetchAppointments]);
  
  // Filter appointments based on selected status
  const getFilteredAppointments = () => {
    if (!allAppointments || !allAppointments.length) {
      console.log('No appointments available to filter.');
      return [];
    }

    // Format today's date as YYYY-MM-DD string for consistent comparison
    const getTodayDate = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const todayDate = getTodayDate();
    console.log('Today\'s date:', todayDate);
    console.log('Current status:', currentStatus);

    switch (currentStatus) {
      case 'upcoming':
        // Filter for future appointments with "Scheduled" status
        const upcomingAppointments = allAppointments.filter(appointment => {
          const appointmentDate = new Date(appointment.date).toISOString().split('T')[0];
          console.log(`Checking upcoming: ${appointmentDate} > ${todayDate} && ${appointment.status === 'Scheduled'}`);
          return appointmentDate > todayDate && appointment.status === 'Scheduled';
        });
        console.log('Filtered upcoming appointments:', upcomingAppointments);
        return upcomingAppointments;

      case 'today':
        // Filter for today's appointments with "Scheduled" status
        const todaysAppointments = allAppointments.filter(appointment => {
          const appointmentDate = new Date(appointment.date).toISOString().split('T')[0];
          console.log(`Checking today: ${appointmentDate} === ${todayDate} && ${appointment.status === 'Scheduled'}`);
          return appointmentDate === todayDate && appointment.status === 'Scheduled';
        });
        console.log('Filtered today\'s appointments:', todaysAppointments);
        return todaysAppointments;

      case 'ongoing':
        // Filter for today's appointments with "Ongoing" status
        const ongoingAppointments = allAppointments.filter(appointment => {
          const appointmentDate = new Date(appointment.date).toISOString().split('T')[0];
          console.log(`Checking ongoing: ${appointmentDate} === ${todayDate} && ${appointment.status === 'Ongoing'}`);
          return appointmentDate === todayDate && appointment.status === 'Ongoing';
        });
        console.log('Filtered ongoing appointments:', ongoingAppointments);
        return ongoingAppointments;

      case 'completed':
        // Filter for appointments with "Completed" status
        const completedAppointments = allAppointments.filter(appointment => {
          console.log(`Checking completed: ${appointment.status === 'Completed'}`);
          return appointment.status === 'Completed';
        });
        console.log('Filtered completed appointments:', completedAppointments);
        return completedAppointments;

      default:
        console.log('Invalid status selected.');
        return [];
    }
  };
  
  // Handle appointment selection
  const handleSelectAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setDetailsModalVisible(true);
  };
  
  // Handle appointment actions
  const handleAccept = async (appointment) => {
    if (!appointment?._id) return;
    
    try {
      const userId = await getData('userId');
      if (userId) {
        await axios.put(`${ip.address}/api/appointments/${appointment._id}/status`, { 
          status: 'Scheduled' 
        });
        
        fetchAppointments(); // Refresh data
        setAcceptModalVisible(false);
      }
    } catch (error) {
      console.error('Error accepting appointment:', error);
    }
  };
  
  const handleReschedule = async (newDate, newTime, appointmentId) => {
    if (!appointmentId) return;
    
    try {
      const formattedDate = new Date(newDate).toISOString().split('T')[0];
      await axios.put(`${ip.address}/api/appointments/${appointmentId}/assign`, {
        date: formattedDate,
        time: newTime
      });
      
      fetchAppointments(); // Refresh data
      setRescheduleModalVisible(false);
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
    }
  };
  
  const handleCancel = async (cancelReason, appointmentId) => {
    if (!appointmentId) return;
    
    try {
      const userId = await getData('userId');
      if (userId) {
        await axios.put(`${ip.address}/api/appointments/${appointmentId}/status`, { 
          status: 'Cancelled',
          cancelReason: cancelReason 
        });
        
        fetchAppointments(); // Refresh data
        setCancelModalVisible(false);
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };
  
  // Open specific modal handlers
  const openAcceptModal = () => {
    setDetailsModalVisible(false);
    setAcceptModalVisible(true);
  };
  
  const openRescheduleModal = () => {
    setDetailsModalVisible(false);
    setRescheduleModalVisible(true);
  };
  
  const openCancelModal = () => {
    setDetailsModalVisible(false);
    setCancelModalVisible(true);
  };
  
  // Current filtered appointments
  const filteredAppointments = getFilteredAppointments();

  // Selected status label
  const getStatusLabel = () => {
    const selected = statusOptions.find(option => option.value === currentStatus);
    return selected ? selected.label : 'Select Status';
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading appointments...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.pageTitle}>My Appointments</Text>
        <Divider style={styles.divider} />

        {/* Compact Filter Section */}
        <View style={styles.filterContainer}>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <TouchableOpacity 
                style={styles.dropdownButton} 
                onPress={() => setMenuVisible(true)}
              >
                <Text style={styles.dropdownButtonText}>{getStatusLabel()}</Text>
                <FontAwesome5 name="chevron-down" size={12} color="#fff" />
              </TouchableOpacity>
            }
          >
            {statusOptions.map((option) => (
              <Menu.Item
                key={option.value}
                onPress={() => {
                  setCurrentStatus(option.value);
                  setMenuVisible(false);
                }}
                title={option.label}
                titleStyle={[
                  styles.menuItemText,
                  currentStatus === option.value && styles.activeMenuItem
                ]}
              />
            ))}
          </Menu>
        </View>
      </View>

      
      {/* Appointments List */}
      <AppointmentList
        appointments={filteredAppointments}
        status={currentStatus}
        setSelectedAppointment={handleSelectAppointment}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
      
      {/* Bottom padding to avoid content being hidden by navigation */}
      <View style={styles.bottomPadding} />
      
      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <AppointmentModal
          isVisible={detailsModalVisible}
          appointment={selectedAppointment}
          onClose={() => setDetailsModalVisible(false)}
          onReschedule={openRescheduleModal}
          onCancel={openCancelModal}
          onAccept={openAcceptModal}
          status={selectedAppointment.status}
        />
      )}
      
      {/* Accept Modal */}
      {selectedAppointment && (
        <AcceptModal
          isVisible={acceptModalVisible}
          onClose={() => setAcceptModalVisible(false)}
          onAccept={() => handleAccept(selectedAppointment)}
          appointment={selectedAppointment}
        />
      )}
      
      {/* Cancel Modal */}
      {selectedAppointment && (
        <CancelModal
          isVisible={cancelModalVisible}
          onClose={() => setCancelModalVisible(false)}
          onCancel={(reason) => handleCancel(reason, selectedAppointment._id)}
          appointment={selectedAppointment}
        />
      )}
      
      {/* Reschedule Modal */}
      {selectedAppointment && (
        <RescheduleModal
          isVisible={rescheduleModalVisible}
          onClose={() => setRescheduleModalVisible(false)}
          onReschedule={(date, time) => handleReschedule(date, time, selectedAppointment._id)}
          appointment={selectedAppointment}
        />
      )}
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,

  },
  headerSection: {
    flexDirection: 'column',
    gap: 8,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  pageTitle: {
    fontSize: 18,
    fontFamily: sd.fonts.semiBold,
    color: theme.colors.primary,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 12,
    fontFamily: sd.fonts.regular,
    color: '#444',
    marginRight: 6,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    minWidth: 110,
    justifyContent: 'space-between',
  },
  dropdownButtonText: {
    fontSize: 12,
    fontFamily: sd.fonts.medium,
    color: '#fff',
    marginRight: 5,
  },
  menuItemText: {
    fontFamily: sd.fonts.regular,
    fontSize: 13,
  },
  activeMenuItem: {
    fontFamily: sd.fonts.medium,
    color: theme.colors.primary,
  },
  divider: {
    backgroundColor: '#bbb7c3',
    height: 1,
    marginHorizontal: 10,
    marginBottom:20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: sd.fonts.regular,
    color: '#555',
  },
  bottomPadding: {
    height: 80,
  },
});

export default DoctorAppointment;
