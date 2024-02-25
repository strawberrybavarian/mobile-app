import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableWithoutFeedback, TouchableOpacity  } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SigninPage =({navigation})=>{
    return(
        <>
        
       
          <View style={styles.container}>
           <Text>asdaddsdsdsdsdsdsd</Text>
         
          </View>
               
      
           

            
        </>
    )
}
export default SigninPage;


const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  text1:{
    color: "white",
    textAlign: "center",
    fontSize: 10
  },
  linkText: {
    textDecorationLine: 'underline',
    color: 'white',
  },
  CreateButton:{
    width: 250,
    height: 35,
    backgroundColor: "#FFFFFF",
    borderRadius: 40,
    textAlign: "center",
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 20, 
  },
  SignInButton:{
    width: 250,
    height: 35,
		borderColor: "#FFFFFF",
		borderRadius: 40,
		borderWidth: 1,
    textAlign: "center",
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 12,
  },
  TroubleSigningIn: {
    marginTop: 10,
    fontSize: 9,
    color: 'white',
  },
  

 
  
});
