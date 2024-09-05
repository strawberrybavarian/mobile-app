import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import axios from 'axios';
import { TextInput } from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import styles from './HeaderStyle';

const Header1 = ({ name }) => {
    const navigation = useNavigation(); // Access navigation via hook

    return (
        <View style={styles.header}>
            <Image
                source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD29ZbwcUoURx5JZQ0kEwp6y4_NmjEJhh2Z6OdKRkbUw&s" }}
                style={styles.image}
            />
            <View>
                <Text style={styles.welcome}>Welcome!</Text>
                <Text style = {styles.name}>{name}</Text>
            </View>
        </View>
    );
};

const Header2 = ({ title }) => {
    const navigation = useNavigation(); // Access navigation via hook

    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.arrowButton}>
                <Entypo name="chevron-left" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text> {/* Use the title prop */}
        </View>
    );
};

export {Header1, Header2};