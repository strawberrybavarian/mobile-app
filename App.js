import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,  } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LandingPage from './components/Landing Page/LandingPage';
import { LinearGradient } from 'expo-linear-gradient';
import SigninPage from './components/Sign In page/SigninPage';
import MyProfile from './components/My Profile/MyProfile';
import {useFonts} from 'expo-font';
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

      <NavigationContainer>
        <Stack.Navigator initialRouteName="myprofilepage" >
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
