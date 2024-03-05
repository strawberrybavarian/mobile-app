import { StyleSheet, StatusBar} from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {useFonts} from 'expo-font';
import { MaterialCommunityIcons } from 'react-native-vector-icons'; 
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import Home from './components/Doctors/Home';
import Appointment from './components/Doctors/Appointment';
import Profile from './components/Doctors/Profile';
import SigninPage from './components/Sign In page/SigninPage';
import MyProfile from './components/My Profile/MyProfile';
import LandingPage from './components/Landing Page/LandingPage';
import DoctorSpecialty from './components/Doctor Specialty/DoctorSpecialty';
import SearchForAppointment from './components/Search For Appointment/SearchForAppointment';
import BookAppointment from './components/Book Appointment/BookAppointment';
import ProfileForm from './components/Profile Form/ProfileForm';
import CreateAccount from './components/Create Account/CreateAccount';
import HealthRiskAssessmentForm from './components/Health Assessment Form/HealthRiskAssessmentForm';
import Upcoming from './components/Doctors/Upcoming';


export default function App() {
  

  const Stack = createNativeStackNavigator();
  const [fontsLoaded] = useFonts ({
    'Poppins' : require('./assets/fonts/Poppins.ttf'),
    'Poppins-SemiBold' : require('./assets/fonts/Poppins-SemiBold.ttf')
  })
  if (!fontsLoaded){
    return undefined
  }
  return (
    <>
      <StatusBar hidden={true}/>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="upcoming" screenOptions={{ headerShown: false }}>
          <Stack.Screen name='landingpage' component={LandingPage} />
          <Stack.Screen name='SigninPage' component={SigninPage} />
          <Stack.Screen name='myprofilepage' component={MyProfile} />
          <Stack.Screen name='doctorspecialty' component={DoctorSpecialty} />
          <Stack.Screen name='searchappointment' component={SearchForAppointment} />
          <Stack.Screen name='healthassess' component={HealthRiskAssessmentForm} />
          <Stack.Screen name='bookappointment' component={BookAppointment} />
          <Stack.Screen name='profileform' component={ProfileForm} />
          <Stack.Screen name='createaccount' component={CreateAccount}/>
          <Stack.Screen name='upcoming' component={Upcoming}/>
        </Stack.Navigator>   
      </NavigationContainer>  

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
  

 
  
});
