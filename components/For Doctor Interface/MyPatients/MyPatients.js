import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { View, Dimensions, BackHandler } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import axios from 'axios';
import { getData } from '../../storageUtility';
import { MyPatientStyles } from './MyPatientsStyles';
import { ip } from '../../../ContentExport';
import PatientTab from './PatientTab';
import MedicalRecord from './MedicalRecord';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';

const MyPatients = () => {
  const [pidArr, setPidArr] = useState([]);
  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState(null);
  const [index, setIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const fetchInProgressRef = useRef(false);

  const routes = useMemo(() => [
    { key: 'first', title: 'Patients' },
    { key: 'second', title: 'Medical Record' },
  ], []);

  const theme = useTheme();
  const styles = MyPatientStyles(theme);

  const fetchPatients = useCallback(async () => {
    if (fetchInProgressRef.current) return;

    fetchInProgressRef.current = true;
    try {
      const userId = await getData('userId');
      if (userId) {
        const response = await axios.get(`${ip.address}/api/doctor/one/${userId}`);
        const appts = response.data.doctor.dr_appointments || [];
        const newPidArr = appts.map(appt => appt.patient);
        setPidArr(newPidArr);

        const uniquePatients = [...new Set(newPidArr)];
        const patientPromises = uniquePatients.map(patientId =>
          axios.get(`${ip.address}/api/patient/api/onepatient/${patientId}`)
            .then(res => res.data.thePatient)
            .catch(err => {
              console.error(`Error fetching patient ${patientId}:`, err);
              return null;
            })
        );

        const fetchedPatients = await Promise.all(patientPromises);
        const validPatients = fetchedPatients.filter(patient => patient !== null);
        setPatients(validPatients);
      }
    } catch (err) {
      console.error("Error fetching patients:", err);
    } finally {
      fetchInProgressRef.current = false;
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPatients();
    }, [fetchPatients])
  );

  const handleSelectPatient = useCallback((selectedPatient) => {
    if (!selectedPatient || selectedPatient._id === patient?._id) return;
    const validPatient = patients.find(p => p._id === selectedPatient._id);
    if (validPatient) {
      setPatient(validPatient);
      setIndex(1);
    }
  }, [patients, patient]);

  const backToPatients = useCallback(() => {
    setIndex(0);
    setPatient(null);
  }, []);

  const onRefresh = useCallback(() => {
    if (refreshing || fetchInProgressRef.current) return;

    setRefreshing(true);
    fetchPatients();
  }, [fetchPatients, refreshing]);

  const FirstRoute = useCallback(() => (
    <PatientTab
      patients={patients}
      viewDetails={handleSelectPatient}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  ), [patients, handleSelectPatient, refreshing, onRefresh]);

  const SecondRoute = useCallback(() => (
    <MedicalRecord
      key={patient?._id}
      patient={patient}
      backToPatients={backToPatients}
    />
  ), [patient, backToPatients]);

  const renderScene = useMemo(() => 
    SceneMap({
      first: FirstRoute,
      second: SecondRoute,
    }), [FirstRoute, SecondRoute]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (index === 1) {
          backToPatients();
          return true;
        }
        return false;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [index, backToPatients])
  );

  const handleIndexChange = useCallback((newIndex) => {
    if (newIndex === 0) {
      backToPatients();
    } else {
      setIndex(newIndex);
    }
  }, [backToPatients]);

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={handleIndexChange}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={() => null}
        swipeEnabled={false}
        lazy
      />
    </View>
  );
};

export default React.memo(MyPatients);
