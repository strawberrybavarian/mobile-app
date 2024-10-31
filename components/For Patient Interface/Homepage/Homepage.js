import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions, Modal, Pressable, Animated } from 'react-native';
import NavigationBar from '../Navigation/NavigationBar';
import { getData } from '../../storageUtility';
import axios from 'axios';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { ip } from '../../../ContentExport';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
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
import sd from '../../../utils/styleDictionary';
import { Button, Card } from 'react-native-paper';

const Homepage = () => {

    const [userId, setUserId] = useState(null);
    const [patientData, setPatientData] = useState({});
    const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
    const [imageArray, setImageArray] = useState([
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTspqeV2ho0cPe3MB8mKkXsVkoZwbki2T3hVQ&s',
        // 'https://scontent.fmnl25-3.fna.fbcdn.net/v/t39.30808-6/461067605_959076416261350_1136815970805189389_n.jpg?stp=dst-jpg_s1080x2048&_nc_cat=101&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFFP4Mv3qx2KjE0Zz-SEzCweN5DXJ7qCxB43kNcnuoLEP9KNK7OOemQH2wkgLVeptmhp9v0Wd5IErwto5gxQn0v&_nc_ohc=k1RvmY_tsCsQ7kNvgHYL0GM&_nc_ht=scontent.fmnl25-3.fna&_nc_gid=AK5kyBxSKlM7vq2WM7WrbTY&oh=00_AYCEcDViZ4Xkszg7mNbwzIcdbpMR5akHPOUGy5ADC5U8Xg&oe=671793B2',
        // 'https://scontent.fmnl25-2.fna.fbcdn.net/v/t39.30808-6/459144521_950773843758274_1189041271773114161_n.jpg?stp=dst-jpg_s1080x2048&_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFvrX6evRsQKvL2iCvlUjyLg9h2oA9BRpiD2HagD0FGmMff0uRrCm_qBY2a_ib7O9DGh3JCfczsOd7deaRD3ySA&_nc_ohc=8zwXmOdUYgMQ7kNvgH4MsCw&_nc_ht=scontent.fmnl25-2.fna&_nc_gid=AK5kyBxSKlM7vq2WM7WrbTY&oh=00_AYAz9WY7FFGe25GHF5EwDQdOSPJX0OXndZ8voKif-SfPNA&oe=67179071',

    ]);

    const navigation = useNavigation();


    useEffect(() => {
        getData('userId').then((id) => {
            setUserId(id);
        })
    }, [])

    useEffect(() => {
        if (userId) {
            axios.get(`${ip.address}/api/patient/api/onepatient/${userId}`)
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

    const AnimatedButton = ({ label, redir, icon }) => {
        const scaleValue = useRef(new Animated.Value(1)).current;

        const onPressIn = () => {
            Animated.spring(scaleValue, {
                toValue: 0.95,
                useNativeDriver: true,
            }).start();
            label !== 'Consultation' ? navigation.navigate(redir, label) : null
            
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
                    onPress={(onPressIn)}
                    onPressOut={onPressOut}
                    style={styles.optionBox}
                >
                    {/* <Image 
                        source={require('../../../assets/pictures/Stethoscope.png')}
                        style = {styles.optionImage}
                        /> */}
                    <FontAwesome5 name = {icon} style = {styles.optionImage}/>
                    <Text style={{ color: sd.colors.blue, fontFamily: sd.fonts.semiBold, textAlign: 'center' }}>{label}</Text> 
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
                                borderRadius: sd.borders.radiusXL,
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

                <View>

                </View>

                <Text style = {styles.title}>How can we help you today?</Text>
                
                <View style = {styles.optionsContainer}>
                    <View style = {styles.optionsRow}>
                        <AnimatedButton label="Consultation" redir = 'doctorspecialty' icon = 'stethoscope'/>
                        <AnimatedButton label="Vaccination" redir = 'bookappointment' icon = 'syringe'/>
                    </View>
                    <View style = {styles.optionsRow}>
                        <AnimatedButton label = "CBC" redir = 'bookappointment'  icon = 'tint'/>
                        <AnimatedButton label = "Radiology" redir = 'bookappointment'  icon = 'radiation'/>
                    </View>
                    <View style = {styles.optionsRow}>
                        <AnimatedButton label = "Pre- Employment" redir = 'bookappointment'  icon = 'user'/>
                        <AnimatedButton label = "Ultrasound" redir = 'bookappointment'  icon = 'baby'/>
                    </View>
                    {/* <Button
                        mode="contained"
                        //style = {styles.optionBox}
                        onPress={() => console.log('Check-up')}
                    >
                        Check-up
                    </Button> */}
                </View>
               
            </ScrollView>

            {/* <View style = {styles.navcontainer}>
                <NavigationBar/>
            </View> */}
        </View>
    );
}

export default Homepage;