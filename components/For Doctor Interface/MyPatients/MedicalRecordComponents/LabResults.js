// LabResults.js
import React from 'react';
import { View, Text } from 'react-native';

const LabResults = ({ displayInfo }) => {
  // Fetch and display the lab results for the given patientId

  return (
    <View>
      {displayInfo ? (
        <View>
          <Text>Lab Results for Patient ID: {displayInfo.patientId}</Text>
          <Text>Lab Results: {displayInfo.laboratoryResults}</Text>
        </View>
      ) : (
        <Text>No lab results available</Text>
      )} 
    </View>
  );
};

export default LabResults;
