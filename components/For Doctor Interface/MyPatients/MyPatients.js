import React, { useCallback, useEffect, useState } from 'react';
import { View, Dimensions, BackHandler } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import axios from 'axios';
import { getData } from '../../storageUtility';
import { styles } from './MyPatientsStyles';
import { ip } from '../../../ContentExport';
import PatientTab from './PatientTab';
import MedicalRecord from './MedicalRecord';
import { useFocusEffect } from '@react-navigation/native';

const MyPatients = () => {
  const [patients, setPatients] = useState([]);
  const [index, setIndex] = useState(0); // Manage tab index
  const [routes] = useState([
    { key: 'first', title: 'Patients' },
    { key: 'second', title: 'Medical Record' }
  ]);

  // Fetch patients using the new route
  const fetchPatients = useCallback(async () => {
    try {
      const userId = await getData('userId');
      if (userId) {
        const response = await axios.get(`${ip.address}/doctor/api/getallpatients/${userId}`);
        console.log(response.data);
        setPatients(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Scene Map to render tab components
  const renderScene = SceneMap({
    first: () => 
      <PatientTab 
        patients={patients} 
        viewDetails={viewDetails}
      />,
    second: MedicalRecord
  });

  const viewDetails = (patient) => {
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
