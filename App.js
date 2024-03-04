import { StyleSheet, StatusBar} from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {useFonts} from 'expo-font';

import SigninPage from './components/Sign In page/SigninPage';
import MyProfile from './components/My Profile/MyProfile';
import LandingPage from './components/Landing Page/LandingPage';
import DoctorSpecialty from './components/Doctor Specialty/DoctorSpecialty';
import SearchForAppointment from './components/Search For Appointment/SearchForAppointment';
import BookAppointment from './components/Book Appointment/BookAppointment';
import ProfileForm from './components/Profile Form/ProfileForm';


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
        <Stack.Navigator initialRouteName="searchappointment" >
          <Stack.Screen
            name = 'landingpage'
            component={LandingPage}
            options={{
              title: 'Welcome',
              headerShown: false
            }}
          />
          <Stack.Screen
            name = 'SigninPage'
            component={SigninPage}
            options={{
              title: 'Welcome',
              headerShown: false
            }}
          />
          <Stack.Screen
            name = 'myprofilepage'
            component={MyProfile}
            options={{
              title: 'Welcome',
              headerShown: false
            }}
          />
          <Stack.Screen
            name = 'doctorspecialty'
            component={DoctorSpecialty}
            options={{
              title: 'Welcome',
              headerShown: false
            }}
          />
          <Stack.Screen
            name = 'searchappointment'
            component={SearchForAppointment}
            options={{
              title: 'Welcome',
              headerShown: false
            }}
          />
          <Stack.Screen
            name = 'bookappointment'
            component={BookAppointment}
            options={{
              title: 'Welcome',
              headerShown: false
            }}
          />
          <Stack.Screen
            name = 'profileform'
            component={ProfileForm}
            options={{
              title: 'Welcome',
              headerShown: false
            }}
          />
       
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
