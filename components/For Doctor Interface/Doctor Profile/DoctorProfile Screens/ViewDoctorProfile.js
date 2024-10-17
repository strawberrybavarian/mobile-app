import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import sd from '../../../../utils/styleDictionary'; 
import { ip } from '../../../../ContentExport';
import { getData } from '../../../storageUtility';
import EditDoctorProfile from '../Edit Doctor Profile/EditDoctorProfile';

const ViewDoctorProfile = () => {
    const [doctorId, setDoctorId] = useState('');
    const [doctor, setDoctor] = useState(null);
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    
    const navigation = useNavigation();

    // Fetch doctor ID from storage
    useEffect(() => {
        const fetchDoctorId = async () => {
            try {
                const id = await getData('userId');
                console.log('id:',id);
                setDoctorId(id) 
            } catch (err) {
                console.log(err);
            }
        };
        fetchDoctorId();
    }, []);

    // Fetch doctor data from the API based on the doctorId
    useFocusEffect(
        useCallback(() => {
            const fetchDoctorData = async () => {
                if (doctorId) {
                    try {
                        const res = await axios.get(`${ip.address}/api/doctor/one/${doctorId}`);
                        setDoctor(res.data.doctor);
                        console.log('doctor: ',res.data.doctor);
                    } catch (err) {
                        console.log(err);
                    }
                }
            };
            fetchDoctorData();
        }, [doctorId, isEditModalVisible])
    );

    // Toggle Edit Modal
    const handleEditModal = () => {
        setEditModalVisible(!isEditModalVisible);
    };

    // Update doctor data after editing
    const handleProfileUpdate = (updatedData) => {
        setDoctor(updatedData); // Update the doctor state with the new data
    };

    const textBox = (label, value) => {
        return (
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{label}</Text>
                <View style={{ flex: 2 }}>
                    <Text style={styles.infoText}>{value ? value : '---'}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.modalContent}>
            <View style={styles.header}>
                <Entypo name='chevron-small-left' size={30} color={sd.colors.blue} onPress={() => navigation.goBack()} style={{ flex: 1 }} />
                <Text style={styles.headerText}>View Doctor Profile</Text>
                <View style={{ flex: 1 }}></View>
            </View>

            {doctor ? (
                <>
                    <View style={styles.topCont}>
                        <View style={styles.imageCont}>
                            <Image
                                source={doctor.dr_image ? { uri: `${ip.address}/${doctor.dr_image}`} : {uri : 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png' }}
                                style={styles.profileImage}
                            />
                        </View>
                        <View style={styles.nameCont}>
                            <Text style={styles.infoText}>{doctor.dr_firstName} {doctor.dr_lastName}</Text>
                            <Text style={[styles.infoText, { fontSize: sd.fontSizes.medium, fontFamily: sd.fonts.medium }]}>{doctor.dr_email}</Text>
                            <View style={styles.buttonCont}>
                                <Button
                                    mode='outlined'
                                    textColor={sd.colors.blue}
                                    onPress={handleEditModal}  // Open Edit Modal
                                    uppercase
                                    theme={{ colors: { outline: sd.colors.blue } }}
                                    style={styles.button}
                                >
                                    Edit Profile
                                </Button>
                            </View>
                        </View>
                    </View>

                    <View style={styles.infoCont}>
                        {textBox('First Name', doctor.dr_firstName)}
                        {textBox('Middle Initial', doctor.dr_middleInitial)}
                        {textBox('Last Name', doctor.dr_lastName)}
                        {textBox('Contact Number', doctor.dr_contactNumber)}
                        {textBox('Email Address', doctor.dr_email)}
                        {textBox('Specialization', doctor.dr_specialty)}
                        {textBox('License Number', doctor.dr_licenseNo)}

                    </View>

                    {/* Edit Doctor Profile Modal */}
                    <EditDoctorProfile
                        isVisible={isEditModalVisible}
                        toggleModal={handleEditModal}
                        doctor={doctor}
                        handleProfileUpdate={handleProfileUpdate}  
                    />
                    
                </>
            ) : (
                <Text>Loading...</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    modal: {
        margin: 0,  // Ensures the modal takes up the entire screen
        justifyContent: 'center',
        height: '100%',
        flex: 1,
    },
    modalContent: {
        backgroundColor: 'white',
        flex: 1,
    },
    header: {
        backgroundColor: sd.colors.white,
        padding: 20,
        flexDirection: 'row',
    },
    headerText: {
        fontSize: sd.fontSizes.large,
        fontFamily: sd.fonts.bold,
        textAlign: 'center',
        flex: 2,
    },
    topCont: {
        flexDirection: 'row',
        backgroundColor: sd.colors.white,
        margin: 20,
        ...sd.shadows.large,
        borderRadius: 20,
        marginBottom: 10,
    },
    imageCont: {
        padding: 20,
    },
    nameCont: {
        backgroundColor: sd.colors.white,
        justifyContent: 'center',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 80,
        borderColor: sd.colors.blue,
        marginBottom: 10,
    },
    infoCont: {
        margin: 20,
        backgroundColor: sd.colors.white,
        borderRadius: 20,
        padding: 20,
        ...sd.shadows.large,
    },
    infoRow: {
        height: 80,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingBottom: 10,
    },
    infoLabel: {
        fontSize: sd.fontSizes.medium,
        fontFamily: sd.fonts.medium,
        color: sd.colors.darkGray,
        width: '40%',
        marginBottom: 5,
    },
    infoText: {
        fontSize: sd.fontSizes.large,
        fontFamily: sd.fonts.semiBold,
        textAlign: 'left',
        color: 'black',
        borderColor: sd.colors.white,
    },
    buttonCont: {
        paddingVertical: 10,
        backgroundColor: sd.colors.white,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ViewDoctorProfile;
