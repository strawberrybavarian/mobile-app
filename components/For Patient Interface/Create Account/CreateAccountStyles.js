import { StyleSheet } from 'react-native';
import sd from '../../../utils/styleDictionary';
import { Dimensions } from 'react-native';

const CreateAccountStyles = (theme) => StyleSheet.create({
    container: {
      flex: 10,
      //padding: 20,
      //paddingBottom: 80, // Space above the buttonContainer to ensure scrolling space
      backgroundColor: theme.colors.background,
    },
    progressContainer: {
      //height: 10,  // Set a visible height
      width: '100%', 
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 20,
      paddingHorizontal: 20,
    },
    progressBar: {
      flex: 1,  // Take up all available space
      // width: '100%',  // Set a visible width
      //borderRadius: 5,  // Optional: To make it rounded
      borderWidth: 0,
      backgroundColor: 'lightgray',  // Optional: Add a background color to make it more visible
    },
    activeStep: {
      backgroundColor: theme.colors.background,
    },
    formContainer: {
      //marginBottom: 20,
      flex: 11,
      paddingHorizontal: 20,
    },
    inputContainer: {
      marginBottom: 10,
    },
    inputLabel:{
      marginBottom: 5,
      marginLeft: 10,
      fontSize: sd.fontSizes.small,
      fontFamily: sd.fonts.medium,
      color: theme.colors.primary,
    },
    textInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
      fontSize: 16,
    },
    calendarContainer:{
      backgroundColor: theme.colors.background,
      padding: 20,
      marginHorizontal: 20,
      borderRadius: 15,
    },
    dateInput: {
      borderBottomWidth: 1,
      padding: 10,
      marginBottom: 15,
    },
    dateText: {
      fontSize: 16,
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      marginVertical: 5,
      //padding: 10,
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      padding: 10,
      marginBottom: 15,
    },
    passwordInput: {
      flex: 1,
    },
    buttonContainer: {   
      justifyContent: 'space-evenly',
      flex: 0.1,
      flexDirection: 'row',
      margin: 10,
      backgroundColor: theme.colors.background,
    },
    backButton: {
      backgroundColor: sd.colors.white,
      padding: 10,
      borderRadius: 5,
      flex: 1,
      marginVertical: 15,
      //marginLeft: 10,
      borderColor: sd.colors.blue,
      borderWidth: 1,
      alignItems: 'center',
    },
    nextButton: {
      backgroundColor: sd.colors.blue,
      padding: 10,
      borderRadius: 5,
      flex: 1,
      marginVertical: 15,
      alignItems: 'center',
      marginLeft: 10,
    },
    submitButton: {
      backgroundColor: '#34A853',
      padding: 10,
      borderRadius: 5,
      width: '100%',
      flex: 1
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    stepText: {
      marginVertical: 20,
    },
    datePickerContainer: {
        //flexDirection: 'row',
        //justifyContent: 'space-between',
        marginBottom: 10,
      },
    dropdown: {
      height: Dimensions.get('window').height*0.5, 
      padding: 10, 
      borderRadius: 10
    },
    dropdownText: {
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        marginBottom: 15,
        fontFamily: 'Poppins-LightItalic',
        fontSize: sd.fontSizes.small,
    },
  });

  export default CreateAccountStyles;