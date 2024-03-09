// UpperNavigation.js

import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import DoctorUpcoming from './DoctorUpcoming';
import DoctorAcceptedPatient from './DoctorAcceptedPatient';

const Tab = createMaterialTopTabNavigator();

const UpperNavigation = ({ setActiveTab }) => {
  return (
    <NavigationContainer independent={true} >
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: '#296dd4',
          inactiveTintColor: 'gray',
          labelStyle: {
            fontSize: 14,
            fontFamily: 'Poppins',
            textAlign: 'left',
          },
          indicatorStyle: {
            backgroundColor: '#5a8fdf',
          
          },
          tabStyle: { width: 'auto' },
          style: {
            backgroundColor: 'white',
          },
        }}
      >
        <Tab.Screen
          name="Upcoming"
          component={DoctorUpcoming}
          listeners={({ route }) => ({
            tabPress: (e) => {
              setActiveTab(route.name);
            },
          })}
        />
        <Tab.Screen
          name="Accepted Patients"
          component={DoctorAcceptedPatient}
          listeners={({ route }) => ({
            tabPress: (e) => {
              setActiveTab(route.name);
            },
          })}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default UpperNavigation;
