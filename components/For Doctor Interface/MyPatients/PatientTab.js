import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, Dimensions, Text, Pressable, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { getData } from '../../storageUtility';
import {MyPatientStyles} from './MyPatientsStyles'; // Assuming you have a styles file
import sd from '../../../utils/styleDictionary'; // Importing style dictionary for custom styling
import { ip } from '../../../ContentExport';
import { Avatar, Button, Card, Searchbar, useTheme } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';

const PatientTab = ({ patients, viewDetails, setPatient }) => {

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPatients, setFilteredPatients] = useState([]);

    const theme = useTheme();
    const styles = MyPatientStyles(theme);

    useEffect(()=> {
        setFilteredPatients(patients.filter(patient => {
            return (
                patient.patient_firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                patient.patient_lastName.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }))
    }, [searchQuery])
    
    return (
      <View style={styles.container}>
        <Text style = {styles.title}> My Patients </Text>

        <View style = {{paddingHorizontal: 20}}>
          <Searchbar
            placeholder="Search"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style = {{paddingVertical: -2}}
          />
        </View>
        <ScrollView style={styles.scrollContainer}>
          <View style = {styles.bodyContainer}>    
            {patients.length > 0 ? (   
                filteredPatients.map((patient) => (
                  <Card
                    mode = 'elevated'
                    onPress={() => {
                      console.log('Patient:', patient);
                      setPatient(patient);
                      viewDetails();
                    }}
                    style = {{ backgroundColor: theme.colors.surface, elevation: sd.shadows.level1 }}
                  >
                    <Card.Title
                      title={`${patient.patient_firstName} ${patient.patient_middleInitial ? `${patient.patient_middleInitial}. ` : ''} ${patient.patient_lastName}`}
                      titleStyle = {styles.patientName}
                      left={(props) => <Avatar.Image size={40} source={{ uri: `${ip.address}/${patient.patient_image}` }} />}
                      right = {(props) => <Entypo name="chevron-thin-right" size={sd.fontSizes.medium} color={theme.colors.onSurface} style = {{marginRight: 15}}/>}
                    />
                  
                  </Card> 
                )) 
                
            ) : ( 
              <Text style={styles.noPatientsText}>You have no patients yet</Text>
            )}
          </View>
        </ScrollView>
      </View>
    );
  };
  
  export default PatientTab;