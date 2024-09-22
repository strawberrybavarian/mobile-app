import React, { useCallback, useState } from 'react';
import { View, Dimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import axios from 'axios';
import { getData } from '../../storageUtility';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from './MyPatientsStyles'; // Assuming you have a styles file
import sd from '../../../utils/styleDictionary'; // Importing style dictionary for custom styling
import { ip } from '../../../ContentExport';
import MedicalRecord from './MedicalRecord';

const MyPatients = () => {
  const [patients, setPatients] = useState([]);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'current', title: 'Current Patients' },
    { key: 'past', title: 'Past Patients' },
  ]);

  // Fetch patients using the new route
  const fetchPatients = useCallback(async () => {
    try {
      const userId = await getData('userId');
      if (userId) {
        const response = await axios.get(`${ip.address}/doctor/api/getallpatients/${userId}`);
        console.log( response.data); 
        const uniquePatients = deduplicatePatients(response.data);
        setPatients(uniquePatients);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPatients();
    }, [fetchPatients])
  );

  // Function to deduplicate patients based on patient ID
  const deduplicatePatients = (appointments) => {
    const uniquePatientsMap = new Map();
    appointments.forEach(appointment => {
      if (appointment.patient && appointment.patient._id) { // Check if patient and patient._id exist
        const patientId = appointment.patient._id;
        if (!uniquePatientsMap.has(patientId)) {
          uniquePatientsMap.set(patientId, appointment.patient);
        }
      }
    });
    return Array.from(uniquePatientsMap.values());
  };
  
  // Filter patients based on appointment status
  const filterPatientsByStatus = (status) => {
    return patients.filter(patient => 
      patient.appointments.some(appointment => appointment.status === status)
    );
  };

  const CurrentPatients = () => (
    <View>
      {filterPatientsByStatus('Scheduled').map(patient => (
        <MedicalRecord key={patient._id} patient={patient} />
      ))}
    </View>
  );

  const PastPatients = () => (
    <View>
      {filterPatientsByStatus('Completed').map(patient => (
        <MedicalRecord key={patient._id} patient={patient} />
      ))}
    </View>
  );

  const renderScene = SceneMap({
    current: CurrentPatients,
    past: PastPatients,
  });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: sd.colors.blue }} // Customize indicator
      style={{ backgroundColor: sd.colors.lightGrey }} // Customize tab bar background
      labelStyle={{ fontSize: 16 }} // Customize label font size
    />
  );

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
      />
    </View>
  );
};

export default MyPatients;
