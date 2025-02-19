// MedicalHistory.js
import React from 'react';
import { View, Text } from 'react-native';

const MedicalHistory = ({ displayInfo }) => {
  // Fetch and display the medical history for the given patientId

  console.log(displayInfo);

  return (
    <View>
      {displayInfo ? (
        <View>
          <Text>Medical History for Patient ID: {displayInfo.patientId}</Text>
          <Text>Medical History: {displayInfo.medicalHistory}</Text>
        </View>
      ) : (
        <Text>No medical history available</Text>
      )}
    </View>
  );
};

export default MedicalHistory;
