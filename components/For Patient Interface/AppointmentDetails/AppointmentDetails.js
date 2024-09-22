import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Button, Alert, Platform, Touchable, TouchableOpacity } from 'react-native';
import styles from './AppointmentDetailsCSS';
import { Header2 } from '../../Headers/Headers';
import axios from 'axios';
import { ip } from '../../../ContentExport';
import { getData } from '../../storageUtility';
import CancelAppointmentModal from './CancelAppointmentModal';
import RescheduleModal from './RescheduleAppointmentModal';
import Entypo from "@expo/vector-icons/Entypo";
import { Modal } from 'react-native-paper';

const AppointmentDetails = ({ appointmentData, closeModal }) => {
    const [cancelReason, setCancelReason] = React.useState('');

    const [isCancelModalVisible, setCancelModalVisible] = useState(false);
    const [isRescheduleModalVisible, setRescheduleModalVisible] = useState(false);
    const [isButtonVisible, setIsButtonVisible] = useState(false);

    const handleCancel = async (cancelReason) => {
        try {
            const userId = await getData('userId');
            if (userId) {
                axios.put(`http://localhost:8000/patient/api/${appointmentData._id}/updateappointment`, { cancelReason })
                .then((response) => {
                    console.log(response.data);
                    closeModal(); // Just close the modal after successful cancellation
                })
                .catch((err) => {
                    console.log(err);
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (appointmentData.status === 'Pending' || appointmentData.status === 'Scheduled') {
            setIsButtonVisible(true);
        }
        else {
            setIsButtonVisible(false);
        }
    }, [appointmentData]);

    // Handle the reschedule process
    const handleReschedule = async (newDate, newTime) => {
        try {
            const userId = await getData('userId');
            if (userId) {
                // Send reschedule request to backend
                const rescheduleData = { newDate, newTime };
                axios.put(`http://localhost:8000/doctor/${appointmentData._id}/rescheduleappointment`, rescheduleData)
                .then((response) => {
                    console.log(response.data);
                    closeModal(); // Close the modal after rescheduling
                })
                .catch((err) => {
                    console.log(err);
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (!appointmentData) return null;

    const Info = ({ title, infocontent }) => (
        <View style={styles.infocont}>
            <View style={styles.infobanner}>
                <Text style={styles.infotitle}>{title}</Text>
            </View>
            <View style={styles.infodetail}>
                <Text style={styles.infotext}>{infocontent}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.modalContainer}>
            <ScrollView style={styles.scrollContainer}>
            <TouchableOpacity 
                onPress={closeModal}
                style={styles.arrowButton}
            >
                <Entypo name="chevron-left" size={20} color="black" />
            </TouchableOpacity>
                <Info title="Date" infocontent={new Date(appointmentData.date).toLocaleDateString('en-US')} />
                <Info title="Time" infocontent={appointmentData.time} />
                <Info title="Doctor" infocontent={`Dr. ${appointmentData.doctor.dr_firstName} ${appointmentData.doctor.dr_lastName}`} />
                <Info title="Primary Concern" infocontent={appointmentData.reason} />
                <Info title="Status" infocontent={appointmentData.status} />
            </ScrollView>
            {isButtonVisible && 
            <View style={styles.modalActions}>
                <Button title="Cancel Appointment" onPress={() => setCancelModalVisible(true)} color="red" />
                <Button title="Reschedule Appointment" onPress={() => setRescheduleModalVisible(true)} color="blue" />
            </View>
            }
            <CancelAppointmentModal 
                isVisible={isCancelModalVisible}
                closeModal={() => setCancelModalVisible(false)}
                onCancel={handleCancel}
            />

            <RescheduleModal
                isVisible={isRescheduleModalVisible}
                closeModal={() => setRescheduleModalVisible(false)}
                onReschedule={handleReschedule}
            />
        </View>
    );
};

export default AppointmentDetails;
