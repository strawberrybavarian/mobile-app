import React, { useCallback, useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    ScrollView, 
    StyleSheet, 
    ActivityIndicator 
} from 'react-native';
import { getData } from '../../storageUtility';
import axios from 'axios';
import { ip } from '../../../ContentExport';
import { useFocusEffect } from '@react-navigation/native';
import styles from './UpcomingCSS';
import AppointmentDetails from '../AppointmentDetails/AppointmentDetails';
import sd from '../../../utils/styleDictionary';
import { useTheme } from 'react-native-paper';

// Define status options for consistency
const STATUS_OPTIONS = [
    { value: 'Pending', label: 'Pending', icon: 'clock' },
    { value: 'Scheduled', label: 'Scheduled', icon: 'calendar-check' },
    { value: 'Cancelled', label: 'Cancelled', icon: 'calendar-times' },
    { value: 'Completed', label: 'Completed', icon: 'check-circle' }
];



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
                style={styles.cardContainer}
                key={appointment._id}
                onPress={() => setSelectedAppointment(appointment)}
              >
                <View style={styles.cardContent}>
                  {/* Date Section */}
                  <View style={styles.dateContainer}>
                    <Text style={styles.monthText}>
                      {new Date(appointment.date).toLocaleString('en-US', { month: 'short' })}
                    </Text>
                    <Text style={styles.dateText}>
                      {new Date(appointment.date).toLocaleString('en-US', { day: '2-digit' })}
                    </Text>
                  </View>
  
                  {/* Divider */}
                  <View style={styles.divider} />
  
                  {/* Appointment Info */}
                  <View style={styles.infoContainer}>
                    <Text style={styles.doctorName}>
                      Dr. {appointment.doctor.dr_firstName} {appointment.doctor.dr_lastName}
                    </Text>
                    <Text style={styles.dateTime}>
                      {new Date(appointment.date).toLocaleDateString('en-US')} | {appointment.time}
                    </Text>
                    <Text style={styles.statusText}>
                      Status: {appointment.status}
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

const createCustomStyles = (theme) => StyleSheet.create({
    statusTabContainer: {
        backgroundColor: theme.colors.primary,
        paddingTop: 6,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    tabScrollContent: {
        paddingHorizontal: 10,
    },
    statusTab: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginHorizontal: 4,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusTabActive: {
        backgroundColor: 'transparent',
    },
    statusTabText: {
        fontSize: sd.fontSizes.medium,
        fontFamily: 'Poppins',
        color: 'white',
    },
    statusTabTextActive: {
        color: 'white',
        fontFamily: 'Poppins-SemiBold',
        fontSize: sd.fontSizes.medium,
    },
    activeIndicator: {
        position: 'absolute',
        bottom: 2,
        left: 8,
        right: 8,
        height: 2,
        backgroundColor: sd.colors.white,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
    },

    statusInfoText: {
        fontSize: 13,
        fontFamily: 'Poppins',
        color: '#555',
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
        fontFamily: 'Poppins',
        fontSize: 16,
    }
});

const Upcoming = () => {
    const [allAppointments, setAllAppointments] = useState([]);
    const [userId, setUserId] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("Pending");
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const theme = useTheme();
    const customStyles = createCustomStyles(theme);
    

    const fetchAppointments = useCallback(async () => {
        try {
            setIsLoading(true);
            const id = await getData('userId');
            if (id) {
                setUserId(id);
                const response = await axios.get(`${ip.address}/api/patient/api/onepatient/${id}`);
                setAllAppointments(response.data.thePatient.patient_appointments);
            } else {
                console.log('User not found');
            }
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchAppointments();
        }, [fetchAppointments])
    );

    useEffect(() => {
        if (selectedAppointment) {
            setModalVisible(true);
        }
    }, [selectedAppointment]);

    const handleModalClose = () => {
        setModalVisible(false);
        fetchAppointments();
    };

    return (
        <View style={styles.mainContainer}>
            {/* Custom Tab Navigation */}
            <View style={customStyles.statusTabContainer}>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={customStyles.tabScrollContent}
                >
                    {STATUS_OPTIONS.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={[
                                customStyles.statusTab,
                                selectedStatus === option.value && customStyles.statusTabActive
                            ]}
                            onPress={() => setSelectedStatus(option.value)}
                        >
                            <Text 
                                style={[
                                    customStyles.statusTabText,
                                    selectedStatus === option.value && customStyles.statusTabTextActive
                                ]}
                            >
                                {option.label}
                            </Text>
                            {selectedStatus === option.value && (
                                <View style={customStyles.activeIndicator} />
                            )}
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Status Info */}
            <View style={customStyles.statusInfoContainer}>
                <Text style={customStyles.statusInfoText}>
                    {selectedStatus === 'Pending' }
                    {selectedStatus === 'Scheduled' }
                    {selectedStatus === 'Cancelled' }
                    {selectedStatus === 'Completed' }
                </Text>
            </View>

            {/* Loading State */}
            {isLoading ? (
                <View style={customStyles.loadingContainer}>
                    <ActivityIndicator size="large" color={sd.colors.blue} />
                    <Text style={customStyles.loadingText}>Loading appointments...</Text>
                </View>
            ) : (
                <AppointmentList
                    appointments={allAppointments}
                    status={selectedStatus}
                    setSelectedAppointment={setSelectedAppointment}
                />
            )}

            {/* Appointment Details Modal */}
            <AppointmentDetails
                isVisible={modalVisible}
                appointmentData={selectedAppointment}
                closeModal={handleModalClose}
            />
        </View>
    );
};

// Custom styles for the new tab navigation


export default Upcoming;
