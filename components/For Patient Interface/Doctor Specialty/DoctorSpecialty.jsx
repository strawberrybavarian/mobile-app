import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { getData } from '../../storageUtility';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { ip } from '../../../ContentExport';
import styles from './DoctorSpecialtyStyles';
import sd from '../../../utils/styleDictionary';

const DoctorSpecialty = () => {
  // Add route to get params
  const route = useRoute();
  const { serviceData, isServiceAppointment } = route.params || {};
  
  const [userId, setUserId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [specialties, setSpecialties] = useState([]);
  
  // Add loading states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigation = useNavigation();

  // Combined fetch function to avoid duplicate code
  const fetchSpecialties = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${ip.address}/api/find/admin/specialties`);
      console.log('Specialties:', response.data);
      setSpecialties(response.data);
    } catch (err) {
      console.log('Error fetching specialties:', err);
      setError('Failed to load specialties. Please try again.');
      // Set empty array to avoid map errors
      setSpecialties([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialties();
  }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getData('userId');
        if (id) {
          console.log("userId: "+id);
          setUserId(id);
        } else {
          console.log('User not found');
        }
      } catch (err) {
        console.log(err);
      }
    };
    
    fetchUserId();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        const fetchData = async () => {
          try {
            const response = await axios.get(`${ip.address}/api/patient/api/onepatient/${userId}`);
            console.log(response.data.thePatient);
            const patient = response.data.thePatient;
            setFirstName(patient.patient_firstName);
            setLastName(patient.patient_lastName);
          } catch (err) {
            console.log('Error fetching patient data:', err);
          }
        };
        
        fetchData();
      }
      
      // Only refetch specialties if we don't already have them
      if (specialties.length === 0 && !isLoading) {
        fetchSpecialties();
      }
    }, [userId, specialties.length])
  );

  const appointmentButton = (specialty) => {
    // Pass both specialty and service data if available
    navigation.navigate('searchappointment', { 
      specpec: specialty,
      serviceData: serviceData,
      isServiceAppointment: isServiceAppointment
    });
  };

  return (
    <>
      <ScrollView style={styles.scrollContainer}>
        
        <View style={styles.specialtySection}>
          <Text style={styles.specialtyHeader}>Choose a Specialty</Text>
          <View style={styles.specialtyButtonContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color={sd.colors.primary} />
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : (
              specialties.map((specialty) => (
                <TouchableOpacity
                  onPress={() => appointmentButton(specialty.name)}
                  key={specialty._id}
                  style={styles.specialtyButton}
                >
                  <View style={styles.specialtyContent}>
                    <Image source={{uri : `${ip.address}/${specialty.imageUrl}`}} style={styles.specialtyImage} />
                    <Text style={styles.buttonText}>{specialty.name}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default DoctorSpecialty;
