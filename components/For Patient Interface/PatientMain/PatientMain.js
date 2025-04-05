import React, { useState, useEffect, useCallback } from 'react';
import { View, Dimensions, BackHandler, Alert } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import Homepage from '../Homepage/Homepage';
import Upcoming from '../Upcoming/Upcoming';
import DoctorSpecialty from '../Doctor Specialty/DoctorSpecialty';
import MyProfile from '../My Profile/MyProfile';
import NavigationBar from '../Navigation/NavigationBar';
import Header3 from '../../Headers/Headers';
import axios from 'axios';
import { ip } from '../../../ContentExport';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FAB, useTheme, ActivityIndicator } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '@/UserContext';
import NotificationBadge from '../Homepage/NotificationBadge'; 

const initialLayout = { width: Dimensions.get('window').width };

const PatientMain = () => {
  const [index, setIndex] = useState(0);
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
  
  // Tab routes
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
        
        console.log("Fetching data for patient:", patientId);
        
        // Create an array of promises for concurrent API calls
        const apiCalls = [
          // Basic patient profile data
          axios.get(`${ip.address}/api/patient/api/onepatient/${patientId}`),
          
          // Upcoming appointments
          axios.get(`${ip.address}/api/appointment/upcoming/${patientId}`),
          
          // Past appointments
          axios.get(`${ip.address}/api/appointment/past/${patientId}`),
          
          // Available doctor specialties
          axios.get(`${ip.address}/api/doctor/specialties`),
          
          // Recommended doctors (you might want to customize this endpoint)
          axios.get(`${ip.address}/api/doctor/recommended`)
        ];

        
        // Execute all API calls concurrently
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
          setUImage(patient.patient_image || "");
        }
        
        // Process upcoming appointments
        if (upcomingAppsResponse.data) {
          setUpcomingAppointments(upcomingAppsResponse.data.appointments || []);
        }
        
        // Process past appointments
        if (pastAppsResponse.data) {
          setPastAppointments(pastAppsResponse.data.appointments || []);
        }
        
        // Process doctor specialties
        if (specialtiesResponse.data) {
          setDoctorSpecialties(specialtiesResponse.data.specialties || []);
        }
        
        // Process recommended doctors
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

  // Create a custom render scene map that passes down the fetched data
  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'home':
        return (
          <Homepage 
            patientName={uname}
            upcomingAppointments={upcomingAppointments}
            recommendedDoctors={recommendedDoctors}
          />
        );
      case 'upcoming':
        return (
          <Upcoming 
            upcomingAppointments={upcomingAppointments} 
            pastAppointments={pastAppointments}
            patientId={userId}
          />
        );
      case 'doctorspecialty':
        return (
          <DoctorSpecialty 
            specialties={doctorSpecialties}
            recommendedDoctors={recommendedDoctors}
            preSelectedSpecialty={route.params?.specialty} // Pass the specialty parameter
          />
        );
      case 'myprofilepage':
        return (
          <MyProfile 
            patientData={patientData}
            userId={userId}
          />
        );
      case 'notifications':
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <NotificationBadge count={unreadNotificationsCount} />
          </View>
        );
      default:
        return null;
    }
  };

  // Handle back button
  const handleBackPress = () => {
    if (index === 0) {
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
    } else {
      setIndex(0);
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

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header3 name={uname} imageUri={uImage} />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={(newIndex) => setIndex(newIndex)}
        initialLayout={initialLayout}
        renderTabBar={() => null}
      />
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <NavigationBar
          onTabChange={(tabName) => {
            const newIndex = routes.findIndex(route => route.title === tabName);
            if (newIndex !== -1) {
              setIndex(newIndex);
            }
          }}
          activeTab={routes[index].title}
        />
      </View>

      <FAB
        icon="message"
        size="medium"
        style={{
          position: 'absolute',
          right: 0,
          bottom: 80,
          margin: 16,
          backgroundColor: theme.colors.primary,
        }}
        onPress={() => navigation.navigate('ptnchat', {userId: userId})}
      />
    </SafeAreaView>
  );
};

export default PatientMain;