import { StyleSheet, StatusBar, Platform, ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from 'expo-font';
import { CardStyleInterpolators, TransitionSpecs } from '@react-navigation/stack';
import { lightTheme as theme } from './utils/theme';

// Import components
import SigninPage from './components/For Patient Interface/Sign In page/SigninPage';
import MyProfile from './components/For Patient Interface/My Profile/MyProfile';
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
import ViewProfile from './components/For Patient Interface/My Profile/ProfileModals/ViewProfile';

// Doctor components
import DoctorAppointment from './components/For Doctor Interface/DoctorAppointment/DoctorAppointment';
import DoctorHome from './components/For Doctor Interface/DoctorHome/DoctorHome';
import DoctorMain from './components/For Doctor Interface/DoctorMain/DoctorMain';
import DoctorProfile from './components/For Doctor Interface/Doctor Profile/DoctorProfile';
import DoctorNotification from './components/For Doctor Interface/DoctorNotification/DoctorNotification';
import CreateAccountDoctor from './components/For Patient Interface/Create Account/CreateAccoutDoctor';
import Homepage from './components/For Patient Interface/Homepage/Homepage';
import PatientMain from './components/For Patient Interface/PatientMain/PatientMain';
import MedicalRecords from './components/For Patient Interface/My Profile/ProfileModals/MedicalRecords/MedicalRecords';
import ViewDoctorProfile from './components/For Doctor Interface/Doctor Profile/DoctorProfile Screens/ViewDoctorProfile';
import DrPostScreen from './components/For Doctor Interface/DoctorHome/DoctorHomeComponents/DrPostScreen';
import EditPostScreen from './components/For Doctor Interface/DoctorHome/DoctorHomeComponents/EditPostScreen';
import PatientChat from './components/For Patient Interface/PatientChat/PatientChat';
import EmailVerificationPage from './components/For Patient Interface/Sign In page/EmailVerificationPage';
import Notifications from './components/For Patient Interface/Notifications/Notifications';

// Providers and utilities
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserProvider, useUser } from './UserContext';
import { navigationRef } from './RootNavigation';
import React from 'react';

// AppContent component that uses the UserContext hook, rendered inside UserProvider
const AppContent = () => {
  const Stack = createNativeStackNavigator();
  const { loading, user, role } = useUser();
  
  // Show loading indicator when context is loading
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  
  // Determine initial route based on authentication status
  const getInitialRoute = () => {
    if (!user) return "landingpage";
    return role === "Patient" ? "ptnmain" : "doctormain";
  };
  
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName={getInitialRoute()} screenOptions={{ headerShown: false }}>
        <Stack.Screen name='landingpage' component={LandingPage} />
        <Stack.Screen name='SigninPage' component={SigninPage} />
        <Stack.Screen name='createaccount' component={CreateAccount}/>
        <Stack.Screen name='createDoctorAccount' component={CreateAccountDoctor}/>
        <Stack.Screen name='emailverification' component={EmailVerificationPage}/>

        {/* Patient */}
        <Stack.Screen name='home' component={Homepage}/>
        <Stack.Screen 
          name='myprofilepage' 
          component={MyProfile} 
          options={{
            gestureEnabled: true,
            cardStyleInterpolator: Platform.OS === 'android' 
              ? ({ current, layouts }) => {
                  return {
                    cardStyle: {
                      transform: [
                        {
                          translateX: current.progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [layouts.screen.width, 0],
                          }),
                        },
                      ],
                    },
                  };
                }
              : undefined,
            transitionSpec: Platform.OS === 'android' && {
              open: TransitionSpecs.TransitionIOSSpec,
              close: TransitionSpecs.TransitionIOSSpec,
            },
          }}
        />
        <Stack.Screen 
          name='viewprofile' 
          component={ViewProfile}
          options={{
            gestureEnabled: true,
            cardStyleInterpolator: Platform.OS === 'android' 
              ? ({ current, layouts }) => {
                  return {
                    cardStyle: {
                      transform: [
                        {
                          translateX: current.progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [layouts.screen.width, 0],
                          }),
                        },
                      ],
                    },
                  };
                }
              : undefined,
            transitionSpec: Platform.OS === 'android' && {
              open: TransitionSpecs.TransitionIOSSpec,
              close: TransitionSpecs.TransitionIOSSpec,
            },
          }}
        />
        <Stack.Screen name='searchappointment' component={SearchForAppointment} />
        <Stack.Screen name='bookappointment' component={BookAppointment} />
        <Stack.Screen name='profileform' component={ProfileForm} />
        <Stack.Screen name='upcoming' component={Upcoming}/>
        <Stack.Screen name='aboutdoctor' component={AboutDoctor} />
        <Stack.Screen name='apptdetails' component={AppointmentDetails} />
        <Stack.Screen name='ptnmain' component={PatientMain} />
        <Stack.Screen name='medicalrecords' component={MedicalRecords} />
        <Stack.Screen name='ptnchat' component={PatientChat} />
        <Stack.Screen name='ptnnotification' component={Notifications}/>

        {/* Doctor */}
        <Stack.Screen name='doctormain' component={DoctorMain}/>
        <Stack.Screen name="drpost" component={DrPostScreen} />
        <Stack.Screen name='dreditpost' component={EditPostScreen}/>
        <Stack.Screen name='doctorprofile' component={DoctorProfile}/>
        <Stack.Screen name='doctornotification' component={DoctorNotification}/>
        <Stack.Screen name='viewdrprofile' component={ViewDoctorProfile}/>
      </Stack.Navigator>   
    </NavigationContainer>
  );
};

// Main App component - handles fonts and sets up providers
export default function App() {
  const [fontsLoaded] = useFonts({
    'Poppins': require('./assets/fonts/Poppins.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Light': require('./assets/fonts/Poppins-Light.ttf'),
    'Poppins-Thin': require('./assets/fonts/Poppins-Thin.ttf'),
    'Poppins-ExtraLight': require('./assets/fonts/Poppins-ExtraLight.ttf'),
    'Poppins-ExtraBold': require('./assets/fonts/Poppins-ExtraBold.ttf'),
    'Poppins-Black': require('./assets/fonts/Poppins-Black.ttf'),
    'Poppins-Italic': require('./assets/fonts/Poppins-Italic.ttf'),
    'Poppins-LightItalic': require('./assets/fonts/Poppins-LightItalic.ttf'),
    'Poppins-MediumItalic': require('./assets/fonts/Poppins-MediumItalic.ttf'),
    'Poppins-BoldItalic': require('./assets/fonts/Poppins-BoldItalic.ttf'),
    'Poppins-ExtraBoldItalic': require('./assets/fonts/Poppins-ExtraBoldItalic.ttf'),
    'Poppins-BlackItalic': require('./assets/fonts/Poppins-BlackItalic.ttf'),
    'Poppins-ThinItalic': require('./assets/fonts/Poppins-ThinItalic.ttf'),
    'Poppins-ExtraLightItalic': require('./assets/fonts/Poppins-ExtraLightItalic.ttf'),
    'Poppins-SemiBoldItalic': require('./assets/fonts/Poppins-SemiBoldItalic.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      <StatusBar hidden={true}/>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <UserProvider>
            <AppContent />
          </UserProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});