import React, { useState } from 'react';
import { View, Dimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import DoctorHome from '../DoctorHome/DoctorHome';
import MyPatients from '../MyPatients/MyPatients';
import DoctorAppointment from '../DoctorAppointment/DoctorAppointment';
import DoctorProfile from '../Doctor Profile/DoctorProfile';
import DoctorHeader from '../DoctorHeader/DoctorHeader';
import DoctorNavigation from '../DoctorNavigation/DoctorNavigation';

const initialLayout = { width: Dimensions.get('window').width };

const DoctorMain = () => {
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: 'home', title: 'Home' },
    { key: 'appointment', title: 'Appointment' },
    { key: 'patients', title: 'My Patients' },
    { key: 'profile', title: 'Profile' },
  ]);

  const renderScene = SceneMap({
    home: DoctorHome,
    patients: MyPatients,
    appointment: DoctorAppointment,
    profile: DoctorProfile,
  });

  return (
    <>
      <DoctorHeader />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={() => null} 
      />
      {/* Use DoctorNavigation for the tab navigation */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <DoctorNavigation
          activeTab={routes[index].title}
          onTabChange={(tabName) => {
            const newIndex = routes.findIndex(route => route.title === tabName);
            setIndex(newIndex);
          }}
        />
      </View>
    </>
  );
};

export default DoctorMain;
