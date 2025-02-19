import React, { useCallback, useState } from 'react';
import { View, Dimensions, BackHandler } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import DoctorHome from '../DoctorHome/DoctorHome';
import MyPatients from '../MyPatients/MyPatients';
import DoctorAppointment from '../DoctorAppointment/DoctorAppointment';
import DoctorProfile from '../Doctor Profile/DoctorProfile';
import DoctorHeader from '../DoctorHeader/DoctorHeader';
import DoctorNavigation from '../DoctorNavigation/DoctorNavigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Portal, useTheme } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { ip } from '../../../ContentExport';
import { getData } from '../../storageUtility';

const initialLayout = { width: Dimensions.get('window').width };

const DoctorMain = () => {
  const [index, setIndex] = useState(0);
  const [drName, setDrName] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [routes] = useState([
    { key: 'home', title: 'Home' },
    { key: 'appointment', title: 'Appointment' },
    { key: 'patients', title: 'My Patients' },
    { key: 'profile', title: 'Profile' },
  ]);

  const theme = useTheme();

  const renderScene = SceneMap({
    home: DoctorHome,
    patients: MyPatients,
    appointment: DoctorAppointment,
    profile: DoctorProfile,
  });

  const fetchUserId = async () => {
    try {
      const id = await getData('userId');
      if (id) {
        axios.get(`${ip.address}/api/doctor/one/${id}`)
          .then(res => {
            console.log(res.data)
            const doctor = res.data?.doctor;
            if (doctor) {
              console.log(doctor);
              setDoctorId(doctor._id);
              setDrName(`${doctor?.dr_firstName} ${doctor?.dr_lastName}`);
              setImageUri(doctor?.dr_image);
            }
          })
          .catch(err => console.error(err));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBackPress = () => {
    if (index === 0) {
      // If the user is on the first tab (Home), show an alert or exit the app
      Alert.alert(
        'Exit App',
        'Are you sure you want to exit the app?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'OK', onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: false }
      );
      return true; // Prevent the default back behavior
    } else {
      setIndex(0); // Go back to the Home tab instead of exiting
      return true;
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserId();
      const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      return () => {
        backHandler.remove();
      };
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Portal.Host>
      <DoctorHeader name = {drName} imageUri={imageUri}/>
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

      
      </Portal.Host>
    </SafeAreaView>
  );
};

export default DoctorMain;
