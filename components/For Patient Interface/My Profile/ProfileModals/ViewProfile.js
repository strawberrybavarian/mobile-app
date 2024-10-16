import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import axios from 'axios';
import { ip } from '../../../../ContentExport';
import { getData } from '../../../storageUtility';
import sd from '../../../../utils/styleDictionary';
import { Entypo } from '@expo/vector-icons';
import { Button } from 'react-native-paper';

// All the other imports remain the same...

const ViewProfile = ({ isVisible, closeModal }) => {
    const [userId, setUserId] = useState('');
    const [patient, setPatient] = useState(null);
    const [isDisabled, setIsDisabled] = useState(true);

    const [firstName, setFirstName] = useState('');
    const [middleInitial, setMiddleInitial] = useState('');
    const [lastName, setLastName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');

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
            axios.get(`${ip.address}/api/patient/api/onepatient/${userId}`)
                .then(res => {
                    setPatient(res.data.thePatient);
                })
                .catch(err => console.log(err));
        }
    }, [userId]);

    useEffect(() => {
        if (patient) {
            setFirstName(patient.patient_firstName);
            setMiddleInitial(patient.patient_middleInitial);
            setLastName(patient.patient_lastName);
            setContactNumber(patient.patient_contactNumber);
            setEmail(patient.patient_email);
        }
    }, [patient]);

    const textBox = (label, value, onChangeText) => {
        return (
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{label}</Text>
                <View style={{ flex: 2 }}>
                    <TextInput
                        value={value ? value : '---'}
                        editable={!isDisabled}
                        style={isDisabled ? styles.infoText : [styles.infoText, { borderWidth: 1, borderColor: sd.colors.blue, color: 'black', borderRadius: 15 }]}
                        onChangeText={onChangeText}
                    />
                </View>
            </View>
        );
    };
    

    const toggleEditMode = () => {
        if (!isDisabled) {
            Alert.alert(
                "Save Changes",
                "Do you want to save the changes?",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Save",
                        onPress: async () => {
                            try {
                                const updatedData = {
                                    patient_firstName: firstName,
                                    patient_lastName: lastName,
                                    patient_middleInitial: middleInitial,
                                    patient_contactNumber: contactNumber,
                                    patient_email: email
                                };

                                const response = await axios.put(`${ip.address}/api/patient/api/updateinfo/${userId}`, updatedData);

                                if (response.data.success) {
                                    Alert.alert("Profile Updated", response.data.message);
                                    setPatient(updatedData);  // Update the local state with the new data
                                } else {
                                    Alert.alert("Update Failed", response.data.message);
                                }

                                setIsDisabled(true);
                            } catch (error) {
                                console.error('Error updating profile:', error);
                                Alert.alert("An error occurred while updating the profile.");
                            }
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
                    <Entypo name='chevron-small-left' size={30} color={sd.colors.blue} onPress={closeModal} style={{flex:1}}/>
                    <Text style={styles.headerText}>View Profile</Text>
                    <View style={{flex: 1}}></View>
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
                            {textBox('First Name', firstName, setFirstName)}
                            {textBox('Middle Initial', middleInitial, setMiddleInitial)}
                            {textBox('Last Name', lastName, setLastName)}
                            {textBox('Contact Number', contactNumber, setContactNumber)}
                            {textBox('Email Address', email, setEmail)}
                            {textBox('Gender', patient.patient_gender)}
                        </View>
                        
                        <View style = {styles.buttonCont}>
                            <Button
                                mode="contained"
                                onPress={toggleEditMode}
                                buttonColor={sd.colors.blue}
                            >
                                {isDisabled ? 'Edit' : 'Save'}
                            </Button>
                        </View>
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
        fontFamily: sd.fonts.bold,
        textAlign: 'center',
        flex: 1,
        //marginRight: 30,
        //marginLeft: 20,
    },
    imageCont: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        height: '20%',
        paddingBottom: 50,
        backgroundColor: sd.colors.white,
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
        paddingHorizontal: 40,
        marginBottom: 20,
        backgroundColor: sd.colors.white,
    },
    infoRow: {
        //marginBottom: 10,
        backgroundColor: sd.colors.white,
        height: 80,
        flexDirection: 'column',
        //alignItems: 'center',
        verticalAlign: 'center',
        justifyContent: 'flex-start',
        //borderBottomWidth: StyleSheet.hairlineWidth,
        paddingBottom: 10,
    },
    infoLabel: {
        fontSize: sd.fontSizes.medium,
        fontFamily: sd.fonts.medium,
        //alignSelf: 'center',
        width: '40%',
        marginBottom: 5,
    },
    infoText: {
        fontSize: sd.fontSizes.large,
        fontFamily: sd.fonts.semiBold,
        textAlign: 'left',
        padding: 10,
        //paddingLeft: 20,
        color: 'black',
        //borderBottomWidth: 1,
        borderColor: sd.colors.white,
        
        //marginBottom: 10,
    },
    buttonCont : {
        padding : 10
    }
});

export default ViewProfile;
