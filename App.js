import { StyleSheet, StatusBar} from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {useFonts} from 'expo-font';
import { MaterialCommunityIcons } from 'react-native-vector-icons'; 
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { CardStyleInterpolators } from '@react-navigation/stack';

import SigninPage from './components/For Patient Interface/Sign In page/SigninPage'
import MyProfile from './components/For Patient Interface/My Profile/MyProfile'
import LandingPage from './components/For Patient Interface/Landing Page/LandingPage';
import DoctorSpecialty from './components/For Patient Interface/Doctor Specialty/DoctorSpecialty';
import SearchForAppointment from './components/For Patient Interface/Search For Appointment/SearchForAppointment';
import BookAppointment from './components/For Patient Interface/Book Appointment/BookAppointment';
import ProfileForm from './components/For Patient Interface/Profile Form/ProfileForm';
import CreateAccount from './components/For Patient Interface/Create Account/CreateAccount';
import HealthRiskAssessmentForm from './components/For Patient Interface/Health Assessment Form/HealthRiskAssessmentForm';
import Upcoming from './components/For Patient Interface/Upcoming/Upcoming';
import AboutDoctor from './components/For Patient Interface/AboutDoctorProfile/AboutDoctor';
import AppointmentDetails from './components/For Patient Interface/AppointmentDetails/AppointmentDetails';


//Doctors

import DoctorAppointment from './components/For Doctor Interface/DoctorAppointment/DoctorAppointment'
import DoctorHome from './components/For Doctor Interface/DoctorHome/DoctorHome';
import DoctorMain from './components/For Doctor Interface/DoctorMain/DoctorMain';
import DoctorProfile from './components/For Doctor Interface/Doctor Profile/DoctorProfile';
import DoctorNotification from './components/For Doctor Interface/DoctorNotification/DoctorNotification';
import CreateAccountDoctor from './components/For Patient Interface/Create Account/CreateAccoutDoctor';
import Homepage from './components/For Patient Interface/Homepage/Homepage';
import PatientMain from './components/For Patient Interface/PatientMain/PatientMain';
import ViewProfile from './components/For Patient Interface/My Profile/ProfileModals/ViewProfile';

export default function App() {
  

  const Stack = createNativeStackNavigator();
  const [fontsLoaded] = useFonts ({
    'Poppins' : require('./assets/fonts/Poppins.ttf'),
    'Poppins-SemiBold' : require('./assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold' : require('./assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Medium' : require('./assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Light' : require('./assets/fonts/Poppins-Light.ttf'),
    'Poppins-Thin' : require('./assets/fonts/Poppins-Thin.ttf'),
    'Poppins-ExtraLight' : require('./assets/fonts/Poppins-ExtraLight.ttf'),
    'Poppins-ExtraBold' : require('./assets/fonts/Poppins-ExtraBold.ttf'),
    'Poppins-Black' : require('./assets/fonts/Poppins-Black.ttf'),
    'Poppins-Italic' : require('./assets/fonts/Poppins-Italic.ttf'),
    'Poppins-LightItalic' : require('./assets/fonts/Poppins-LightItalic.ttf'),
    'Poppins-MediumItalic' : require('./assets/fonts/Poppins-MediumItalic.ttf'),
    'Poppins-BoldItalic' : require('./assets/fonts/Poppins-BoldItalic.ttf'),
    'Poppins-ExtraBoldItalic' : require('./assets/fonts/Poppins-ExtraBoldItalic.ttf'),
    'Poppins-BlackItalic' : require('./assets/fonts/Poppins-BlackItalic.ttf'),
    'Poppins-ThinItalic' : require('./assets/fonts/Poppins-ThinItalic.ttf'),
    'Poppins-ExtraLightItalic' : require('./assets/fonts/Poppins-ExtraLightItalic.ttf'),
    'Poppins-SemiBoldItalic' : require('./assets/fonts/Poppins-SemiBoldItalic.ttf'),

  })
  if (!fontsLoaded){
    return undefined
  }
  return (
    <>
    
      <StatusBar hidden={true}/>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="landingpage" screenOptions={{ headerShown: false }}>
          <Stack.Screen name='landingpage' component={LandingPage} />
          <Stack.Screen name='SigninPage' component={SigninPage} />
          <Stack.Screen name='createaccount' component={CreateAccount}/>
          <Stack.Screen name='createDoctorAccount' component={CreateAccountDoctor}/>

          {/* Patient */}
          <Stack.Screen name='home' component={Homepage}/>
          <Stack.Screen name='myprofilepage' component={MyProfile} />
          <Stack.Screen 
            name='viewprofile' 
            component={ViewProfile}
            options={{
              gestureEnabled: true, // Enable gesture-based navigation if needed
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // Push animation
            }}
          />
          <Stack.Screen name='doctorspecialty' component={DoctorSpecialty} />
          <Stack.Screen name='searchappointment' component={SearchForAppointment} />
          <Stack.Screen name='healthassess' component={HealthRiskAssessmentForm} />
          <Stack.Screen name='bookappointment' component={BookAppointment} />
          <Stack.Screen name='profileform' component={ProfileForm} />
          <Stack.Screen name='upcoming' component={Upcoming}/>
          <Stack.Screen name='aboutdoctor' component={AboutDoctor} />
          <Stack.Screen name='apptdetails' component={AppointmentDetails} />
          <Stack.Screen name='ptnmain' component={PatientMain} />


          {/* Doctors */}
          
          
          <Stack.Screen name='doctormain' component={DoctorMain}/>
          <Stack.Screen name='doctorprofile' component={DoctorProfile}/>
          <Stack.Screen name='doctornotification' component={DoctorNotification}/>
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
