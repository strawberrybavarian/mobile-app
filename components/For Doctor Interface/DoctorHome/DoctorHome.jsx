import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native';
import { DoctorHomeStyles } from './DoctorHomeStyles';
import Carousel from "react-native-reanimated-carousel";
import sd from '../../../utils/styleDictionary';
import { Card, useTheme, Divider, FAB, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { ip } from '@/ContentExport';
import { getData } from '@/components/storageUtility';
import DoctorPosts from './DoctorHomeComponents/DoctorPosts';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const DoctorHome = () => {
  const [doctorId, setDoctorId] = useState(null);
  const [doctor, setDoctor] = useState({});
  const [todayAppointments, setTodayAppointments] = useState(0);
  const [pendingAppointments, setPendingAppointments] = useState(0);
  const [loading, setLoading] = useState(true);

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

  const fetchAppointmentCounts = async (id) => {
    setLoading(true);
    try {
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch all appointments for the doctor
      const response = await axios.get(`${ip.address}/api/doctor/appointments/${id}`);
      
      if (response.data && response.data.appointments) {
        // Count today's appointments
        const todayCount = response.data.appointments.filter(
          appointment => appointment.date.split('T')[0] === today
        ).length;
        
        // Count pending appointments
        const pendingCount = response.data.appointments.filter(
          appointment => appointment.status === 'Pending'
        ).length;
        
        setTodayAppointments(todayCount);
        setPendingAppointments(pendingCount);
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

  const fetchDoctor = (id) => {
    axios
      .get(`${ip.address}/api/doctor/one/${id}`)
      .then((res) => {
        console.log('Doctor fetched:', res.data);
        setDoctor(res.data?.doctor);
      })
      .catch((err) => console.error('Error fetching doctor:', err));
  };

  const fetchAnnouncements = (id) => {
    axios
      .get(`${ip.address}/api/doctor/api/post/getallpost/${id}`)
      .then((res) => {
        console.log('Announcements fetched:', res.data);
        setAnnouncementsList(res.data?.posts.reverse());
      })
      .catch((err) => console.error('Error fetching announcements:', err));
  };

  const handleViewAppointments = (type) => {
    // Navigate to appointments screen with filter
    navigation.navigate('doctorappointments', { filter: type });
  };

  return (  
    <>
      <SafeAreaView 
        style={[styles.container, {padding: 0}]}
        edges={['left', 'right', 'bottom']}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
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
              fetchPosts: () => fetchAnnouncements(doctorId),
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