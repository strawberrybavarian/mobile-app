// DoctorMain.jsx
import React, { useState } from 'react';
import { StyleSheet, View, ScrollView} from 'react-native';
import DoctorNavigation from '../DoctorNavigation/DoctorNavigation';
import DoctorAppointment from '../DoctorAppointment/DoctorAppointment';
import DoctorHome from '../DoctorHome/DoctorHome';
import DoctorHeader from '../DoctorHeader/DoctorHeader';
import DoctorProfile from '../Doctor Profile/DoctorProfile';

const DoctorMain = ({ }) => {
  const [activeTab, setActiveTab] = useState('Home');

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  return (
  <>
    
    <ScrollView style={styles.container}>
      <DoctorHeader/>
      {activeTab === 'Home' && <DoctorHome />}
      {activeTab === 'Appointment' && <DoctorAppointment />}
      {activeTab === 'Profile' && <DoctorProfile />}
    </ScrollView>
      
 
      <View style={styles.navigationContainer}>
        <DoctorNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </View>
  </>
  
   


         
  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  navigationContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default DoctorMain;
