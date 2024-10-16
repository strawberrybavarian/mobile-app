import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, TouchableWithoutFeedback, TextInput } from 'react-native';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { getData } from '../../storageUtility';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { ip } from '../../../ContentExport';
import styles from './DoctorSpecialtyStyles'; // Import the new styles

const DoctorSpecialty = () => {
  const [search, setSearch] = useState('');
  const [userId, setUserId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const navigation = useNavigation();

  const specialtiesData = 
   [
    { id: 1, name: 'Primary Care & General Medicine', image: require('../../../assets/pictures/Stethoscope.png'), spec: 'PrimaryCare' },
    { id: 2, name: "OB-GYN's & Women's Health", image: require('../../../assets/pictures/FemaleReproductive.png'), spec: 'Obgyn' },
    { id: 3, name: 'Pediatrics', image: require('../../../assets/pictures/Pedia.png'), spec: 'Pedia'  }, 
    { id: 4, name: 'Heart & Cardiology', image: require('../../../assets/pictures/Heart.png'), spec: 'Cardio'  },
    { id: 5, name: 'Eye & Vision', image: require('../../../assets/pictures/Eye.png'), spec: 'Opthal'  },
    { id: 6, name: 'Skin & Dermatology', image: require('../../../assets/pictures/Dermatology.png'), spec: 'Derma'  },
    { id: 7, name: 'Brain & Nerves', image: require('../../../assets/pictures/Brain.png'), spec: 'Neuro'  },
    { id: 8, name: 'Stomach, Digestion & Gastroenterology', image: require('../../../assets/pictures/Stomach.png'), spec: 'InternalMed'  },
  ];

  const handleSearch = (serts) => {
    setSearch(serts);
  };

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
      const fetchData = () => {
        axios.get(`${ip.address}/api/patient/api/onepatient/${userId}`)
          .then(res => {
            console.log(res.data.thePatient);
            const patient = res.data.thePatient;
            setFirstName(patient.patient_firstName);
            setLastName(patient.patient_lastName);
          })
          .catch(err => {
            console.log(err);
          });
      };
    
      fetchData();
    }, [userId])
  );

  const filteredSpecialties = specialtiesData.filter(specialty =>
    specialty.name.toLowerCase().includes(search.toLowerCase())
  );

  const appointmentButton = (spec) => {
    console.log(spec, typeof(spec));
    navigation.navigate('searchappointment', { specpec: spec });
  };

  return (
    <>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.searchContainer}>
          <FontAwesome5 name="search" style={{marginRight: 5, color: '#DDDADA'}} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Specialty"
            value={search}
            onChangeText={handleSearch}
          />
          <TouchableWithoutFeedback>
            <FontAwesome5
              name="filter"
              size={18}
              style={{ marginTop: 3, color:'#92A3FD' }}
            />
          </TouchableWithoutFeedback>
        </View>
        
        <View style={styles.specialtySection}>
          <Text style={styles.specialtyHeader}>Choose a Specialty</Text>
          <View style={styles.specialtyButtonContainer}>
            {filteredSpecialties.map((specialty) => (
              <TouchableOpacity
                onPress={() => appointmentButton(specialty.spec)}
                key={specialty.id}
                style={styles.specialtyButton}
              >
                <View style={styles.specialtyContent}>
                  <Image source={specialty.image} style={styles.specialtyImage} />
                  <Text style={styles.buttonText}>{specialty.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default DoctorSpecialty;
