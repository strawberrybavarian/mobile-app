import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions, Modal } from 'react-native';
import NavigationBar from '../Navigation/NavigationBar';
import { getData } from '../../storageUtility';
import axios from 'axios';
import { FontAwesome5 } from '@expo/vector-icons';
import { ip } from '../../../ContentExport';
import { useFocusEffect } from '@react-navigation/native';
import { getSpecialtyDisplayName } from '../../../utils/specialtyMap';
import { Header1, Header2 } from '../../Headers/Headers';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import AppointmentDetails from '../AppointmentDetails/AppointmentDetails';
import CancelAppointmentModal from '../AppointmentDetails/CancelAppointmentModal';
import styles from './HomepageStyles';

const Homepage = () => {

    const [userId, setUserId] = useState(null);
    const [patientData, setPatientData] = useState({});

    useEffect(() => {
        getData('userId').then((id) => {
            setUserId(id);
        })
    }, [])

    useEffect(() => {
        if (userId) {
            axios.get(`${ip.address}/patient/api/onepatient/${userId}`)
                .then((res) => {
                    setPatientData(res.data.thePatient);
                    console.log(res.data.thePatient);
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }, [userId])

    useEffect(() => {
        console.log(patientData);
    }, [patientData])

    return (
        <View style={styles.mainContaineer}>
            <View style={styles.headercont}>
                <Image
                    source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD29ZbwcUoURx5JZQ0kEwp6y4_NmjEJhh2Z6OdKRkbUw&s" }}
                    style={{ width: 50, height: 50, borderRadius: 50 }}
                />
                <View style={styles.headerTextCont}>
                    <View style={styles.textCont}>
                    <Text style={{fontFamily: 'Poppins', fontSize: 12, }}>Welcome!</Text>
                    </View>
                    <View style={styles.textCont}>
                    <Text style={{fontFamily: 'Poppins-SemiBold', fontSize: 17, }}>{patientData.patient_firstName} {patientData.patient_lastName}</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.editButton}>
                    <FontAwesome5 name="bell" size={25} style={{}}/>
                </TouchableOpacity>
            </View>
            <View style={styles.scrollContainer}>
               
            </View>
        </View>
    );
}

export default Homepage;