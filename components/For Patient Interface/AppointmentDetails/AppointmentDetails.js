import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import styles from './AppointmentDetailsCSS';
import axios from 'axios';
import { getData } from '../../storageUtility';
import CancelAppointmentModal from './CancelAppointmentModal';
import RescheduleModal from './RescheduleAppointmentModal';
import Entypo from "@expo/vector-icons/Entypo";
import Modal from 'react-native-modal';
import sd from '../../../utils/styleDictionary';
import { ip } from '../../../ContentExport';
import { Card, Button } from 'react-native-paper';

const AppointmentDetails = ({ appointmentData, closeModal, isVisible }) => {
    const [cancelReason, setCancelReason] = useState('');
    const [isCancelModalVisible, setCancelModalVisible] = useState(false);
    const [isRescheduleModalVisible, setRescheduleModalVisible] = useState(false);
    const [isButtonVisible, setIsButtonVisible] = useState(false);

    useEffect(() => {
        if (appointmentData && (appointmentData.status === 'Pending' || appointmentData.status === 'Scheduled')) {
            setIsButtonVisible(true);
        } else {
            setIsButtonVisible(false);
        }
    }, [appointmentData]);

    if (!appointmentData) return null;

    const handleCancel = async (cancelReason) => {
        try {
            const userId = await getData('userId');
            if (userId) {
                axios.put(`${ip.address}/api/patient/${appointmentData._id}/updateappointment`, { cancelReason })
                .then((response) => {
                    console.log(response.data);
                    closeModal();
                })
                .catch((err) => {
                    console.log(err);
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleReschedule = async (newDate, newTime) => {
        try {
            const userId = await getData('userId');
            if (userId) {
                const rescheduleData = { newDate, newTime };
                axios.put(`${ip.address}/api/doctor/${appointmentData._id}/rescheduleappointment`, rescheduleData)
                .then((response) => {
                    console.log(response.data);
                    closeModal();
                })
                .catch((err) => {
                    console.log(err);
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const Info = ({ title, infocontent}) => {
        if (!infocontent) {
            infocontent = 'N/A';
        }
        return (
        <>
            <Card 
                style={{
                    marginBottom: 20,
                    backgroundColor: sd.colors.white,
                }}
                mode='outlined'
            >
                <Card.Content>
                    <View style={{flexDirection: 'row'}}>
                    <Text style={styles.infotitle}>{title}</Text>
                    <Text style={styles.infotext}>{infocontent}</Text>
                    <View style={{flex: 1, alignItems: 'flex-end'}}/>
                    </View>
                </Card.Content>
            </Card>
        </>
    )};

    return (
        <Modal
            isVisible={isVisible} 
            onBackdropPress={closeModal}
            onSwipeComplete={closeModal}
            swipeDirection='down'
            style={styles.modal}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            propagateSwipe={true}
            coverScreen={true}
            hideModalContentWhileAnimating={true}
            useNativeDriver={true}
        >
            <View style={styles.modalContainer}>
                <View style={styles.scrollContainer}>
                    
                    <Info title="Date" infocontent={new Date(appointmentData.date).toLocaleDateString('en-US')} />
                    <Info title="Time" infocontent={appointmentData.time} />
                    <Info title="Doctor" infocontent={`Dr. ${appointmentData.doctor.dr_firstName} ${appointmentData.doctor.dr_lastName}`} />
                    <Info title="Primary Concern" infocontent={appointmentData.reason} />
                    <Info title="Status" infocontent={appointmentData.status} />
                </View>
                {isButtonVisible && 
                <View style={styles.modalActions}>
                    <Button
                        uppercase
                        mode="contained"  // Use "contained" for filled button style
                        onPress={() => setCancelModalVisible(true)}
                        style={{
                            backgroundColor: sd.colors.red, // Set background color from your color dictionary
                            flex: 1,
                            marginRight: 10, // Add spacing between buttons if needed
                        }}>
                        Cancel Appointment
                    </Button>
                    <Button
                        uppercase
                        mode="contained" // Use "contained" for filled button style
                        onPress={() => setRescheduleModalVisible(true)}
                        style={{
                            backgroundColor: sd.colors.blue, // Set background color from your color dictionary
                        }}>
                        Reschedule 
                    </Button>
                </View>
                }

                {/* Cancel Appointment Modal */}
                <CancelAppointmentModal 
                    closeModal={() => setCancelModalVisible(false)}
                    onCancel={handleCancel}
                    isVisible={isCancelModalVisible}
                />
                <RescheduleModal
                    closeModal={() => setRescheduleModalVisible(false)}
                    onReschedule={handleReschedule}
                    isVisible={isRescheduleModalVisible}
                />

            </View>
        </Modal>
    );
};

export default AppointmentDetails;
