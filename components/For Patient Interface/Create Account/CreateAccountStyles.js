import { StyleSheet } from 'react-native';
import sd from '../../../utils/styleDictionary';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      paddingBottom: 80, // Space above the buttonContainer to ensure scrolling space
      backgroundColor: '#fff',
    },
    progressContainer: {
      //height: 10,  // Set a visible height
      width: '100%', 
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    progressBar: {
      flex: 1,  // Take up all available space
      // width: '100%',  // Set a visible width
      //borderRadius: 5,  // Optional: To make it rounded
      borderWidth: 0,
      backgroundColor: 'lightgray',  // Optional: Add a background color to make it more visible
    },
    activeStep: {
      backgroundColor: '#9DCEFF',
    },
    formContainer: {
      marginBottom: 20,
    },
    textInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
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
      marginVertical: 15,
      padding: 10,
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
      position: 'absolute',
      bottom: 20, // Positioned at the bottom
      left: 20, 
      right: 20, 
      flexDirection: 'row',
      justifyContent: 'space-between',
      margin: 20,
    },
    backButton: {
      backgroundColor: '#ccc',
      padding: 10,
      borderRadius: 5,
      flex: 1,
      marginRight: 10,
    },
    nextButton: {
      backgroundColor: '#9DCEFF',
      padding: 10,
      borderRadius: 5,
      flex: 1,
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
      },
    dropdown: {
        width: '30%', // Adjusts the width of each dropdown
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
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

  export default styles;