import React, { useCallback, useEffect, useState } from 'react';
import { View, Dimensions, BackHandler } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import axios from 'axios';
import { getData } from '../../storageUtility';
import {MyPatientStyles} from './MyPatientsStyles';
import { ip } from '../../../ContentExport';
import PatientTab from './PatientTab';
import MedicalRecord from './MedicalRecord';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';

const MyPatients = () => {
  const [pidArr, setPidArr] = useState([]);
  const [patients, setPatients] = useState([]); // Store patients
  const [patient, setPatient] = useState(null); // Store specific patient
  const [index, setIndex] = useState(0); // Manage tab index
  const [routes] = useState([
    { key: 'first', title: 'Patients' },
    { key: 'second', title: 'Medical Record' }
  ]);

  const theme = useTheme()
  const styles = MyPatientStyles(theme);

  // Fetch patients using the new route
  const fetchPatients = useCallback(async () => {
    try {
      const userId = await getData('userId');
      console.log('uid:', userId)
      if (userId) {
        const response = await axios.get(`${ip.address}/api/doctor/one/${userId}`);
        const appts = response.data.doctor.dr_appointments;
        setPidArr(appts.map((appt) => appt.patient));
        console.log ('your patients ', appts.map((appt) => appt.patient));
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => { 
    fetchPatients();
  }, [fetchPatients]);

  useEffect(() => {
    pidArr.forEach((patient) => {
      // Check if patient is already in the patients array
      if (!patients.some((p) => p._id === patient)) {
        axios
          .get(`${ip.address}/api/patient/api/onepatient/${patient}`)
          .then((res) => {
            // Only add the new patient if it's not already in the array
            setPatients((prevPatients) => {
              if (!prevPatients.some((p) => p._id === res.data.thePatient._id)) {
                return [...prevPatients, res.data.thePatient];
              }
              return prevPatients;
            });
          })
          .catch((err) => console.log(err));
      }
    });
    
    console.log('unique patientss', patients);
  }, [pidArr, patients]);

  // Scene Map to render tab components
  const renderScene = SceneMap({
    first: () => 
      <PatientTab 
        patients={patients} 
        viewDetails={viewDetails}
        setPatient={setPatient}
      />,
    second: () => 
      <MedicalRecord
        patient={patient}
      />
  });

  const viewDetails = () => {
    // console.log('view detail', patient);
    // setPatient(patient);
    setIndex(1);
  }

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (index === 1) {
          // If we're on the second tab, go back to the first tab
          setIndex(0);
          return true; // Prevent default behavior (exit or go back to previous screen)
        }
        return false; // Let the default behavior happen (exit or go back)
      };

      // Add event listener for back press
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      // Cleanup event listener when leaving the screen
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [index])
  );

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={() => null} // Hide tab bar
        swipeEnabled={index === 1} // Enable swipe only on the second tab (BlankTab)
      />
    </View>
  );
};

export default MyPatients;
