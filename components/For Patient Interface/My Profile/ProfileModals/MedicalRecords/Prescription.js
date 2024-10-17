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

export default Prescription = ({patient}) => {
    const [prescriptions, setPrescriptions] = useState(null);

    useEffect(()=>{
        if(patient){
            setPrescriptions(patient.prescriptions);
        }
    }, [patient]);
    return (
        <>
        {prescriptions && prescriptions.length > 0 ? prescriptions.map((prescription, index) => (
            <View key={index} style={styles.prescriptionContainer}>
                <View style={styles.prescriptionInfo}>
                    <Text style={styles.prescriptionName}>{prescription.prescriptionName}</Text>
                    <Text style={styles.prescriptionDate}>{prescription.date}</Text>
                </View>
            </View>
        )) : <Text style={styles.noPrescriptions}>No prescription records found.</Text>}
        </>
    )
}

;