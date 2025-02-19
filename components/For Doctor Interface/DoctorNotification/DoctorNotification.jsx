import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, TouchableWithoutFeedback, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";
import { DoctorNotificationStyle, UpcomingStyles } from '../DoctorStyleSheet/DoctorCSS';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import DoctorNavigation from '../DoctorNavigation/DoctorNavigation';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { ip } from '@/ContentExport';
import { getData } from '@/components/storageUtility';

const patientData = [
    { id: 'P0256', name: 'La Grande Dame', specialization: 'Patient', status: 'Upcoming' },
   
  ];

const DoctorNotification = () => {
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('Upcoming');
    const navigation = useNavigation();
    console.log(activeTab);
  

  
    const handleSearch = (query) => {
      setSearch(query);
    };
  
    const filteredPatients = patientData.filter((patient) =>
      patient.id.toLowerCase().includes(search.toLowerCase())
    );
  
    console.log(
      
    )
 
 
    return (
      <>

       
        <View style={DoctorNotificationStyle.header}>
          <TouchableOpacity
            style={DoctorNotificationStyle.arrowButton}
            onPress={() => navigation.goBack()}>
            <Entypo name="chevron-thin-left" size={14} />
          </TouchableOpacity>
          <View style={{ justifyContent: 'center', width: "83%" }}>
            <Text style={DoctorNotificationStyle.title}>Notification</Text>
          </View>
        </View>
       
        <View style={DoctorNotificationStyle.container1}>
            {filteredPatients.map((patient) => (
              <View key={patient.id} style={UpcomingStyles.cont}>
                <View style={{ flexDirection: 'row' }}>
                  {/* Image */}
                  <Image style={UpcomingStyles.filter1} contentFit="cover" source={require("../../../assets/pictures/Doc.png")} />
  
                  <View>
                    <Text style={UpcomingStyles.doctorName}>{patient.name}</Text>
                    <Text style={UpcomingStyles.patientid}>Patient ID: {patient.id}</Text>
                    <View style={UpcomingStyles.statusContainer}>
                      <Text style={UpcomingStyles.specialization}>{patient.specialization} | </Text>
                      <Text style={UpcomingStyles.status}>{patient.status}</Text>
                    </View>
                    <Text style={UpcomingStyles.specialization}>March 10, 2024 | 5:00 PM </Text> 
                  </View>
                </View>
  
                <View style={UpcomingStyles.buttonsContainer}>
                    <LinearGradient
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 2 }}
                        colors={["#92A3FD", "#9DCEFF"]}
                        style={{
                                width: 130,
                                padding: 10,
                                height: 45,
                                borderRadius: 40,
                                marginTop: 12,  
                            }}
                    >
                        {/* Review Status of the Patient */}
                        <TouchableOpacity
                            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}S
                        >
                            <Text style={{color: 'white', fontFamily: 'Poppins-SemiBold'}}>Review Status</Text>
                        </TouchableOpacity>

                    </LinearGradient>
                    {/* Accept */}
                    <TouchableOpacity style={UpcomingStyles.button}>
                            <Text style={{color: 'green', fontFamily: 'Poppins-SemiBold'}}>Accept</Text>
                    </TouchableOpacity>
                    {/* Cancel */}
                    <TouchableOpacity style={UpcomingStyles.button1}>
                            <Text style={{color: 'red', fontFamily: 'Poppins-SemiBold'}}>Cancel</Text>
                    </TouchableOpacity>
                </View>
              </View>
            ))}


            <View style={DoctorNotificationStyle.container12}>
                <View style={DoctorNotificationStyle.containerCancel}>
                       <Text style={DoctorNotificationStyle.cancelText}>Your appointment for March 05, 2024, 11:00am was cancelled.</Text> 
                </View>

                <View style={DoctorNotificationStyle.containerNewApp}>
                       <Text style={DoctorNotificationStyle.newAppText}>You have an appointment scheduled today at 11:00am</Text> 
                </View>

            </View>
        </View>


      
  
   
      </>
    );
  };
  

export default DoctorNotification;

const styles = StyleSheet.create({
  
  scrollContainer: {
    backgroundColor: '#FFFFFF',
    flexGrow: 1,

  },



});
