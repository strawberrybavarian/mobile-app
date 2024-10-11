import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './MyPatientsStyles';

const MedicalRecord = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.noPatientsText}>This is a blank tab for now.</Text>
    </View>
  );
};

export default MedicalRecord;
