import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const MedicalRecord = ({ patient }) => {
  return (
    <TouchableOpacity style={styles.card}>
      <View>
        <Text style={styles.name}>{patient.patient_firstName} {patient.patient_lastName}</Text>
        <Text style={styles.details}>Age: {patient.patient_age}</Text>
        <Text style={styles.details}>Contact: {patient.patient_contactNumber}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 14,
    color: '#555',
  },
});

export default MedicalRecord;
