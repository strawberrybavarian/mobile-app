import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { getData } from '../../storageUtility';
import axios from 'axios';
import { ip } from '../../../ContentExport';
import { useFocusEffect } from '@react-navigation/native';
import styles from './UpcomingCSS';
import AppointmentDetails from '../AppointmentDetails/AppointmentDetails';
import { SegmentedButtons } from 'react-native-paper'; // Import SegmentedButtons

const filterAppointments = (appointments, status) => {
    if (!Array.isArray(appointments)) return [];
    return appointments.filter(appointment => appointment?.status === status);
};

const AppointmentList = ({ appointments, status, setSelectedAppointment }) => {
    const filteredAppointments = filterAppointments(appointments, status);

    return (
        <ScrollView style={styles.scrollContainer}>
            <View style={styles.cont}>
                {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((appointment) => (
                        <TouchableOpacity
                            style={styles.cardcont}
                            key={appointment._id}
                            onPress={() => setSelectedAppointment(appointment)} // Open modal instead of navigating
                        >
                            <View style={styles.container1}>
                                <View style={styles.datecontainer}>
                                    <Text style={styles.monthText}>{new Date(appointment.date).toLocaleString('en-US', { month: 'short' })}</Text>
                                    <Text style={styles.dateText}>{new Date(appointment.date).toLocaleString('en-US', { day: '2-digit' })}</Text>
                                </View>
                                <View style={{ borderRightColor: 'black', borderRightWidth: StyleSheet.hairlineWidth, height: '100%', marginHorizontal: 10 }}></View>
                                <View style={styles.infoCont}>
                                    <Text style={styles.doctorName}>
                                        Dr. {appointment.doctor.dr_firstName} {appointment.doctor.dr_lastName}
                                    </Text>
                                    <Text style={styles.dateTime}>
                                        {new Date(appointment.date).toLocaleDateString('en-US')} | {appointment.time}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.noAppointments}>No appointments available.</Text>
                )}
            </View>
        </ScrollView>
    );
};

const Upcoming = () => {
    const [allAppointments, setAllAppointments] = useState([]);
    const [userId, setUserId] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("Pending"); // Default status
    const [selectedAppointment, setSelectedAppointment] = useState(null); // To store selected appointment for modal
    const [modalVisible, setModalVisible] = useState(false); // Control modal visibility

    const fetchAppointments = useCallback(async () => {
        try {
            const id = await getData('userId');
            if (id) {
                setUserId(id);
                const response = await axios.get(`${ip.address}/api/patient/api/onepatient/${id}`);
                console.log(response.data.thePatient.patient_appointments);
                setAllAppointments(response.data.thePatient.patient_appointments);
            } else {
                console.log('User not found');
            }
        } catch (err) {
            console.log(err);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchAppointments();
        }, [fetchAppointments])
    );

    useEffect(() => {
        if (selectedAppointment) {
            setModalVisible(true); // Open modal when an appointment is selected
        }
    }, [selectedAppointment]);

    const handleModalClose = () => {
        setModalVisible(false);
        fetchAppointments(); // Refresh appointments when modal closes
    };

    return (
        <>
            <View style={styles.mainContainer}>
                {/* Segmented Button for toggling appointment status */}
                <SegmentedButtons
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                    buttons={[
                        { value: 'Pending', label: 'Pending' },
                        { value: 'Scheduled', label: 'Scheduled' },
                        { value: 'Cancelled', label: 'Cancelled' },
                        { value: 'Completed', label: 'Completed' },
                    ]}
                    style={{ marginBottom: 16, backgroundColor: 'white' }} // Adjust style as needed
                />

                {/* Appointment List */}
                <AppointmentList
                    appointments={allAppointments}
                    status={selectedStatus}
                    setSelectedAppointment={setSelectedAppointment}
                />

                {/* Appointment Details Modal */}
                <AppointmentDetails
                    isVisible={modalVisible}
                    appointmentData={selectedAppointment}
                    closeModal={handleModalClose}
                />
            </View>
        </>
    );
};

export default Upcoming;
