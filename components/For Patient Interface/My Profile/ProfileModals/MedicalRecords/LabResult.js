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

export default LabResult  = ({patient}) => {
    const [labResult, setLabResult] = useState(null);

    useEffect(()=>{
        if(patient){
            setLabResult(patient.laboratoryResults);
        }
    }
    , [patient]);

    return (
        <>
        {labResult && labResult.length > 0 ? labResult.map((history, index) => (
            <View key={index} style={styles.medicalHilabResultstoryContainer}>
                <View style={styles.medicalHistoryInfo}>
                    <Text style={styles.medicalHistoryTitle}>{history.title}</Text>
                    <Text style={styles.medicalHistoryDate}>{history.date}</Text>
                </View>
            </View>
        )) : <Text style={styles.noMedicalHistory}>No laboratory results found.</Text>}
        </>
    )
}
