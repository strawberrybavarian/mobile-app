import { StyleSheet } from "react-native";
import sd from "../../../utils/styleDictionary";

export const MyPatientStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: sd.colors.white,
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: sd.colors.white,
    },
    bodyContainer: {
        padding: 20,
    },
    patientCard: {
        padding: 20,
        //margin: 10,
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





    // medicalRecord: {
    //     flex: 1,
    //     backgroundColor: sd.colors.white,
    // },
    // medicalRecordContainer: {
    //     padding: 20,
    //     margin: 10,
    //     borderRadius: 10,
    //     backgroundColor: sd.colors.white,
    //     shadowColor: sd.colors.black,
    //     shadowOffset: {
    //         width: 0,
    //         height: 2,
    //     },
    //     shadowOpacity: 0.25,
    //     shadowRadius: 3.84,
    //     elevation: 5,
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