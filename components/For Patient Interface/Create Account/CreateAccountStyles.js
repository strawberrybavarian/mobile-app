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
    modalContainer: {
      backgroundColor: 'white',
      margin: 20,
      padding: 20,
      borderRadius: 10,
      maxHeight: '80%',
      display: 'flex',
      flexDirection: 'column',
    },
    scrollContainer: {
      flex: 1, // Use flex: 1 instead of maxHeight to fill available space
      marginBottom: 15, // Add margin to separate from buttons
    },
    modalContent: {
      flex: 1,
      justifyContent: 'space-between',
    },
    modalTitle: {
      fontSize: 20,
      fontFamily: sd.fonts.bold || 'bold',
      textAlign: 'center',
      marginVertical: 15,
      color: '#000',
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: sd.fonts.semibold || 'bold',
      marginTop: 15,
      marginBottom: 5,
      color: '#000',
    },
    paragraph: {
      fontSize: 14,
      fontFamily: sd.fonts.regular || 'normal',
      marginBottom: 10,
      lineHeight: 20,
      color: '#333',
    },
    listTitle: {
      fontSize: 16,
      fontFamily: sd.fonts.medium || 'medium',
      marginTop: 10,
      marginBottom: 5,
      color: '#000',
    },
    listItem: {
      fontSize: 14,
      fontFamily: sd.fonts.regular || 'normal',
      marginLeft: 10,
      marginBottom: 5,
      lineHeight: 20,
      color: '#333',
    },
    modalButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 15,
    },
    modalButton: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      minWidth: 120,
      alignItems: 'center',
      backgroundColor: '#e0e0e0',
    },
    modalButtonText: {
      fontSize: 16,
      fontFamily: sd.fonts.medium || 'medium',
      color: '#000',
      textAlign: 'center',
    },
    bottomSheetModal: {
      margin: 0,
      justifyContent: 'flex-end',
    },
    bottomSheetContainer: {
      backgroundColor: 'white',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 15,
      height: '70%', // Fixed height instead of min/max
      display: 'flex',
      flexDirection: 'column',
    },
    bottomSheetHandle: {
      width: 40,
      height: 5,
      backgroundColor: '#DDDDDD',
      borderRadius: 3,
      alignSelf: 'center',
      marginBottom: 10,
    },
  });

  export default CreateAccountStyles;