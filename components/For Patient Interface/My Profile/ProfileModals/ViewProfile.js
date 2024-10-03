import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import Modal from 'react-native-modal';
import axios from 'axios';
import { ip } from '../../../../ContentExport';
import { getData } from '../../../storageUtility';
import sd from '../../../../utils/styleDictionary';
import { Entypo } from '@expo/vector-icons';
import { Button, TextInput } from 'react-native-paper';

const ViewProfile = ({ isVisible, closeModal }) => {
    const [userId, setUserId] = useState('');
    const [patient, setPatient] = useState(null);
    const [isDisabled, setIsDisabled] = useState(true);

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

    useEffect(() => {
        if (userId) {
            axios.get(`${ip.address}/patient/api/onepatient/${userId}`)
                .then(res => {
                    setPatient(res.data.thePatient);
                })
                .catch(err => console.log(err));
        }
    }, [userId]);

    const toggleEditMode = () => {
        if (!isDisabled) {
            Alert.alert(
                "Save Changes",
                "Do you want to save the changes?",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Save",
                        onPress: () => {
                            // Call the save function here if needed
                            setIsDisabled(true);
                        }
                    }
                ]
            );
        } else {
            setIsDisabled(false);
        }
    };

    return (
        <Modal 
            isVisible={isVisible} 
            onBackdropPress={closeModal} 
            onSwipeComplete={closeModal}
            swipeDirection="right"
            animationIn="slideInRight" 
            animationOut="slideOutRight"
            coverScreen={true}
            style={styles.modal}
            propagateSwipe={true}
        >
            <View style={styles.modalContent}>
                <View style={styles.header}>
                    <Entypo name='chevron-small-left' size={30} color={sd.colors.blue} onPress={closeModal}/>
                    <Text style={styles.headerText}>View Profile</Text>
                </View>

                {patient ? (
                    <>
                        <View style={styles.imageCont}>
                            <Image 
                                source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD29ZbwcUoURx5JZQ0kEwp6y4_NmjEJhh2Z6OdKRkbUw&s" }} 
                                style={styles.profileImage} 
                            />
                            <Button 
                                mode="contained" 
                                onPress={() => console.log('Edit Profile')}
                                buttonColor={sd.colors.blue}
                            >
                                Upload Image
                            </Button>
                        </View>

                        <View style={styles.infoCont}>
                            {isDisabled ? (
                                <>
                                    <Text style={styles.infoText}>First Name: {patient.patient_firstName}</Text>
                                    <Text style={styles.infoText}>Middle Initial: {patient.patient_middleInitial || ''}</Text>
                                    <Text style={styles.infoText}>Last Name: {patient.patient_lastName}</Text>
                                    <Text style={styles.infoText}>Email: {patient.patient_email}</Text>
                                </>
                            ) : (
                                <>
                                    <TextInput
                                        mode='outlined'
                                        label="First Name"
                                        value={patient.patient_firstName}
                                        disabled={isDisabled}
                                        style={{ marginBottom: 10 }}
                                    />
                                    <TextInput
                                        mode='outlined'
                                        label="Middle Initial"
                                        value={patient.patient_middleInitial ? patient.patient_middleInitial : ''}
                                        disabled={isDisabled}
                                        style={{ marginBottom: 10 }}
                                    />
                                    <TextInput
                                        mode='outlined'
                                        label="Last Name"
                                        value={patient.patient_lastName}
                                        disabled={isDisabled}
                                        style={{ marginBottom: 10 }}
                                    />
                                    <TextInput
                                        mode='outlined'
                                        label="Email"
                                        value={patient.patient_email}
                                        disabled={isDisabled}
                                        style={{ marginBottom: 10 }}
                                    />
                                </>
                            )}
                        </View>

                        <Button
                            mode="contained"
                            onPress={toggleEditMode}
                            buttonColor={sd.colors.blue}
                        >
                            {isDisabled ? 'Edit' : 'Save'}
                        </Button>
                    </>
                ) : (
                    <Text>Loading...</Text>
                )}
            </View>
        </Modal>
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
        fontFamily: sd.fonts.semiBold,
        marginLeft: 20,
    },
    imageCont: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        height: '20%',
        marginBottom: 50,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 80,
        borderColor: sd.colors.blue,
        borderWidth: 4,
        marginBottom: 10,
    },
    infoCont: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    infoText: {
        fontSize: sd.fontSizes.medium,
        marginBottom: 10,
    },
});

export default ViewProfile;
