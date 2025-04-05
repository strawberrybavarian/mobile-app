import { StyleSheet, Text, Alert, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { ip } from '../../../../../ContentExport';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getData } from '../../../../storageUtility';
import sd from '../../../../../utils/styleDictionary';
import { SegmentedButtons } from 'react-native-paper';
import styles from './MedicalRecordsStyles';
import MedicalHistory from './MedicalHistory';
import Prescription from './Prescription';
import Immunization from './Immunization';
import LabResult from './LabResult';
import { SafeAreaView } from 'react-native-safe-area-context';

const MedicalRecords = () => {
    const [userId, setUserId] = useState('');
    const [patient, setPatient] = useState(null);
    const [medicalHistory, setMedicalHistory] = useState(null);
    const [prescriptions, setPrescriptions] = useState(null);
    const [immunizations, setImmunizations] = useState(null);
    const [value, setValue] = useState('Medical History');
    const navigation = useNavigation();

    // Fetch user ID from storage
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const id = await getData('userId');
                id ? setUserId(id) : console.log('User not found');
            } catch (err) {
                console.log(err);
            }
        };
        fetchUserId();
    }, []);

    // Fetch patient data from the API based on the userId
    useFocusEffect(
        useCallback(() => {
            const fetchPatientData = async () => {
                if (userId) {
                    try {
                        const res = await axios.get(`${ip.address}/api/patient/api/onepatient/${userId}`);
                        setPatient(res.data.thePatient);
                        console.log(res.data.thePatient);
                    } catch (err) {
                        console.log(err);
                    }
                }
            };
            fetchPatientData();
        }, [userId, value])
    );


    return (
        <>
        <SafeAreaView style = {styles.mainContainer}>
            <ScrollView style = {styles.scrollContainer}>
                <View style = {styles.headerContainer}>
                    <Entypo name = 'chevron-thin-left' size = {18} color = {sd.colors.black} style = {[styles.backIcon, {flex:1}]} onPress = {() => navigation.goBack()} />
                    <Text style = {styles.headerText}>Medical Records</Text>
                    <View style = {{flex:1}}></View>
                </View>
                <SegmentedButtons
                    value = {value}
                    onValueChange={setValue}
                    buttons={[
                        {
                            text: 'Medical History',
                            value: 'Medical History',
                            label: 'History',
                            //labelStyle: { color: sd.colors.black }
                        },
                        
                        {
                            text: 'Immunizations',
                            value: 'Immunizations',
                            label: 'Immunizations',
                            //labelStyle: { color: sd.colors.black }
                        },
                        {
                            text: 'Lab',
                            value: 'LabResult',
                            label: 'Lab',
                            //labelStyle: { color: sd.colors.black }
                        }
                    ]}
                    theme={{
                        colors: {
                            primary: sd.colors.blue,
                            outline: sd.colors.blue,
                            secondaryContainer: sd.colors.blue,
                            onSecondaryContainer: sd.colors.white,
                            onSurface: sd.colors.blue,
                        }
                    }}
                    style = {{marginVertical: 10}}
                />
                {value === 'Medical History' ? (
                    <MedicalHistory 
                        patient = {patient}
                    />
                ) : 
                value === 'Prescriptions' ? (
                    <Prescription
                        patient = {patient}
                    />
                ) : 
                value === 'Immunizations' ? (
                    <Immunization
                        patient = {patient}
                    />
                ) : 
                value === 'LabResult' ? (
                    <LabResult
                        patient={patient}
                    />
                ) : (null)}
            </ScrollView>
        </SafeAreaView>
        </>
    )
}

export default MedicalRecords;