import React, { useState, useEffect, useCallback } from 'react';
import { View, Dimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import Homepage from '../Homepage/Homepage';
import Upcoming from '../Upcoming/Upcoming';
import DoctorSpecialty from '../Doctor Specialty/DoctorSpecialty';
import MyProfile from '../My Profile/MyProfile';
import NavigationBar from '../Navigation/NavigationBar';
import Header3, { Header1 } from '../../Headers/Headers';
import { getData } from '../../storageUtility';
import axios from 'axios';
import { ip } from '../../../ContentExport';
import { useFocusEffect } from '@react-navigation/native';

const initialLayout = { width: Dimensions.get('window').width };

const PatientMain = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    console.log("Initial Index (should be 0):", index);
  }, []);

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
  const [userId, setUserId] = useState("");
  const [patientData, setPatientData] = useState({});

  

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getData('userId');
        console.log("PatientMain userId:", id);
        if (id) {
          setUserId(id);
          console.log(`Request URL: ${ip.address}/patient/api/onepatient/${id}`);

          axios.get(`${ip.address}/api/patient/api/onepatient/${id}`)
            .then(res => {
              console.log("API response: ", res.data);
              const patient = res.data?.thePatient;
              if (patient) {
                setUname(patient.patient_firstName + " " + patient.patient_lastName);
              } else {
                console.log('Patient not found');
              }
            })
            .catch(err => console.log(err));
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserId();
  }, []);
  

  return (
    <>
      <Header3 name = {uname} />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={(newIndex) => {
          console.log("TabView onIndexChange:", newIndex);
          setIndex(newIndex);
        }}
        initialLayout={initialLayout}
        renderTabBar={() => null} // Hide default tab bar
      />
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <NavigationBar
          onTabChange={(tabName) => {
            console.log("onTabChange called with:", tabName); // Check if this logs when pressed
            const newIndex = routes.findIndex(route => route.title === tabName);
            if (newIndex !== -1) {
              setIndex(newIndex);
            }
          }}
          activeTab={routes[index].title}
        />
      </View>
    </>
  );
};

export default PatientMain;
