import React, { useState, useEffect, useCallback } from 'react';
import { View, Dimensions, BackHandler, Alert } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import Homepage from '../Homepage/Homepage';
import Upcoming from '../Upcoming/Upcoming';
import DoctorSpecialty from '../Doctor Specialty/DoctorSpecialty';
import MyProfile from '../My Profile/MyProfile';
import NavigationBar from '../Navigation/NavigationBar';
import Header3 from '../../Headers/Headers';
import { getData } from '../../storageUtility';
import axios from 'axios';
import { ip } from '../../../ContentExport';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';

const initialLayout = { width: Dimensions.get('window').width };

const PatientMain = () => {
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: 'home', title: 'Home' },
    { key: 'upcoming', title: 'Upcoming' },
    { key: 'doctorspecialty', title: 'Doctor Specialty' },
    { key: 'myprofilepage', title: 'My Profile' },
  ]);

  const renderScene = SceneMap({
    home: Homepage,
    upcoming: Upcoming,
    doctorspecialty: DoctorSpecialty,
    myprofilepage: MyProfile,
  });

  const [uname, setUname] = useState("");
  const [uImage, setUImage] = useState("");
  const [userId, setUserId] = useState("");
  const [patientData, setPatientData] = useState({});

  useFocusEffect(
    useCallback(() => {
      const fetchUserId = async () => {
        try {
          const id = await getData('userId');
          if (id) {
            setUserId(id);

            axios.get(`${ip.address}/api/patient/api/onepatient/${id}`)
              .then(res => {
                const patient = res.data?.thePatient;
                if (patient) {
                  setUname(patient.patient_firstName + " " + patient.patient_lastName);
                  setUImage(patient.patient_image);
                }
              })
              .catch(err => console.log(err));
          }
        } catch (err) {
          console.log(err);
        }
      };

      fetchUserId();

      const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      return () => {
        backHandler.remove();
      };
    }, [])
  );

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

  const theme = useTheme();

  return (
    <SafeAreaView  style = {{flex:1, backgroundColor: theme.colors.background}}>
      <Header3 name={uname} imageUri={uImage} />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={(newIndex) => setIndex(newIndex)}
        initialLayout={initialLayout}
        renderTabBar={() => null} // Hide default tab bar
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
    </SafeAreaView>
  );
};

export default PatientMain;
