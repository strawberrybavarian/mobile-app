import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Alert, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";
import NavigationBar from '../../Navigation/NavigationBar';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { ip } from '../../../../ContentExport';
import { useFocusEffect } from '@react-navigation/native';
import { getData } from '../../../storageUtility';

const ViewProfile = ({ isVisible, closeModal }) => {
    const [userId, setUserId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [middleInitial, setMiddleInitial] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [dob, setDob] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('');
    const [patient, setPatient] = useState({});

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const id = await getData('userId');
                id ? setUserId(id) : console.log('User not found');
            } catch (err) {
                console.log(err);
            }
        };
        fetchUserId();
    }, []);

    useEffect(()=> {
        const fetchData = () => {
            if (userId) {
                axios.get(`${ip.address}/patient/api/onepatient/${userId}`)
                    .then(res => {
                        console.log(res.data.thePatient);
                    })
                    .catch(err => console.log(err));
            }
        }

        fetchData();
                        
    }, [userId])

    
}