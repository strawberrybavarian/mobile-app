// Prescriptions.js
import React from 'react';
import { View, Text } from 'react-native';

const Prescriptions = ({ displayInfo }) => {
  // Fetch and display the prescriptions for the given patientId

  return (
    <View>
      {displayInfo ? (
        <View>
          <Text>Prescriptions for Patient ID: {displayInfo.patientId}</Text>
          <Text>Prescriptions: {displayInfo.prescriptions}</Text>
        </View>
      ) : (
        <Text>No prescriptions available</Text>
      )}
    </View>
  );
};

export default Prescriptions;
