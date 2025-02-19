import { Dimensions, StyleSheet } from "react-native";
import sd from "../../../utils/styleDictionary";

export const MyPatientStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,

    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding : 10, 
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: 0,
    },
    bodyContainer: {
        padding: 20,
    },
    patientCard: {
        flex: 1,
    },
    patientInfo: {
        padding: 20,
        //margin: 10,
        borderRadius: 10,
        backgroundColor: theme.colors.surface,
        // ...sd.shadows.level1,
    },
    patientName: {
        fontSize: sd.fontSizes.medium,
        fontFamily: sd.fonts.regular,
        color: theme.colors.onSurface,
    },
    patientDetails: {
        fontSize: 16,
        color: sd.colors.black,
    },
    title: {
        fontSize: sd.fontSizes.large,
        fontFamily: sd.fonts.medium,
        margin: 10,
    },
    subtitle: {
        fontSize: sd.fontSizes.base,
        fontFamily: sd.fonts.regular,
        margin: 10,
    },
    medicalRecordContainer: {
        padding: 20,
        margin: 10,
        borderRadius: 10,
        backgroundColor: sd.colors.white,
        shadowColor: sd.colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    dropdown: {
        height: Dimensions.get('window').height*0.05, 
        padding: 10, 
        borderRadius: 10
      },
    dropdownText: {
          fontSize: 16,
      },
    pickerContainer: {
        ...sd.shadows.level2,
        borderRadius: 10,
        marginVertical: 15,
        backgroundColor: sd.colors.white,
        //padding: 10,
        },




    // medicalRecord: {
    //     flex: 1,
    //     backgroundColor: sd.colors.white,
    // },
    
    // medicalRecordTitle: {
    //     fontSize: 20,
    //     fontWeight: 'bold',
    //     color: sd.colors.black,
    // },
    // medicalRecordDetails: {
    //     fontSize: 16,
    //     color: sd.colors.black,
    // },
    // medicalRecordButton: {
    //     margin: 10,
    // },
    // medicalRecordButtonText: {
    //     fontSize: 16,
    //     color: sd.colors.white,
    // },
    // medicalRecordButtonContainer: {
    //     alignItems: 'center',
    // },
    // medicalRecordButtonContent: {
    //     width: 200,
    //     backgroundColor: sd.colors.blue,
    // },
    // medicalRecordButtonContentDisabled: {
    //     width: 200,
    //     backgroundColor: sd.colors.gray,
    // },
    // medicalRecordButtonContentText: {
    //     color: sd.colors.white
    // },
})