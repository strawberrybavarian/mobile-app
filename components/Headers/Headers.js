import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Pressable } from 'react-native';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import styles from './HeaderStyle';

import { ip } from '../../ContentExport';
import { getData } from '../storageUtility';

const Header3 = () => {
    const [search, setSearch] = useState('');
    const [userId, setUserId] = useState('');
    const [patient, setPatient] = useState(null); // Initialized to null
    const [activeTab, setActiveTab] = useState('Upcoming');
    const navigation = useNavigation();

    const handleNotification = () => {
      navigation.navigate('doctornotification')
    };

    useEffect(() => {
      getData('userId').then((id) => {
        setUserId(id);
        console.log('id:',id);
      });
    }, []);

    useEffect(() => {
      const fetchPatient = async () => {
        try {
          const response = await axios.get(`${ip.address}/api/patient/api/onepatient/${userId}`);
          console.log(response.data.thePatient);
          setPatient(response.data.thePatient);
        } catch (error) {
          console.log(error);
        }
      };

      if (userId) {
        fetchPatient();
      }
    }, [userId]);    

    return (
      <>
        <View style={styles.mainContainer}> 
          <View style={styles.wrapper}>
            <Pressable onPress={() => navigation.navigate('My Profile')}>
              <Image
                source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD29ZbwcUoURx5JZQ0kEwp6y4_NmjEJhh2Z6OdKRkbUw&s" }}
                style={{ width: 50, height: 50, borderRadius: 50 }}
              />
            </Pressable>

            <View style={styles.textCont}>
              <View style={styles.infoCont}>
                {/* Optional chaining to prevent undefined errors */}
                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 18 }}>
                  {patient?.patient_firstName ?? 'First Name'} {patient?.patient_lastName ?? 'Last Name'}
                </Text>
              </View>

              <View style={styles.infoCont}>
                <Text style={{ fontFamily: 'Poppins', fontSize: 12 }}> 
                  <FontAwesome5 name="circle" size={12} style={{color:'green'}} />  Active Now
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.editButton} onPress={handleNotification}>
              <FontAwesome5 name="bell" size={25} style={{}} />
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
};

export default Header3;
