import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import NavigationBar from '../Navigation/NavigationBar';
import { LinearGradient } from "expo-linear-gradient";
import Entypo from "@expo/vector-icons/Entypo";
import { getData } from '../../storageUtility';
import axios from 'axios';
import { ip } from '../../../ContentExport';
import { useFocusEffect } from '@react-navigation/native';
import styles from './UpcomingCSS';
import { getSpecialtyDisplayName } from '../../../utils/specialtyMap';
import { Header2 } from '../../Headers/Headers';


const Upcoming = ({ navigation }) => {

  const [allAppointments, setAllAppointments] = useState([]);
  const [userId, setUserId] = useState("");
  const options = { year: 'numeric', month: 'long', day: 'numeric' };

  useFocusEffect(
    useCallback(() => {
      const fetchUserIdAndAppointments = async () => {
        try {
          const id = await getData('userId'); 
          if (id) {
            setUserId(id);
            const response = await axios.get(`${ip.address}/patient/api/${id}/allappt`);
            console.log("Appts set: ", response.data.appointments);
            setAllAppointments(response.data.appointments); 
          } else {
            console.log('User not found');
          }
        } catch (err) {
          console.log(err);
        }
      };
  
      fetchUserIdAndAppointments();
      
    }, [])
  );

  useEffect(() => {
    console.log(allAppointments);
  }, [allAppointments]);

  const handleCancelBooking = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            alert('Booking Cancelled!');
          },
        },
      ],
      { cancelable: false }
    );
  };
  
  const handleReschedule = () => {
    Alert.alert(
      'Reschedule Appointment',
      'Are you sure you want to reschedule this appointment?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            alert('Appointment Rescheduled!');
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleApptClick = (appt) => {
    navigation.navigate('apptdetails', { appt });
  }

  return (
    <>
    <View style = {styles.mainContainer}>
    <ScrollView
      scrollEnabled={true}
      showsVerticalScrollIndicator={false}
      style={styles.scrollContainer}
    >
      <View style={styles.header}>
        <Header2 title={"Your Appointments"}/>
      </View>

      <View style={{ }}>
        <View style={styles.tabContainer}>
          <TouchableOpacity style = {styles.tab}>
            <Text style={styles.tabtext}>Current</Text>
          </TouchableOpacity>
          <TouchableOpacity style = {styles.tab}>
            <Text style={styles.tabtext}>Completed</Text>
          </TouchableOpacity>
          <TouchableOpacity style = {styles.tab}>
            <Text style={styles.tabtext}>Cancelled</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cont}>
          {allAppointments.length > 0 ? (
            allAppointments.map((appointment) => (
              <>
                <TouchableOpacity 
                style = {styles.cardcont}
                onPress={() => handleApptClick(appointment._id)}
                >
                  <View style={styles.container1} key={appointment._id}>
                  <Image
                    style={styles.filter1}
                    contentFit="cover"
                    source={require("../../../assets/pictures/Doc.png")}
                  /> 
                  <View>
                    <View style={{ marginTop: 5 }}>
                      <Text style={styles.doctorName}>Dr. {appointment.doctor.dr_firstName} {appointment.doctor.dr_lastName}</Text>
                      <View style={styles.statusContainer}>
                        <Text style={styles.specialization}>
                          {getSpecialtyDisplayName(appointment.doctor.dr_specialty)} | 
                        </Text>
                        <View style={styles.status}>
                          <Text style={{ color: '#E59500', fontFamily: 'Poppins', fontSize: 11 }}>
                            {appointment.status}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Text style={styles.dateTime}>
                      {new Date(appointment.date).toLocaleDateString('en-US', options)} | {appointment.time}
                    </Text>
                  </View>
                </View>
                  
                </TouchableOpacity>
                
              </>
            ))
          ) : (
            <Text style={styles.noAppointments}>No appointments available.</Text>
          )}
        </View>
      </View>

      
    </ScrollView>
    </View>
      <View style={styles.navcontainer}>
          <NavigationBar/>
        </View>
    </>
  );
};
{/* <View style={styles.buttonsContainer}>
<TouchableOpacity style={styles.cancelButton} title="Cancelled Booking" onPress={handleCancelBooking}>
<Text style={styles.text1}>Cancel Booking</Text>
</TouchableOpacity>
<LinearGradient
start={{ x: 1, y: 0 }}
end={{ x: 0, y: 2 }}
colors={["#92A3FD", "#9DCEFF"]}
style={styles.gradientButton}>
<TouchableOpacity style={styles.gradientButtonContent} onPress={handleReschedule}>
  <Text style={styles.gradientButtonText}>Reschedule</Text>
</TouchableOpacity>
</LinearGradient>        
</View> */}
export default Upcoming;
