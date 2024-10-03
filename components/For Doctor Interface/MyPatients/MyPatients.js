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
        // const uniquePatients = deduplicatePatients(response.data);
        // setPatients(uniquePatients);
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
  // const deduplicatePatients = (appointments) => {
  //   const uniquePatientsMap = new Map();
  //   appointments.forEach(appointment => {
  //     if (appointment.patient && appointment.patient._id) { // Check if patient and patient._id exist
  //       const patientId = appointment.patient._id;
  //       if (!uniquePatientsMap.has(patientId)) {
  //         uniquePatientsMap.set(patientId, appointment.patient);
  //       }
  //     }
  //   });
  //   return Array.from(uniquePatientsMap.values());
  // };
  

  return (
    <View style={styles.container}>
      
    </View>
  );
};

export default MyPatients;
