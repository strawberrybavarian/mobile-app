import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useFocusEffect, } from '@react-navigation/native';
import axios from 'axios';
import { getData } from '../../storageUtility';
import { ip } from '../../../ContentExport';
import AppointmentList from './AppointmentList';
import AppointmentModal from './AppointmentModal';
import { Dropdown } from 'react-native-element-dropdown';
import sd from '../../../utils/styleDictionary';
import DoctorUpcomingStyles from './DoctorUpcomingStyles';
import { useTheme } from 'react-native-paper';

const DoctorUpcoming = () => {
  const [allAppointments, setAllAppointments] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('Scheduled');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // Add refreshing state
  const theme = useTheme();
  const styles = DoctorUpcomingStyles(theme);
  
  const fetchAppointments = useCallback(async () => {
    try {
      const id = await getData('userId');
      if (id) {
        const response = await axios.get(`${ip.address}/api/doctor/${id}/appointments`);
        setAllAppointments(response.data);
        console.log('Fetched appointments:', response.data); // Debugging line
      }
    } catch (err) {
      console.log(err);
    } finally {
      // Always set refreshing to false when done, whether successful or not
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, [fetchAppointments])
  );

  // Handle pull-to-refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAppointments();
  }, [fetchAppointments]);

  const handleReschedule = async (newDate, newTime, appointment) => {
    if (!appointment || !appointment._id) {
      console.log("No valid appointment selected for rescheduling");
      return;
    }
    try {
      const userId = await getData('userId');
      if (userId) {
        const rescheduleData = { newDate, newTime };
        await axios.put(`${ip.address}/api/doctor/${appointment._id}/rescheduleappointment`, rescheduleData);
        fetchAppointments();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = async (cancelReason, appointment) => {
    if (!appointment || !appointment._id) {
      console.log("No valid appointment selected for cancellation");
      return;
    }
    try {
      const userId = await getData('userId');
      if (userId) {
        await axios.put(`${ip.address}/api/patient/${appointment._id}/updateappointment`, { cancelReason });
        fetchAppointments();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAccept = async (appointment) => {
    if (!appointment || !appointment._id) {
      console.log("No valid appointment selected for acceptance");
      return;
    }
    try {
      const userId = await getData('userId');
      if (userId) {
        await axios.put(`${ip.address}/api/doctor/api/${appointment._id}/acceptpatient`);
        fetchAppointments();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Filter appointments based on selected status
  const filterAppointmentsByStatus = (status) => {
    return allAppointments.filter(appointment => appointment.status === status);
  };

  return (
    <View style={styles.container}>
      {/* Dropdown for toggling appointment status */}
      <Dropdown
        data={[
          { label: 'Upcoming', value: 'Scheduled' },
          { label: 'Today', value: 'Completed' },
          { label: 'Ongoing', value: 'Cancelled' },
          { label: 'Completed', value: 'Cancelled' },

        ]}
        labelField="label"
        valueField="value"
        placeholder="Select Status"
        value={selectedStatus}
        onChange={item => setSelectedStatus(item.value)}
        style={{ margin: 20, padding: 10, ...sd.shadows.level1, backgroundColor: theme.colors.surface, borderRadius: 10 }}
        selectedTextStyle={{ color: theme.colors.primary, fontFamily: sd.fonts.semiBold, fontSize: sd.fontSizes.medium }}
      />

      {/* Appointment List with refresh control */}
      <AppointmentList
        appointments={filterAppointmentsByStatus(selectedStatus)}
        status={selectedStatus}
        setSelectedAppointment={(appointment) => {
          console.log('setSelectedAppointment called with:', appointment);
          setSelectedAppointment(appointment);
          setModalVisible(true);
          console.log('isModalVisible:', isModalVisible);
          console.log('selectedAppointment:', selectedAppointment);
        }}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      {/* Modal for appointment details */}
      {isModalVisible && selectedAppointment && (
        <AppointmentModal
          isVisible={isModalVisible}  // Changed from "visible" to "isVisible"
          appointment={selectedAppointment}
          onClose={() => setModalVisible(false)}
          onReschedule={handleReschedule}
          onCancel={handleCancel}
          onAccept={handleAccept}
          status={selectedStatus}
        />
      )}
    </View>
  );
};

export default DoctorUpcoming;