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
      justifyContent: 'space-between', // Changed from 'space-evenly' to 'space-between'
      flexDirection: 'row',
      margin: 15, // Increased from 10
      paddingHorizontal: 5, // Added horizontal padding
      backgroundColor: theme.colors.background,
      gap: 10, // Add gap between buttons
    },
    backButton: {
      backgroundColor: sd.colors.white,
      paddingVertical: 10, // Increased from 10
      paddingHorizontal: 16, // Added horizontal padding explicitly
      borderRadius: 8, // Increased from 5
      flex: 1,
      marginVertical: 15,
      borderColor: sd.colors.blue,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center', // Added to center text vertically
      minHeight: 48, // Added minimum height for consistent button size
    },
    nextButton: {
      backgroundColor: sd.colors.blue,
      paddingVertical: 12, // Increased from 10
      paddingHorizontal: 16, // Added horizontal padding
      borderRadius: 8, // Increased from 5
      flex: 1, 
      marginVertical: 15,
      alignItems: 'center',
      justifyContent: 'center', // Added to center text vertically
      minHeight: 48, // Added minimum height
    },
    submitButton: {
      backgroundColor: sd.colors.blue,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      flex: 1,
      marginVertical: 15,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 48,
    },
    buttonText: {
      color: 'white',
      fontFamily: sd.fonts.medium,
      fontSize: 16, // Increased from default
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