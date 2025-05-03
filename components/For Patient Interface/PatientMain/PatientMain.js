import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, BackHandler, Alert, Dimensions, StyleSheet, Text } from 'react-native';
import { TabView } from 'react-native-tab-view';
import { FAB, useTheme, ActivityIndicator } from 'react-native-paper';
import Homepage from '../Homepage/Homepage';
import Upcoming from '../Upcoming/Upcoming';
import DoctorSpecialty from '../Doctor Specialty/DoctorSpecialty';
import MyProfile from '../My Profile/MyProfile';
import Header3 from '../../Headers/Headers';
import NavigationBar from '../Navigation/NavigationBar';
import axios from 'axios';
import { ip } from '../../../ContentExport';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '@/UserContext';
import NotificationBadge from '../Homepage/NotificationBadge'; 
import sd from '../../../utils/styleDictionary';

const initialLayout = { width: Dimensions.get('window').width };

const PatientMain = () => {
  const navigation = useNavigation();
  const route = useRoute(); // Add this line to get route object
  const { user, role, isAuthenticated, unreadNotificationsCount } = useUser(); // Get unreadNotificationsCount from context
  const theme = useTheme();

  // State variables for patient data
  const [loading, setLoading] = useState(true);
  const [uname, setUname] = useState("");
  const [uImage, setUImage] = useState("");
  const [userId, setUserId] = useState("");
  const [patientData, setPatientData] = useState({});
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [doctorSpecialties, setDoctorSpecialties] = useState([]);
  const [recommendedDoctors, setRecommendedDoctors] = useState([]);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const [hasUnreadChatMessages, setHasUnreadChatMessages] = useState(false);
  const [lastRefreshTimestamp, setLastRefreshTimestamp] = useState(0);

  // TabView state
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'home', title: 'Home' },
    { key: 'upcoming', title: 'Upcoming' },
    { key: 'doctorspecialty', title: 'Doctor Specialty' },
    { key: 'myprofilepage', title: 'My Profile' },
    { key: 'notifications', title: 'Notifications' }, // Add notifications tab
  ]);

  // At the top of the PatientMain component
  useEffect(() => {
    if (!user && !loading) {
      console.log("No authenticated user, redirecting to login");
      navigation.replace('SigninPage'); // Redirect to login if no user
    }
  }, [user, loading, navigation]);

  // Then in your existing useEffect for fetching data
  useEffect(() => {
    // Set a default name while loading
    setUname("Patient");

    const fetchAllPatientData = async () => {
      if (!user || !user._id) {
        console.log("No authenticated user for data fetch");
        setLoading(false);
        return;
      }
      
      console.log("User authenticated, ID:", user._id);
      
      // Rest of your fetch logic stays the same...
      try {
        setLoading(true);
        const patientId = user._id;
        setUserId(patientId);
        
        // Create an array of promises for concurrent API calls
        const apiCalls = [
          axios.get(`${ip.address}/api/patient/api/onepatient/${patientId}`),
          axios.get(`${ip.address}/api/appointment/upcoming/${patientId}`),
          axios.get(`${ip.address}/api/appointment/past/${patientId}`),
          axios.get(`${ip.address}/api/doctor/specialties`),
          axios.get(`${ip.address}/api/doctor/recommended`)
        ];
        
        // Add this: Fetch notification count on startup
        fetchNotificationCount(patientId);
        
        const [
          profileResponse, 
          upcomingAppsResponse, 
          pastAppsResponse, 
          specialtiesResponse, 
          recommendedResponse
        ] = await Promise.all(apiCalls.map(p => p.catch(e => {
          console.error("API call failed:", e.message);
          return { data: null };
        })));

        // After API call
        console.log("Profile response data:", profileResponse.data);
        console.log("Patient data structure:", profileResponse.data?.thePatient);

        if (profileResponse.data?.thePatient) {
          const patient = profileResponse.data.thePatient;
          console.log("Patient name fields:", patient.patient_firstName, patient.patient_lastName);
          setPatientData(patient);
          setUname(patient.patient_firstName + " " + patient.patient_lastName);
          console.log("Set uname to:", patient.patient_firstName + " " + patient.patient_lastName);
          setUImage(patient.patient_image || "");
        }
        
        // Process patient profile data
        if (profileResponse.data?.thePatient) {
          const patient = profileResponse.data.thePatient;
          setPatientData(patient);
          setUname(patient.patient_firstName + " " + patient.patient_lastName);
          console.log("Set uname to:", patient.patient_firstName + " " + patient.patient_lastName);
          setUImage(patient.patient_image || "");
        }
        
        if (upcomingAppsResponse.data) {
          setUpcomingAppointments(upcomingAppsResponse.data.appointments || []);
        }
        
        if (pastAppsResponse.data) {
          setPastAppointments(pastAppsResponse.data.appointments || []);
        }
        
        if (specialtiesResponse.data) {
          setDoctorSpecialties(specialtiesResponse.data.specialties || []);
        }
        
        if (recommendedResponse.data) {
          setRecommendedDoctors(recommendedResponse.data.doctors || []);
        }
        
      } catch (error) {
        console.error("Error fetching patient data:", error);
        Alert.alert("Error", "Failed to load your profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllPatientData();
  }, [user]);

  // Handle specialty parameter from navigation
  useEffect(() => {
    // Check if there's a specialty parameter
    if (route.params?.specialty) {
      console.log("Specialty selected:", route.params.specialty);
      
      // Find the index of doctorspecialty tab
      const doctorSpecialtyIndex = routes.findIndex(route => route.key === 'doctorspecialty');
      if (doctorSpecialtyIndex !== -1) {
        // Switch to doctorspecialty tab
        setIndex(doctorSpecialtyIndex);
      }
    }
  }, [route.params?.specialty]); // Only re-run when specialty parameter changes

  
  // Handle specialty parameter from navigation
  useEffect(() => {
    if (route.params?.specialty) {
      console.log("Specialty selected:", route.params.specialty);
      // Set index to the doctor specialty tab
      setIndex(2); // Index 2 corresponds to the doctorspecialty route
    }
  }, [route.params?.specialty]);

  useEffect(() => {
    if (route.params?.setActiveTab) {
      console.log("Setting active tab to:", route.params.setActiveTab);
      // Map tab names to indices
      const tabIndices = {
        'Home': 0,
        'Upcoming': 1,
        'Doctor Specialty': 2,
        'My Profile': 3
      };
      
      // Set the tab index based on the tab name
      if (tabIndices[route.params.setActiveTab] !== undefined) {
        setIndex(tabIndices[route.params.setActiveTab]);
      }
    }
  }, [route.params?.setActiveTab]);

  useEffect(() => {
    if (userId) {
      // Initialize socket connection
      const newSocket = io(ip.address, { transports: ['websocket'] });
      setSocket(newSocket);
      
      // Identify user to socket server
      newSocket.emit('identify', { userId: userId.toString(), userRole: 'Patient' });
      
      // Request current unread status when connected
      newSocket.emit('checkUnreadMessages', {
        userId: userId,
        userRole: 'Patient'
      });
      
      // Listen for chat notifications
      newSocket.on('chatNotification', (data) => {
        console.log('Received chat notification:', data);
        setUnreadChatCount(prev => prev + 1);
        setHasUnreadChatMessages(true);
      });
      
      // Add handler for staff messages
      newSocket.on('newChatNotification', (data) => {
        console.log('Received new chat notification:', data);
        setUnreadChatCount(prev => prev + 1);
        setHasUnreadChatMessages(true);
      });
      
      // Generic chat message handler
      newSocket.on('newChatMessage', (data) => {
        console.log('Received new chat message:', data);
        setUnreadChatCount(prev => prev + 1);
        setHasUnreadChatMessages(true);
      });
      
      // Handle server's unread status response
      newSocket.on('unreadMessagesStatus', (data) => {
        console.log('Unread messages status:', data);
        if (data.hasUnread) {
          setHasUnreadChatMessages(true);
          
          // If server reports unread but we don't have count, fetch notifications
          if (unreadChatCount === 0) {
            fetchUnreadChatCount();
          }
        } else {
          setHasUnreadChatMessages(false);
        }
      });
      
      return () => {
        if (newSocket) {
          newSocket.disconnect();
        }
      };
    }
  }, [userId]);

  const fetchUnreadChatCount = async () => {
    try {
      const response = await axios.get(`${ip.address}/api/chat/unread-count/${userId}?role=Patient`);
      if (response.data && response.data.count !== undefined) {
        setUnreadChatCount(response.data.count);
        setHasUnreadChatMessages(response.data.count > 0);
      }
    } catch (error) {
      console.error('Error fetching unread chat count:', error);
    }
  };

  const markChatMessagesAsRead = async () => {
    try {
      // Update UI immediately for better user experience
      setUnreadChatCount(0);
      setHasUnreadChatMessages(false);
      
      // Inform server through API
      await axios.post(`${ip.address}/api/chat/markread`, {
        userId: userId,
        role: 'Patient'
      });
      
      // Also inform through socket
      if (socket && socket.connected) {
        socket.emit('markMessagesRead', {
          userId: userId,
          userRole: 'Patient'
        });
      }
    } catch (error) {
      // console.error('Error marking chat messages as read:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        if (route.params?.fromChat) {
          setUnreadChatCount(0);
        }
      });

      return unsubscribe;
    }, [navigation, route.params?.fromChat])
  );

  // Handle back button
  const handleBackPress = () => {
    const currentTab = getCurrentTab();
    if (currentTab !== 'Home') {
      setIndex(0); // Go to home tab
      return true;
    } else {
      Alert.alert(
        'Exit App',
        'Are you sure you want to exit the app?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'OK', onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: false }
      );
      return true;
    }
  };

  // Register back handler
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () => subscription.remove();
    }, [index])
  );

  // Define scene components
  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'home':
        return <Homepage 
          patientName={uname}
          upcomingAppointments={upcomingAppointments}
          recommendedDoctors={recommendedDoctors}
          refreshMaster={refreshAllData}
          lastRefreshTimestamp={lastRefreshTimestamp}
        />;
      case 'upcoming':
        return <Upcoming 
          upcomingAppointments={upcomingAppointments} 
          pastAppointments={pastAppointments}
          patientId={userId}
          refreshMaster={refreshAllData}
          lastRefreshTimestamp={lastRefreshTimestamp}
        />;
      case 'doctorspecialty':
        return <DoctorSpecialty 
          ref={doctorSpecialtyRef}
          specialties={doctorSpecialties}
          recommendedDoctors={recommendedDoctors}
          preSelectedSpecialty={route.params?.specialty}
          refreshMaster={refreshAllData}
          lastRefreshTimestamp={lastRefreshTimestamp}
        />;
      case 'myprofile':
        return <MyProfile 
          patientData={patientData}
          userId={userId} 
          refreshMaster={refreshAllData}
          lastRefreshTimestamp={lastRefreshTimestamp}
        />;
      default:
        return null;
    }
  };

  // Handle tab change from the navigation bar
  const handleTabChange = (tabName) => {
    console.log("Tab changed to:", tabName);
    
    // Map tab names to indices
    const tabIndices = {
      'Home': 0,
      'Upcoming': 1,
      'Doctor Specialty': 2,
      'My Profile': 3
    };
    
    // Store the previous tab index before changing
    setPreviousTabIndex(index);
    
    // Set the new tab index
    const newIndex = tabIndices[tabName];
    setIndex(newIndex);
    
    // If we're navigating away from Doctor Specialty tab, reset filters
    if (previousTabIndex === 2 && newIndex !== 2) {
      // Reset filters in the Doctor Specialty component
      if (doctorSpecialtyRef.current) {
        doctorSpecialtyRef.current.resetAllFilters();
      }
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header3 
        name={uname} 
        imageUri={uImage} 
        lastRefreshTimestamp={lastRefreshTimestamp}
      />
      
      <View style={styles.tabContainer}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={(newIndex) => {
            // If swiping away from Doctor Specialty tab, reset filters
            if (index === 2 && newIndex !== 2) {
              if (doctorSpecialtyRef.current) {
                doctorSpecialtyRef.current.resetAllFilters();
              }
            }
            setPreviousTabIndex(index);
            setIndex(newIndex);
          }}
          initialLayout={initialLayout}
          renderTabBar={() => null} // No top tab bar, we'll use our custom bottom bar
          swipeEnabled={true}
          animationEnabled={true}
          style={styles.tabView}
        />
      </View>
      
      <NavigationBar
        activeTab={getCurrentTab()}
        onTabChange={handleTabChange}
      />

      <>
        <FAB
          icon="message"
          size="medium"
          style={styles.fab}
          color='white'
          onPress={() => {
            markChatMessagesAsRead();
            navigation.navigate('ptnchat', {userId: userId});
          }}
        />
        {hasUnreadChatMessages && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadChatCount > 99 ? '99+' : unreadChatCount > 0 ? unreadChatCount : ''}
            </Text>
          </View>
        )}
      </>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabContainer: {
    flex: 1,
    // paddingBottom: 80, // Space for navigation bar
  },
  tabView: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 10,
    bottom: 120,
    margin: 16,
    backgroundColor: sd.colors.blue,
  },
  badge: {
    position: 'absolute',
    right: 8,
    bottom: 180,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    minWidth: 15,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    zIndex: 1,
    borderWidth: 2,
    borderColor: 'white',
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontFamily: sd.fonts.bold,
    textAlign: 'center',
  },
});

export default PatientMain;