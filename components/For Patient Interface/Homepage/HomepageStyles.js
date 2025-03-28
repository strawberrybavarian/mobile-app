import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import sd from "../../../utils/styleDictionary";

const styles = StyleSheet.create({
    mainContaineer: {
        flex: 1, // Ensures it takes the full available screen space
        backgroundColor: '#f8f8f8',
    },
    scrollContainer: {
        flexGrow: 1, // Ensures the ScrollView expands with content
        backgroundColor: '#f8f8f8',
        paddingBottom: Dimensions.get('window').height / 7, 
    },
    headercont: {
        marginTop: 0,
        flexDirection: "row",
        paddingHorizontal: 40,
        paddingVertical: 10,
        alignItems: "center",
        ...sd.shadows.large,
    },
    headerTextCont: {
        flex: 1,
        flexDirection: "column",
        padding: 5,
        marginLeft: 5,
    },
    textCont: {
        flexDirection: "row",
        width: 200,
    },
    navcontainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    carouselContainer: {
        height: Dimensions.get('window').height / 4, // Keep a fixed height for carousel
        backgroundColor: '#f8f8f8',
        margin: 30,
        borderRadius: sd.borders.radiusXL,
    },
    // Add this to your existing styles
serviceImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginBottom: 8,
    alignSelf: 'center'
},
    optionsContainer: {
        padding: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
    },
    optionsRow: {
        flexDirection: "row",
        width: '100%',
        justifyContent: 'space-evenly',
    },
    optionBox: {
        width: Dimensions.get('window').width / 3, 
        height: Dimensions.get('window').width / 3,
        marginLeft: 5,
        marginRight: 5,
        padding: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: sd.borders.radiusLarge,
        ...sd.shadows.large,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editButton: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    title: {
        fontSize: sd.fontSizes.large,
        fontFamily: sd.fonts.semiBold,
        marginVertical: 20,
        textAlign: "center",
    },
    optionImage: {
        fontSize: sd.fontSizes.xxl,
        marginBottom: 10,
        color: sd.colors.blue,
    },
});

export default styles;
