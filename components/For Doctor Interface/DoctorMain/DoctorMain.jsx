import React, { useCallback, useEffect, useState } from 'react';
import { View, Dimensions, BackHandler, Alert } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import DoctorHome from '../DoctorHome/DoctorHome';
import MyPatients from '../MyPatients/MyPatients';
import DoctorAppointment from '../DoctorAppointment/DoctorAppointment';
import DoctorProfile from '../Doctor Profile/DoctorProfile';
import DoctorHeader from '../DoctorHeader/DoctorHeader';
import DoctorNavigation from '../DoctorNavigation/DoctorNavigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Portal, useTheme, Snackbar } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { ip } from '../../../ContentExport';
import { getData } from '../../storageUtility';
import { useUser } from '@/UserContext';

const initialLayout = { width: Dimensions.get('window').width };

const DoctorMain = () => {
  const [index, setIndex] = useState(0);
  const [drName, setDrName] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [routes] = useState([
    { key: 'home', title: 'Home' },
    { key: 'appointment', title: 'Appointment' },
    // { key: 'patients', title: 'My Patients' },
    { key: 'profile', title: 'Profile' },
  ]);

  const { user } = useUser();

  const theme = useTheme();

  const renderScene = SceneMap({
    home: DoctorHome,
    // patients: MyPatients,
    appointment: DoctorAppointment,
    profile: DoctorProfile,
  });


  const fetchUserId = async () => {
    if (user?._id) {
      axios.get(`${ip.address}/api/doctor/one/${user._id}`)
        .then(res => {
          const doctor = res.data?.doctor;
          if (doctor) {
            setDoctorId(doctor._id);
            setDrName(`${doctor?.dr_firstName} ${doctor?.dr_lastName}`);
            setImageUri(doctor?.dr_image);
          }
        })
        .catch(err => console.error(err));
    }
  };

  useEffect(() => {
    // Initial data load
    if (user?._id) {
      fetchUserId();
    }
  }, [user]);
  
  useFocusEffect(
    useCallback(() => {
      fetchUserId();
      const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      return () => {
        backHandler.remove();
      };
    }, [])
  );
  
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Portal.Host>
        <DoctorHeader 
          name={drName} 
          imageUri={imageUri}
          lastRefreshTimestamp={lastRefreshTimestamp}
        />
        
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          renderTabBar={() => null} 
        />
        
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
          <DoctorNavigation
            activeTab={routes[index].title}
            onTabChange={(tabName) => {
              const newIndex = routes.findIndex(route => route.title === tabName);
              setIndex(newIndex);
            }}
          /> 
        </View>
        
        {/* Snackbar for refresh notifications */}
        <Snackbar
          visible={showRefreshMessage}
          onDismiss={() => setShowRefreshMessage(false)}
          duration={2000}
          style={{ backgroundColor: theme.colors.surface }}
        >
          {refreshMessage}
        </Snackbar>
      </Portal.Host>
    </SafeAreaView>
  );
};

export default DoctorMain;
