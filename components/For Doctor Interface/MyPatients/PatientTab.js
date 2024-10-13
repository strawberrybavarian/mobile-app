import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, Dimensions, Text, Pressable, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { getData } from '../../storageUtility';
import { styles } from './MyPatientsStyles'; // Assuming you have a styles file
import sd from '../../../utils/styleDictionary'; // Importing style dictionary for custom styling
import { ip } from '../../../ContentExport';

const PatientTab = ({ patients, viewDetails }) => {
    
    return (
      <View style={styles.container}>
        <Text style = {styles.title}> My Patients </Text>
        <ScrollView style={styles.scrollContainer}>

          {patients.length > 0 ? (
            patients.map((patient) => (
              <Pressable key={patient._id} style={styles.patientCard} onPressIn={viewDetails}>
                <Image
                  source={{ uri: patient.patient_profilePicture }}
                  style={styles.patientImage}
                />
                <Text style={styles.patientName}>
                  {patient.patient_firstName} {patient.patient_middleInitial}. {patient.patient_lastName}
                </Text>
                
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