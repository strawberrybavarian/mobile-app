import React from 'react';
import { View, Text } from 'react-native';
import { MyPatientStyles } from './MyPatientsStyles';
import { useTheme } from 'react-native-paper';

const MedicalRecord = ({patient}) => {
  const theme = useTheme();
  const styles = MyPatientStyles(theme);

  console.log('ptn ',patient);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Medical Record</Text>
      <View style={styles.bodyContainer}>
        <Text style={styles.patientName}>{`${patient.patient_firstName} ${patient.patient_middleInitial ? `${patient.patient_middleInitial}. ` : ''} ${patient.patient_lastName}`}</Text>
        <Text style={styles.patientInfo}>nuhuhuh</Text>
      </View>
    </View>
  );
};

export default MedicalRecord;
