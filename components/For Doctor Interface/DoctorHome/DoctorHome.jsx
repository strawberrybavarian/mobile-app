import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, TextInput, RefreshControl } from 'react-native';
import { DoctorHomeStyles } from './DoctorHomeStyles';
import Carousel from "react-native-reanimated-carousel";
import sd from '../../../utils/styleDictionary';
import { Card, useTheme, Divider, FAB, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { ip } from '../../../ContentExport';
import { getData } from '../../storageUtility';
import DoctorPosts from './DoctorHomeComponents/DoctorPosts';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const DoctorHome = ({ refreshMaster, lastRefreshTimestamp, isRefreshing }) => {
  const [doctorId, setDoctorId] = useState(null);
  const [doctor, setDoctor] = useState({});
  const [todayAppointments, setTodayAppointments] = useState(0);
  const [pendingAppointments, setPendingAppointments] = useState(0);
  const [completedAppointments, setCompletedAppointments] = useState(0);
  const [upcomingAppointments, setUpcomingAppointments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categorizedAppointments, setCategorizedAppointments] = useState({
    today: [],
    pending: [],
    completed: [],
    upcoming: [],
    ongoing: []
  });
 
  const navigation = useNavigation();
  const [announcement, setAnnouncement] = useState('');
  const [announcementsList, setAnnouncementsList] = useState([]);
  
  const theme = useTheme();  
  const styles = DoctorHomeStyles(theme);
   
  // Fetch and set the doctor ID
  useEffect(() => {
    const fetchDoctorId = async () => {
      try {
        const id = await getData('userId');
        console.log('Doctor ID fetched:', id);
        setDoctorId(id);
      } catch (err) {
        console.error('Error fetching doctor ID:', err);
      }
    };

    fetchDoctorId();
  }, []);

  // Fetch data when doctorId is available
  useEffect(() => {
    if (doctorId) {
      fetchAnnouncements(doctorId);
      fetchDoctor(doctorId);
      fetchAppointmentCounts(doctorId);
    }
  }, [doctorId]);

  // Add this to refresh posts when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (doctorId) {
        fetchAnnouncements(doctorId);
      }
    }, [doctorId])
  );

  // Watch for changes in lastRefreshTimestamp
  useEffect(() => {
    if (lastRefreshTimestamp && !isRefreshing && !refreshing) {
      // Refresh data when master refresh timestamp changes
      if (doctorId) {
        fetchAppointmentCounts(doctorId);
        fetchAnnouncements(doctorId);
        fetchDoctor(doctorId);
      }
    }
  }, [lastRefreshTimestamp]);

  const fetchAppointmentCounts = async (id) => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const response = await axios.get(`${ip.address}/api/doctor/${id}/appointments`);
      
      if (response.data && response.data.appointments) {
        const appointments = response.data.appointments;
        
        // Count appointments by status
        const todayCount = appointments.filter(
          appointment => appointment.date.split('T')[0] === today
        ).length;
        
        const pendingCount = appointments.filter(
          appointment => appointment.status === 'Pending'
        ).length;
        
        const completedCount = appointments.filter(
          appointment => appointment.status === 'Completed'
        ).length;
        
        const upcomingCount = appointments.filter(appointment => {
          const appointmentDate = appointment.date.split('T')[0];
          return appointmentDate > today;
        }).length;
        
        // Set counts
        setTodayAppointments(todayCount);
        setPendingAppointments(pendingCount);
        setCompletedAppointments(completedCount);
        setUpcomingAppointments(upcomingCount);
        
        // Categorize appointments for display
        setCategorizedAppointments(categorizeAppointments(appointments));
      }
    } catch (error) {
      console.error('Error fetching appointment counts:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshPosts = () => {
    fetchAnnouncements(doctorId);
  };

  const fetchDoctor = useCallback((id) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${ip.address}/api/doctor/one/${id}`)
        .then((res) => {
          console.log('Doctor fetched:', res.data);
          setDoctor(res.data?.doctor);
          resolve();
        })
        .catch((err) => {
          console.error('Error fetching doctor:', err);
          reject(err);
        });
    });
  }, []);

  const fetchAnnouncements = useCallback((id) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${ip.address}/api/doctor/api/post/getallpost/${id}`)
        .then((res) => {
          console.log('Announcements fetched:', res.data);
          setAnnouncementsList(res.data?.posts.reverse());
          resolve();
        })
        .catch((err) => {
          console.error('Error fetching announcements:', err);
          reject(err);
        });
    });
  }, []);

  const handleViewAppointments = (type) => {
    // Navigate to appointments screen with filter
    navigation.navigate('doctorappointments', { filter: type });
  };

  // Implement the onRefresh callback for pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (doctorId) {
        await Promise.all([
          fetchAnnouncements(doctorId),
          fetchDoctor(doctorId),
          fetchAppointmentCounts(doctorId)
        ]);
      }
      
      // Call the master refresh to update all tabs
      if (refreshMaster && typeof refreshMaster === 'function') {
        refreshMaster('Home data updated');
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [doctorId, refreshMaster]);

  const categorizeAppointments = (appointments) => {
    const today = new Date().toISOString().split('T')[0];
    
    return {
      today: appointments.filter(appointment => 
        appointment.date.split('T')[0] === today
      ).map(formatAppointment),
      
      pending: appointments.filter(appointment => 
        appointment.status === 'Pending'
      ).map(formatAppointment),
      
      completed: appointments.filter(appointment => 
        appointment.status === 'Completed'
      ).map(formatAppointment),
      
      upcoming: appointments.filter(appointment => {
        const appointmentDate = appointment.date.split('T')[0];
        return appointmentDate > today;
      }).map(formatAppointment),
      
      ongoing: appointments.filter(appointment => 
        appointment.status === 'Ongoing'
      ).map(formatAppointment)
    };
  };

  // Helper function to format appointment for display
  const formatAppointment = (appointment) => {
    return {
      id: appointment._id,
      appointmentId: appointment.appointment_ID,
      patientName: `${appointment.patient.patient_firstName} ${appointment.patient.patient_lastName}`,
      date: new Date(appointment.date).toLocaleDateString(),
      time: appointment.time,
      status: appointment.status,
      reason: appointment.reason
    };
  };

  return (  
    <>
      <SafeAreaView 
        style={[styles.container, {padding: 0}]}
        edges={['left', 'right', 'bottom']}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing || isRefreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
              title="Pull to refresh"
              titleColor={theme.colors.primary}
            />
          }
        >
          {/* Status Cards */}
          <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>  
            <Text style={styles.title}>Status</Text>
            
            {loading ? (
              <Card style={styles.loadingCard}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Loading appointment data...</Text>
              </Card>
            ) : (
              <View style={styles.statusCardsContainer}>
                {/* Today's Appointments Card */} 
                <View 
                  style={styles.statusCardWrapper}
                >
                  <Card style={[styles.statusCard, { borderColor: theme.colors.primary }]}>
                    <Card.Content style={styles.statusCardContent}>
                      <View style={styles.statusIconContainer}>
                        <FontAwesome5 
                          name="calendar-day" 
                          size={26} 
                          color={theme.colors.primary} 
                          style={styles.statusIcon} 
                        />
                      </View>
                      <View style={styles.statusTextContainer}>
                        <Text style={styles.statusCount}>{todayAppointments}</Text>
                        <Text style={styles.statusLabel}>Today's Patients</Text>
                      </View>
                    </Card.Content>
                  </Card>
                </View>
                
                {/* Pending Appointments Card */}
                <View 
                  style={styles.statusCardWrapper}
                >
                  <Card style={[styles.statusCard, { borderColor: theme.colors.secondary }]}>
                    <Card.Content style={styles.statusCardContent}>
                      <View style={[styles.statusIconContainer, { backgroundColor: '#FFF3E0' }]}>
                        <MaterialCommunityIcons 
                          name="clock-time-four" 
                          size={28} 
                          color={theme.colors.secondary} 
                          style={styles.statusIcon} 
                        />
                      </View>
                      <View style={styles.statusTextContainer}>
                        <Text style={[styles.statusCount, { color: theme.colors.secondary }]}>
                          {pendingAppointments}
                        </Text>
                        <Text style={styles.statusLabel}>Pending Patients</Text>
                      </View>
                    </Card.Content>
                  </Card>
                </View>
              </View>
            )}
          </View>  

          {/* Posts */}
          <View style={{ flex: 2, marginTop: 20, paddingHorizontal: 16 }}>
            <Text style={styles.title}>Announcements</Text>
            <Divider/>
            <DoctorPosts posts={announcementsList} doctor={doctor} refreshPosts={refreshPosts}/>
          </View>
        </ScrollView>

        <FAB
          icon="plus"
          size="medium"
          style={{
            position: 'absolute',
            right: 0,
            bottom: 80,
            margin: 16,
            backgroundColor: theme.colors.primary,
          }}
          onPress={() =>
            navigation.navigate('drpost', { 
              doctorId, 
              drimg: doctor?.dr_image,
            })
          }
        />
      </SafeAreaView>
    </>
  );
};

// Add these styles to your DoctorHomeStyles.js file
const additionalStyles = {
  statusCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  statusCardWrapper: {
    width: '48%',
  },
  statusCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statusCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  statusIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusCount: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#1976D2',
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#555',
  },
  loadingCard: {
    padding: 20,
    alignItems: 'center',
    marginVertical: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
};

export default DoctorHome;