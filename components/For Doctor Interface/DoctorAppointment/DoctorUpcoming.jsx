// DoctorUpcoming.js
import React, { useCallback, useState } from 'react';
import { View, Dimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { getData } from '../../storageUtility';
import { ip } from '../../../ContentExport';
import styles from './DoctorUpcomingStyles'; // Import styles from the separated file
import AppointmentList from './AppointmentList'; // Import the AppointmentList component
import AppointmentModal from './AppointmentModal'; // Import the AppointmentModal component
import sd from '../../../utils/styleDictionary';

const DoctorUpcoming = () => {
  const [allAppointments, setAllAppointments] = useState([]);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'pending', title: 'Pending' },
    { key: 'scheduled', title: 'Scheduled' },
    { key: 'completed', title: 'Completed' },
    { key: 'cancelled', title: 'Cancelled' },
  ]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const fetchAppointments = useCallback(async () => {
    try {
      const id = await getData('userId');
      if (id) {
        const response = await axios.get(`${ip.address}/doctor/${id}/appointments`);
        setAllAppointments(response.data);
        console.log('Fetched appointments:', response.data); // Debugging line
      }
    } catch (err) {
      console.log(err);
    }
  }, []);
  

  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, [fetchAppointments])
  );

  const handleReschedule = async (newDate, newTime, appointment) => {
    if (!appointment || !appointment._id) {
      console.log("No valid appointment selected for rescheduling");
      return;
    }
    try {
      const userId = await getData('userId');
      if (userId) {
        const rescheduleData = { newDate, newTime };
        await axios.put(`${ip.address}/doctor/${appointment._id}/rescheduleappointment`, rescheduleData);
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
        await axios.put(`${ip.address}/patient/api/${appointment._id}/updateappointment`, { cancelReason });
        fetchAppointments(); // Refresh the list
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
        await axios.put(`${ip.address}/doctor/api/${appointment._id}/acceptpatient`);
        fetchAppointments(); // Refresh the list after accepting
      }
    } catch (error) {
      console.log(error);
    }
  };
  

  // Filter appointments based on status
  const filterAppointmentsByStatus = (status) => {
    return allAppointments.filter(appointment => appointment.status === status);
  };

  const renderScene = SceneMap({
    pending: () => (
      <AppointmentList 
        appointments={filterAppointmentsByStatus('Pending')} 
        status="Pending" 
        setSelectedAppointment={(appointment) => {
          setSelectedAppointment(appointment);
          setModalVisible(true); // Open the modal
        }}
      />
    ),
    scheduled: () => (
      <AppointmentList 
        appointments={filterAppointmentsByStatus('Scheduled')} 
        status="Scheduled" 
        setSelectedAppointment={(appointment) => {
          setSelectedAppointment(appointment);
          setModalVisible(true); // Open the modal
        }}
      />
    ),
    completed: () => (
      <AppointmentList 
        appointments={filterAppointmentsByStatus('Completed')} 
        status="Completed" 
        setSelectedAppointment={(appointment) => {
          setSelectedAppointment(appointment);
          setModalVisible(true); // Open the modal
        }}
      />
    ),
    cancelled: () => (
      <AppointmentList 
        appointments={filterAppointmentsByStatus('Cancelled')} 
        status="Cancelled" 
        setSelectedAppointment={(appointment) => {
          setSelectedAppointment(appointment);
          setModalVisible(true); // Open the modal
        }}
      />
    ),
  });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      scrollEnabled={true}  // Enable scrolling
      indicatorStyle={{ backgroundColor: 'blue' }} // Customize tab indicator
      style={{ backgroundColor: sd.colors.blue }} // Customize tab bar background
      labelStyle={{ fontSize: 14 }} // Customize text size
    />
  );

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}  // Apply custom TabBar with scroll enabled
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }} 
      />

      {/* Modal Section */}
      <AppointmentModal 
        isVisible={isModalVisible} 
        appointment={selectedAppointment} 
        onClose={() => setModalVisible(false)}
        onAccept={handleAccept}
        onCancel={handleCancel}
        onReschedule={handleReschedule}
        fetchAppointments={fetchAppointments}
      />
      
    </View>
  );
};

export default DoctorUpcoming;

