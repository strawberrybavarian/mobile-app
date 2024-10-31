import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import sd from "../../../utils/styleDictionary";

const LandingPageStyles = (theme) => StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
    },
    logoContainer: {
      paddingTop: 110,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    logo: {
      height: 150,
      width: 150,
      borderRadius: 100,
    },
    textContainer: {
      flex: 2,
      alignItems: 'center',
      marginBottom: 70,
      width: 270,
      textAlign: 'center',
    },
    title: {
      color: theme.colors.onPrimary,
      fontSize: 45,
      fontFamily: sd.fonts.bold,
      marginVertical: 20,
      textAlign: 'center',
    },
    bottomContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      alignContent: 'center',
    },
    termsText: {
      color: theme.colors.onPrimary,
      textAlign: 'center',
      fontSize: 12,
      fontFamily: 'Poppins',
    },
    linkText: {
      textDecorationLine: 'underline',
      color: 'white',
      fontFamily: 'Poppins-SemiBold',
    },
    createButton: {
      width: 300,
      height: 45,
      borderColor: theme.colors.onPrimary,
      borderRadius: 40,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 12,
    },
    createButtonText: {
      color: theme.colors.onPrimary,
      fontSize: 16,
      fontFamily: 'Poppins',
      marginTop: 1,
    },
    signInButton: {
      width: 300,
      height: 45,
      backgroundColor: theme.colors.onPrimary,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
    },
    signInButtonText: {
      color: theme.colors.primary,
      fontSize: 16,
      fontFamily: 'Poppins-Bold',
      marginTop: 1,
    },
    troubleSigningInText: {
      marginTop: 10,
      fontSize: 12,
      color: 'white',
      fontFamily: 'Poppins-SemiBold',
      textAlign: 'center',
    },
  });
  
  export default LandingPageStyles;