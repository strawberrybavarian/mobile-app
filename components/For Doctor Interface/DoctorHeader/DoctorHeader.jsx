import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, TouchableWithoutFeedback, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import DoctorNavigation from '../DoctorNavigation/DoctorNavigation';
import { useNavigation } from '@react-navigation/native';
import { styles } from './DoctorHeaderStyles';
import { getData } from '../../storageUtility';
import axios from 'axios';
import { ip } from '../../../ContentExport';

const DoctorHeader = () => {
    const [search, setSearch] = useState('');
    const [userId, setUserId] = useState('');
    const [doctorData, setDoctorData] = useState({});
    const [activeTab, setActiveTab] = useState('Upcoming');
    const navigation = useNavigation();
    console.log(activeTab);
    const handleNotification = () => {
      navigation.navigate('doctornotification')
    };

    useEffect(() => {
      getData('userId').then((id) => {
        setUserId(id);
        console.log(id);
      });
    }, [])

    useEffect(() => {
      axios.get(`${ip.address}/doctor/one/${userId}`)
        .then((response) => {
          console.log(response.data.doctor);
          setDoctorData(response.data.doctor);
        })
        .catch((error) => {
          console.log(error);
        });
    }, [userId]);
 
 
    return (
      <>
        <View style={styles.mainContainer}> 
          <View style={styles.container2}>
            <Image
                source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD29ZbwcUoURx5JZQ0kEwp6y4_NmjEJhh2Z6OdKRkbUw&s" }}
                style={{ width: 50, height: 50, borderRadius: 50 }}
            />
            <View style={styles.container21}>
                <View style={styles.container211}>
                <Text style={{fontFamily: 'Poppins-SemiBold', fontSize: 18, }}>Dr. {doctorData.dr_firstName} {doctorData.dr_lastName}</Text>
                </View>
                <View style={styles.container211}>
                  <Text style={{fontFamily: 'Poppins', fontSize: 12 }}> 
                  <FontAwesome name="circle" size={12} style={{color:'green'}} />  Active Now</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.editButton} onPress={handleNotification}>
                <FontAwesome5 name="bell" size={25} style={{}}/>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  };
  

export default DoctorHeader;


