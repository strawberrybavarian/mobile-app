import React, { useState } from 'react';
import { View, Pressable, Text } from 'react-native';
import { Avatar, Surface, useTheme } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
import { ip } from '../../../ContentExport';
import { MyPatientStyles } from './MyPatientsStyles';
import MedicalHistory from './MedicalRecordComponents/MedicalHistory';
import Appointments from './MedicalRecordComponents/Appointments';
import LabResults from './MedicalRecordComponents/LabResults';
import Immunizations from './MedicalRecordComponents/Immunizations';
import Prescriptions from './MedicalRecordComponents/Prescriptions';

const MedicalRecord = ({ patient, backToPatients }) => {
  const [displayInfo, setDisplayInfo] = useState(null);
  const [displayLabel, setDisplayLabel] = useState('medicalHistory');
  const theme = useTheme();
  const styles = MyPatientStyles(theme);

  const dropdownArr = [
    { label: 'Medical History', value: 'medicalHistory' },
    { label: 'Prescriptions', value: 'prescriptions' },
    { label: 'Appointments', value: 'appointments' },
    { label: 'Lab Results', value: 'laboratoryResults' },
    { label: 'Immunizations', value: 'immunizations' },
  ];

  if (!patient) {
    return null;
  }

  const handleDropdownChange = (item) => {
    setDisplayLabel(item.value);
    switch (item.value) {
      case 'medicalHistory':
        setDisplayInfo(patient?.medicalHistory || []);
        break;
      case 'prescriptions':
        setDisplayInfo(patient?.prescriptions || []);
        break;
      case 'appointments':
        setDisplayInfo(patient?.patient_appointments || []);
        break;
      case 'laboratoryResults':
        setDisplayInfo(patient?.labResults || []);
        break;
      case 'immunizations':
        setDisplayInfo(patient?.immunizations || []);
        break;
      default:
        setDisplayInfo([]);
    }
  };

  const getAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.header} onPress={backToPatients}>
        <Entypo name='chevron-left' size={20} color={theme.colors.primary} />
        <Text style={styles.subtitle}>Back to My Patients</Text>
      </Pressable>

      <View style={styles.bodyContainer}>
        <Surface style={styles.patientInfo}>
          <View style={{ flexDirection: 'row' }}>
            <Avatar.Image
              size={50}
              source={{ uri: `${ip?.address}/${patient?.patient_image}` }}
            />
            <View style={{ marginLeft: 20 }}>
              <Text style={styles.patientName}>
                Name: 
              </Text>
              <Text style={styles.patientName}>
                Age: 
              </Text>
              <Text style={styles.patientName}>
                Gender: 
              </Text>
            </View>
            <View style={{ marginLeft: 15 }}>
              <Text style={styles.patientName}> {patient.patient_firstName} {patient.patient_middleInitial ? `${patient.patient_middleInitial}. ` : ''}{patient.patient_lastName} </Text>
              <Text style={styles.patientName}> {getAge(patient.patient_dob)} </Text>
              <Text style={styles.patientName}> {patient.patient_gender} </Text>
            </View>
          </View> 
        </Surface> 
 
        <View style = {styles.pickerContainer}>
          <Dropdown
            data={dropdownArr}
            labelField="label"
            valueField="value"
            value={displayLabel}
            placeholder='Select Information'
            onChange={handleDropdownChange} // Use the new handler
            style={styles.dropdown}
            mode='modal'
    
          />  
        </View> 

        {/* Render the corresponding component based on selected displayInfo */}
        {displayLabel === 'medicalHistory' && <MedicalHistory displayInfo={displayInfo} />}
        {displayLabel === 'prescriptions' && <Prescriptions displayInfo={displayInfo} />}
        {displayLabel === 'appointments' && <Appointments displayInfo={displayInfo} />}
        {displayLabel === 'laboratoryResults' && <LabResults displayInfo={displayInfo} />}
        {displayLabel === 'immunizations' && <Immunizations displayInfo={displayInfo} />}
      </View>
    </View>
  );
};

export default MedicalRecord;
