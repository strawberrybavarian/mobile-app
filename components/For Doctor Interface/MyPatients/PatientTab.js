import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, Dimensions, Text, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { getData } from '../../storageUtility';
import { styles } from './MyPatientsStyles'; // Assuming you have a styles file
import sd from '../../../utils/styleDictionary'; // Importing style dictionary for custom styling
import { ip } from '../../../ContentExport';

const PatientTab = ({ patients, viewDetails }) => {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollContainer}>
          {patients.length > 0 ? (
            patients.map((patient) => (
              <Pressable key={patient._id} style={styles.patientCard} onPressIn={viewDetails}>
                <Text style={styles.patientName}>
                  {patient.patient_firstName} {patient.patient_middleInitial}. {patient.patient_lastName}
                </Text>
                <Text style={styles.patientDetails}>ID: {patient.patient_ID}</Text>
                <Text style={styles.patientDetails}>Age: {patient.patient_age}</Text>
                <Text style={styles.patientDetails}>Contact: {patient.patient_contactNumber}</Text>
                <Text style={styles.patientDetails}>Email: {patient.patient_email}</Text>
              </Pressable>
            ))
          ) : (
            <Text style={styles.noPatientsText}>You have no patients yet</Text>
          )}
        </ScrollView>
      </View>
    );
  };
  
  export default PatientTab;