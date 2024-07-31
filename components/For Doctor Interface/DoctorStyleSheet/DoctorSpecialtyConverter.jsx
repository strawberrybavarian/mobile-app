import React, { useState, useEffect } from 'react';
import { StyleSheet, Pressable, Animated, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, } from '@react-navigation/native';

const specialtyMap = {
    PrimaryCare: 'Primary Care & General Medicine',
    Obgyn: 'OB-GYN',
    Pedia: 'Pediatrics',
    Cardio: 'Cardiology',
    Opthal: 'Ophthalmology',
    Derma: 'Dermatology',
    Neuro: 'Neurology',
    InternalMed: 'Internal Medicine',
};

const reverseSpecialtyMap = Object.fromEntries(
    Object.entries(specialtyMap).map(([key, value]) => [value, key])
);

export const getSpecialtyDisplayName = (specialty) => {
    return specialtyMap[specialty] || 'Unknown Specialty';
};

export const getSpecialtyCode = (displayName) => {
    return reverseSpecialtyMap[displayName] || 'Unknown Code';
};

