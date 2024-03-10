import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableWithoutFeedback, TouchableOpacity, Image  } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const LandingPage =({navigation})=>{

    const signinPageButton =()=>{
      navigation.navigate('SigninPage')
    }

    const createAccountPageButton =()=>{
      navigation.navigate('createaccount')
    }
    return(
        <>
          
          <LinearGradient
           style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          colors={['#92A3FD', '#9DCEFF']}
          >

          <View style={styles.logoContainer}>
            <Image source={require('../../../assets/pictures/RxpressCare.png')} style={styles.logo}/>
          </View>
          <View style={styles.container}>
            {/* textpage */}
            <Text style={styles.text1}>By tapping ‘Sign in’ you agree to our {''}
              <TouchableWithoutFeedback >
                <Text style={styles.linkText}>Terms.</Text>
              </TouchableWithoutFeedback>
                 {' '}Learn how we process your data in our {''}
              <TouchableWithoutFeedback >
                <Text style={styles.linkText}>Privacy Policy</Text>
              </TouchableWithoutFeedback>{' '}
                and{' '}
              <TouchableWithoutFeedback>
                <Text style={styles.linkText}>Cookies Policy</Text>
              </TouchableWithoutFeedback>
                .
            </Text>
            {/* create account button */}
            <TouchableOpacity onPress={createAccountPageButton} style={styles.CreateButton}>
                    <Text  style={{color: "#92A3FD", fontSize: 16, fontFamily: 'Poppins', marginTop: 1}}>CREATE ACCOUNT</Text>
            </TouchableOpacity>
            {/* sign in button */}
            <TouchableOpacity onPress={signinPageButton} style={styles.SignInButton}>
                    <Text  style={{color: "white", fontSize: 16, fontFamily: 'Poppins', marginTop: 1}}>SIGN IN</Text>
            </TouchableOpacity>

            <TouchableWithoutFeedback>
                <Text style={styles.TroubleSigningIn}>Trouble signing in?</Text>
              </TouchableWithoutFeedback>
          </View>
               
        </LinearGradient>
           

            
        </>
    )
}
export default LandingPage;


const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 70,
    width: 270,
    textAlign: "center"
  },
  text1:{
    color: "white",
    textAlign: "center",
    fontSize: 12,
    fontFamily: 'Poppins',
  },
  linkText: {
    textDecorationLine: 'underline',
    color: 'white',
    fontFamily: 'Poppins-SemiBold'
  },
  CreateButton: {
    width: 300,
    height: 45,
    backgroundColor: "#FFFFFF",
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  SignInButton: {
    width: 300,
    height: 45,
    borderColor: "#FFFFFF",
    borderRadius: 40,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  TroubleSigningIn: {
    marginTop: 10,
    fontSize: 12,
    color: 'white',
    fontFamily: 'Poppins-SemiBold'
  },
  logo:{
    width: 600,
    height: 600,

  },

  logoContainer: {
    paddingTop: 110,
    width: '100%',

    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center', 
  

  },

 
  
});
