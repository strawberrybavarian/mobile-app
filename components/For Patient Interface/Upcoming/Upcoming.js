import React, { useCallback, useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    ScrollView, 
    StyleSheet, 
    ActivityIndicator,
    RefreshControl,
    Modal
} from 'react-native';
import { getData } from '../../storageUtility';
import axios from 'axios';
import { ip } from '../../../ContentExport';
import { useFocusEffect } from '@react-navigation/native';
import styles from './UpcomingCSS';
import AppointmentDetails from '../AppointmentDetails/AppointmentDetails';
import sd from '../../../utils/styleDictionary';
import { useTheme } from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons';

// Define status options for consistency
const STATUS_OPTIONS = [
    { value: 'Pending', label: 'Pending', icon: 'clock' },
    { value: 'Scheduled', label: 'Scheduled', icon: 'calendar-check' },
    { value: 'Completed', label: 'Completed', icon: 'check-circle' },
    { value: 'Cancelled', label: 'Cancelled', icon: 'calendar-times' },
    { value: 'Rescheduled', label: 'Rescheduled', icon: 'redo' }
];

const filterAppointments = (appointments, status) => {
    if (!Array.isArray(appointments)) return [];
    return appointments.filter(appointment => appointment?.status === status);
};

const AppointmentList = ({ appointments, status, setSelectedAppointment, refreshing, onRefresh }) => {
    const filteredAppointments = filterAppointments(appointments, status);
  
    return (
      <ScrollView 
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[sd.colors.blue]}
            tintColor={sd.colors.blue}
            title="Refreshing..."
            titleColor={sd.colors.blue}
          />
        }
      >
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
                      Dr. {appointment.doctor?.dr_firstName} {appointment.doctor?.dr_lastName}
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
            <Text style={styles.noAppointments}>
              No {status.toLowerCase()} appointments found.
            </Text>
          )}
        </View>
      </ScrollView>
    );
};

const createCustomStyles = (theme) => StyleSheet.create({
    // Update header style to a row layout with space between elements
    statusHeader: {
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'column', // Changed from column to row
        justifyContent: 'space-between', 
        alignItems: 'flex', // Changed from flex-start to center
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    statusHeaderTitle: {
        fontSize: 18,
        marginBottom: 5,
        fontFamily: sd.fonts.semiBold,
        color: sd.colors.blue, // Changed to match brand color
    },
    // Update dropdown trigger styling to match Doctor Specialty filter button
    dropdownTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        minWidth: 120,
    },
    dropdownTriggerText: {
        fontFamily: sd.fonts.medium,
        color: sd.colors.blue,
        fontSize: 14,
        marginRight: 8,
        flex: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'flex-start',
        alignItems: 'center', // Changed to center
        paddingTop: 180,
    },
    // Updated dropdown container to be wider
    dropdownContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 8,
        width: '85%', // Much wider than before
        maxWidth: 360, // Add a max width for larger screens
        ...sd.shadows.medium,
    },
    // Make dropdown items slightly larger
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14, // More padding to increase touch target
        paddingHorizontal: 16,
        borderRadius: 6,
        marginVertical: 1,
    },
    dropdownItemActive: {
        backgroundColor: '#f0f7ff',
    },
    dropdownItemIcon: {
        marginRight: 12,
        width: 24, // Slightly larger
        textAlign: 'center',
    },
    dropdownItemText: {
        flex: 1,
        fontFamily: sd.fonts.regular,
        fontSize: 15, // Slightly larger
        color: '#555',
    },
    dropdownItemTextActive: {
        color: sd.colors.blue,
        fontFamily: sd.fonts.medium,
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
        fontFamily: sd.fonts.regular,
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
    const [refreshing, setRefreshing] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    
    const theme = useTheme();
    const customStyles = createCustomStyles(theme);
    
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchAppointments().finally(() => setRefreshing(false));
    }, []);

    const fetchAppointments = useCallback(async () => {
        try {
            if (!refreshing) setIsLoading(true);
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
            return;
        }
    }, [refreshing]);

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
            {/* Status Dropdown Header */}
            <View style={customStyles.statusHeader}>
                <Text style={customStyles.statusHeaderTitle}>My Appointments</Text>
                
                {/* Dropdown Trigger */}
                <TouchableOpacity 
                    style={customStyles.dropdownTrigger}
                    onPress={() => setDropdownVisible(true)}
                >
                    <FontAwesome5 
                        name={STATUS_OPTIONS.find(opt => opt.value === selectedStatus)?.icon || 'filter'} 
                        size={14} 
                        color={sd.colors.blue} 
                        style={{marginRight: 8}}
                    />
                    <Text style={customStyles.dropdownTriggerText}>
                        {selectedStatus}
                    </Text>
                    <FontAwesome5 name="chevron-down" size={12} color={sd.colors.blue} />
                </TouchableOpacity>
            </View>
            
            {/* Dropdown Modal */}
            <Modal
                visible={dropdownVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setDropdownVisible(false)}
            >
                <TouchableOpacity 
                    style={customStyles.modalOverlay} 
                    activeOpacity={1}
                    onPress={() => setDropdownVisible(false)}
                >
                    <View style={customStyles.dropdownContainer}>
                        {STATUS_OPTIONS.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    customStyles.dropdownItem,
                                    selectedStatus === option.value && customStyles.dropdownItemActive
                                ]}
                                onPress={() => {
                                    setSelectedStatus(option.value);
                                    setDropdownVisible(false);
                                }}
                            >
                                <FontAwesome5 
                                    name={option.icon} 
                                    size={18} // Slightly larger
                                    color={selectedStatus === option.value ? sd.colors.blue : '#777'} 
                                    style={customStyles.dropdownItemIcon}
                                />
                                <Text 
                                    style={[
                                        customStyles.dropdownItemText,
                                        selectedStatus === option.value && customStyles.dropdownItemTextActive
                                    ]}
                                >
                                    {option.label}
                                </Text>
                                {selectedStatus === option.value && (
                                    <FontAwesome5 name="check" size={16} color={sd.colors.blue} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>

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
                    refreshing={refreshing}
                    onRefresh={onRefresh}
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

export default Upcoming;
