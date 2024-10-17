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

export default Immunization = ({patient}) => {
    const [immunizations, setImmunizations] = useState(null);

    useEffect(()=>{
        if(patient){
            setImmunizations(patient.immunizations);
        }
    }, [patient]);

    return (
        <>
        {immunizations && immunizations.length > 0 ? immunizations.map((immunization, index) => (
            <View key={index} style={styles.immunizationContainer}>
                <View style={styles.immunizationInfo}>
                    <Text style={styles.immunizationName}>{immunization.immunizationName}</Text>
                    <Text style={styles.immunizationDate}>{immunization.date}</Text>
                </View>
            </View>
        )) : <Text style={styles.noImmunizations}>No immunization records found.</Text>}
        
        </>
    )
}

