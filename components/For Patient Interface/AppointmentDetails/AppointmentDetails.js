import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import doctorImage1 from '../../../assets/pictures/Doc.png';
import NavigationBar from '../Navigation/NavigationBar';
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import axios from 'axios';
import { TextInput } from 'react-native-paper';
import { getSpecialtyCode, getSpecialtyDisplayName } from '../../For Doctor Interface/DoctorStyleSheet/DoctorSpecialtyConverter';
import { getData } from '../../storageUtility';
import { ip } from '../../../ContentExport';
import { useFocusEffect } from '@react-navigation/native';
import styles from './AppointmentDetailsCSS';
import { Header2 } from '../../Headers/Headers';

const AppointmentDetails = ({ navigation , route}) => {
    //arrays
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(true);
    const [appointmentData, setAppointmentData] = useState({});
    const [doctorData, setDoctorData] = useState({});
    const { appt } = route.params || {}
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    
    useEffect(() => {
        const fetchUserId = async () => {
        try {
            const id = await getData('userId');
            if (id) {
                setUserId(id);
                console.log('User ID: ' + id);
            } else {
            console.log('User not found');
            }
        } catch (err) {
            console.log(err);
        }
        };

        fetchUserId();
    }, []);

    useEffect(() => {
        axios.get(`${ip.address}/patient/api/${userId}/oneappt/${appt}`)
        .then((response) => {
            setAppointmentData(response.data.appointment);
            setDoctorData(response.data.appointment.doctor);
            console.log(response.data.appointment.doctor.dr_firstName);
            setLoading(false);
        })
        .catch((error) => {
            console.log(error);
        });
    }, [userId]);

  return (
    <>
        <View style={styles.mainContainer}>
            <ScrollView style = {styles.scrollContainer}>
                <View style={styles.headercont}>
                    <Header2 title="Appointment Details"/> 
                </View>
                <View style = {styles.infocont}>
                    <View style={styles.info}>
                        <Text style={styles.appointmentDetailsText}>Date: {new Date(appointmentData.date).toLocaleDateString('en-US', options)}</Text>
                        <Text style={styles.appointmentDetailsText}>Time: {appointmentData.time}</Text>
                        <Text style={styles.appointmentDetailsText}>Doctor: Dr. {doctorData.dr_firstName} {doctorData.dr_lastName}</Text>
                        <Text style={styles.appointmentDetailsText}>Specialty: {getSpecialtyDisplayName( doctorData.dr_specialty)}</Text>
                        <Text style={styles.appointmentDetailsText}>Reason: {appointmentData.reason}</Text>
                        <Text style={styles.appointmentDetailsText}>Status: {appointmentData.status}</Text>
                        <Text style={styles.appointmentDetailsText}>{}</Text>
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


export default AppointmentDetails;
