import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableWithoutFeedback, TouchableOpacity, Image } from 'react-native';
import { useTheme } from 'react-native-paper';
import LandingPageStyles from './LandingPageStyles';

const LandingPage = ({ navigation }) => {

  const theme = useTheme();
  const styles = LandingPageStyles(theme);

  const navigateToSignIn = () => {
    navigation.navigate('SigninPage');
  };

  const navigateToCreateAccount = () => {
    navigation.navigate('createaccount');
  };

  // Uncomment if you need doctor sign-up in the future
  // const navigateToCreateDoctorAccount = () => {
  //   navigation.navigate('createDoctorAccount');
  // };

  return (
    <>
      <View style={styles.mainContainer}>
        <View style={styles.logoContainer}>
          <Image source={require('../../../assets/pictures/molinologo.jpg')} style={styles.logo} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Molino Care App</Text>

          <View style={styles.bottomContainer}>
            <Text style={styles.termsText}>
            Your Health is Our Priority 
            </Text>
  
            <TouchableOpacity onPress={navigateToSignIn} style={styles.signInButton}>
              <Text style={styles.signInButtonText}>LOG IN</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={navigateToCreateAccount} style={styles.createButton}>
              <Text style={styles.createButtonText}>SIGN UP</Text>
            </TouchableOpacity>  

            <TouchableWithoutFeedback>
              <Text style={styles.troubleSigningInText}>Trouble signing in?</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    </>
  );
};

export default LandingPage;
