import { StyleSheet, Text, Alert, View, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';
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
import styles from './MedicalRecordsStyles';
import MedicalHistory from './MedicalHistory';
import Prescription from './Prescription';
import Immunization from './Immunization';
import LabResult from './LabResult';
import { SafeAreaView } from 'react-native-safe-area-context';

const MedicalRecords = () => {
    const [userId, setUserId] = useState('');
    const [patient, setPatient] = useState(null);
    const [value, setValue] = useState('Medical History');
    const [showDropdown, setShowDropdown] = useState(false);
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

    // Define the options for our dropdown
    const recordOptions = [
        {
            value: 'Medical History',
            label: 'Patient History',
            icon: 'notes-medical'
        },
        {
            value: 'Immunizations',
            label: 'Immunizations',
            icon: 'syringe'
        },
        {
            value: 'LabResult',
            label: 'Laboratory',
            icon: 'flask'
        }
    ];

    // Get the current selected option label
    const selectedOption = recordOptions.find(option => option.value === value);

    return (
        <>
        <SafeAreaView style={styles.mainContainer}>
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.headerContainer}>
                    <Entypo name="chevron-thin-left" size={18} color={sd.colors.black} style={[styles.backIcon, {flex:1}]} onPress={() => navigation.goBack()} />
                    <Text style={styles.headerText}>Medical Records</Text>
                    <View style={{flex:1}}></View>
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
                    <MedicalHistory patient={patient} />
                ) : value === 'Prescriptions' ? (
                    <Prescription patient={patient} />
                ) : value === 'Immunizations' ? (
                    <Immunization patient={patient} />
                ) : value === 'LabResult' ? (
                    <LabResult patient={patient} />
                ) : (null)}
            </ScrollView>
            
            {/* Dropdown Modal */}
            <Modal
                visible={showDropdown}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowDropdown(false)}
            >
                <TouchableOpacity 
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowDropdown(false)}
                >
                    <View style={styles.dropdownMenu}>
                        {recordOptions.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    styles.dropdownItem,
                                    value === option.value && styles.dropdownItemActive
                                ]}
                                onPress={() => {
                                    setValue(option.value);
                                    setShowDropdown(false);
                                }}
                            >
                                <FontAwesome5 
                                    name={option.icon} 
                                    size={16}
                                    color={value === option.value ? sd.colors.blue : sd.colors.gray} 
                                    style={styles.dropdownItemIcon}
                                />
                                <Text 
                                    style={[
                                        styles.dropdownItemText,
                                        value === option.value && styles.dropdownItemTextActive
                                    ]}
                                >
                                    {option.label}
                                </Text>
                                {value === option.value && (
                                    <FontAwesome5 name="check" size={14} color={sd.colors.blue} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
        </>
    )
}

export default MedicalRecords;