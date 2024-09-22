import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';

const styles = StyleSheet.create({
    //both headers
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
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
        marginRight: 5,
    },
    title: {
        fontSize: 12,
        fontFamily: 'Poppins-SemiBold',
        paddingTop: 1,
    }
});

export default styles;