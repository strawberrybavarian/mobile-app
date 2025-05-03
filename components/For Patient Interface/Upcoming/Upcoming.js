import React, { useCallback, useEffect, useState, useRef } from 'react';
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
import AppointmentStepper from '../AppointmentStepper/AppointmentStepper';
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
    
    // Special case for Completed/Archived toggle
    if (status === 'Completed') {
        return appointments.filter(appointment => 
            appointment.status === (showArchived ? 'Archived' : 'Completed')
        );
    }
    
    // Regular filtering for other statuses
    return appointments.filter(appointment => appointment.status === status);
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
    


    // Add these animation values
    const stepperAnimation = useRef(new Animated.Value(0)).current;
    const filterAnimation = useRef(new Animated.Value(0)).current;
    
    // Animate stepper when it becomes visible
    useEffect(() => {
        if (!isLoading && activeAppointment) {
            Animated.timing(stepperAnimation, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true
            }).start();
        }
    }, [isLoading, activeAppointment]);
    
    // Animate filter on component mount
    useEffect(() => {
        Animated.timing(filterAnimation, {
            toValue: 1,
            duration: 500,
            delay: 300,
            useNativeDriver: true
        }).start();
    }, []);
    
    // Modified onRefresh to trigger master refresh
    const onRefresh = useCallback(async () => {
        setRefreshing(true); // This triggers the RefreshControl spinner, not a full screen reload
        
        try {
            // Call the master refresh function
            await refreshMaster();
            
            // Then do component-specific refreshes if needed
            // These should use their own loading states that don't affect the whole screen
        } finally {
            setRefreshing(false);
        }
    }, [refreshMaster]);

    // React to refresh signals from parent
    useEffect(() => {
        if (lastRefreshTimestamp > 0) {
            // Refresh local data that may not be in the master refresh
            fetchAppointments();
        }
    }, [lastRefreshTimestamp]);

    // Updated fetchAppointments function with revised status priority
    const fetchAppointments = useCallback(async () => {
        try {
            if (!refreshing) setIsLoading(true);
            const id = await getData('userId');
            if (id) {
                setUserId(id);
                const response = await axios.get(`${ip.address}/api/patient/api/onepatient/${id}`);
                const appointments = response.data.thePatient.patient_appointments;
                setAllAppointments(appointments);
                
                // Find and set the active appointment
                const sorted = [...appointments].sort((a, b) => {
                    // First, prioritize by most recent date
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    
                    const today = new Date();
                    
                    // Calculate if dates are in the past or future
                    const aInPast = dateA < today;
                    const bInPast = dateB < today;
                    
                    // If one is in the future and one is in the past, prioritize future
                    if (!aInPast && bInPast) return -1;
                    if (aInPast && !bInPast) return 1;
                    
                    // If both in future or both in past, use date proximity to today
                    // For future: closest to today first
                    // For past: closest to today first (most recent)
                    const aDiff = Math.abs(dateA - today);
                    const bDiff = Math.abs(dateB - today);
                    
                    const dateDiff = aDiff - bDiff;
                    if (Math.abs(dateDiff) > 86400000) { // If more than 1 day difference
                        return dateDiff;
                    }
                    
                    // If dates are within 1 day of each other, use status priority
                    // Only now do we check status - this is secondary to date
                    const statusPriority = {
                        'Ongoing': 0,       // Actively happening now
                        'For Payment': 1,   // Needs immediate action
                        'To-send': 2,       // Needs attention
                        'Scheduled': 3,     // Confirmed future
                        'Pending': 4,       // Awaiting confirmation
                        'Rescheduled': 5,   // Changed but still active
                        'Completed': 6,     // Finished
                        'Cancelled': 7,     // No longer happening
                        'Missed': 8         // Lowest priority
                    };
                    
                    return statusPriority[a.status] - statusPriority[b.status];
                });
                
                // Set the first appointment as active (highest priority)
                if (sorted.length > 0) {
                    setActiveAppointment(sorted[0]);
                } else {
                    setActiveAppointment(null);
                }
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

    // Existing focus effect
    useFocusEffect(
        useCallback(() => {
            fetchAppointments();
        }, [fetchAppointments])
    );

    // Existing selected appointment effect
    useEffect(() => {
        if (selectedAppointment) {
            setModalVisible(true);
        }
    }, [selectedAppointment]);

    const handleModalClose = () => {
        setModalVisible(false);
        fetchAppointments(); // Refresh appointments when modal closes
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

            <AppointmentDetails
                isVisible={modalVisible}
                appointmentData={selectedAppointment}
                closeModal={handleModalClose}
            />
        </View>
    );
};

export default Upcoming;
