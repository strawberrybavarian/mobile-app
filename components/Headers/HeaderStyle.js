import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';


const styles = StyleSheet.create({
    //both headers
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 30,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        elevation: 1,
        // position: "absolute",
        width: '100%',
    },

    //header1
    welcome: {
        fontSize: 12,
        fontFamily: 'Poppins',
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    name: {
        fontSize: 17,
        fontFamily: 'Poppins-SemiBold',
    },

    //header2
    arrowButton: {
        marginRight: 20,
    },
    title: {
        fontSize: 20,
        fontFamily: 'Poppins-SemiBold',
    }
});

export default styles;