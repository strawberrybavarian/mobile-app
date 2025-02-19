// Immunizations.js
import React from 'react';
import { View, Text } from 'react-native';

const Immunizations = ({ displayInfo }) => {
  // Fetch and display the immunizations for the given patientId

  return (
    <View>
      {displayInfo ? (
        <View>
          <Text>Immunizations for Patient ID: {displayInfo.patientId}</Text>
          <Text>Immunizations: {displayInfo.immunizations}</Text>
        </View>
      ) : (
        <Text>No immunizations available</Text>
      )}
    </View>
  );
};

export default Immunizations;
