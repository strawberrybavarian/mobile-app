import { StyleSheet } from "react-native";
import sd from "../../../utils/styleDictionary";

export const AboutDoctorStyle = (theme) => StyleSheet.create({
    scrollContainer: {
      flexGrow: 1,
    },
    mainContainer: {
      paddingHorizontal: 30,
      paddingTop: 20,
      flexDirection: 'column',
  
    },
    containerCard: {
      backgroundColor: 'white',
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    },
    doctorContainer: {
      alignItems: 'center',
      height: 200,
      padding: 10,
    },
    doctorImage: {
      width: 130,
      height: 130,
      borderRadius: 100,
    },
    profileDoctorContainer: {
      paddingHorizontal: 40,
      marginTop: 15,
    },
    buttonContainer: {
      
  
      position: 'absolute',
    
      bottom: 105,
      left: 0,
      right:0,
      
      alignItems: 'center',
    },
  
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop:5,
      paddingHorizontal: 20,
      marginTop: 50,
  
    },
    bookButton: {
      backgroundColor: 'rgba(28, 56, 184, 1)',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      width: '80%',
      height: 45,
    },
    buttonText: {
      color: 'white',
      fontFamily: 'Poppins-SemiBold',
    },
  });