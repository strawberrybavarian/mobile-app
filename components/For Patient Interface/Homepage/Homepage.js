import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions, Modal, Pressable, Animated } from 'react-native';
import NavigationBar from '../Navigation/NavigationBar';
import { getData } from '../../storageUtility';
import axios from 'axios';
import { FontAwesome5 } from '@expo/vector-icons';
import { ip } from '../../../ContentExport';
import { useFocusEffect } from '@react-navigation/native';
import { getSpecialtyDisplayName } from '../../../utils/specialtyMap';
import { Header1, Header2 } from '../../Headers/Headers';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import AppointmentDetails from '../AppointmentDetails/AppointmentDetails';
import CancelAppointmentModal from '../AppointmentDetails/CancelAppointmentModal';
import styles from './HomepageStyles';
import Carousel, {
    ICarouselInstance,
    Pagination,
  } from "react-native-reanimated-carousel";

const Homepage = () => {

    const [userId, setUserId] = useState(null);
    const [patientData, setPatientData] = useState({});
    const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
    const [imageArray, setImageArray] = useState([
        'https://images.unsplash.com/photo-1576669801615-4e2f69504d58?q=80&w=3494&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1596144241742-a54dffcc9b26?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGRvY3RvcnN8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1576669801615-4e2f69504d58?q=80&w=3494&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

    ]);


    useEffect(() => {
        getData('userId').then((id) => {
            setUserId(id);
        })
    }, [])

    useEffect(() => {
        if (userId) {
            axios.get(`${ip.address}/patient/api/onepatient/${userId}`)
                .then((res) => {
                    setPatientData(res.data.thePatient);
                    console.log(res.data.thePatient);
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }, [userId])

    useEffect(() => {
        console.log(patientData);
    }, [patientData])

    const AnimatedButton = ({ label }) => {
        const scaleValue = useRef(new Animated.Value(1)).current;

        const onPressIn = () => {
            Animated.spring(scaleValue, {
                toValue: 0.95,
                useNativeDriver: true,
            }).start();
        };

        const onPressOut = () => {
            Animated.spring(scaleValue, {
                toValue: 1,
                useNativeDriver: true,
            }).start();
        };

        return (
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                <Pressable
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    style={styles.optionBox}
                >
                    <Image 
                        source={require('/Users/elijahcruz/Desktop/hp-management-patient/assets/pictures/Stethoscope.png')}
                        style = {styles.optionImage}
                        />
                    <Text style={{ color: 'black' }}>{label}</Text> 
                </Pressable>
            </Animated.View>
        );
    };

    return (
        <View style={styles.mainContaineer}>

            <ScrollView    
                style={styles.scrollContainer}
                scrollEnabled = {true}
                contentContainerStyle = {styles.scrollContainer}
                >
                
                <View 
                    style = {styles.carouselContainer}
                    onLayout={(event) => {
                        setContainerDimensions({
                            width: event.nativeEvent.layout.width,
                            height: event.nativeEvent.layout.height
                        })
                    }}
                >
                    <Carousel
                    loop
                    width={containerDimensions.width || 200}
                    height={containerDimensions.height || 400}
                    autoPlay={true}
                    autoPlayInterval={3000}  // Set autoplay interval for automatic slide changes
                    data={imageArray}
                    scrollAnimationDuration={1000}  // Duration of the swipe/animation
                    panGestureHandlerProps={{
                        activeOffsetX: [-10, 10],  // Ensures swipe gestures are recognized
                    }}
                    
                    renderItem={({ index }) => (
                        <View
                            style={{
                                flex: 1,
                                // borderWidth: 1,
                                justifyContent: 'center',
                                
                            }}
                        >
                            <Image
                                source={{ uri: imageArray[index] }}
                                style={{ width: '100%', height: '100%' }}  // Ensure image fills the container
                                resizeMode="cover"
                            />
                        </View>
                    )}
                    />
                </View>

                <Text style = {styles.title}>How can we help you today?</Text>
                
                <View style = {styles.optionsContainer}>
                    <View style = {styles.optionsRow}>
                        <AnimatedButton label="Check-up"/>
                        <AnimatedButton label="X-ray" />
                    </View>
                    <View style = {styles.optionsRow}>
                        <AnimatedButton label = "EKG" />
                        <AnimatedButton label = "Other Services" />
                    </View>
                </View>
               
            </ScrollView>

            {/* <View style = {styles.navcontainer}>
                <NavigationBar/>
            </View> */}
        </View>
    );
}

export default Homepage;