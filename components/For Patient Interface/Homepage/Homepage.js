import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Animated, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { ip } from '../../../ContentExport';
import { getData } from '../../storageUtility';
import styles from './HomepageStyles';
import sd from '../../../utils/styleDictionary';
import { FontAwesome5 } from '@expo/vector-icons';

const Homepage = () => {
    const [userId, setUserId] = useState(null);
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserAndServices = async () => {
            try {
                // Get user ID from storage
                const id = await getData('userId');
                setUserId(id);
                
                // Fetch services from backend
                const response = await axios.get(`${ip.address}/api/admin/getall/services`);

                console.log('servicess: ', response)
                
                if (response.data) {
                    console.log('Services fetched:', response.data);
                    setServices(response.data);
                } else {
                    // Fallback to default services if API doesn't return expected format
                    setServices(getDefaultServices());
                    console.log('Using default services (API returned unexpected format)');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                // Set default services on error
                setServices(getDefaultServices());
                console.log('Using default services due to error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserAndServices();
    }, []);

    // Default services as fallback
    const getDefaultServices = () => [
        { _id: 'default1', name: 'Consultation', category: 'Medical', icon: 'stethoscope' },
        { _id: 'default2', name: 'Laboratory', category: 'Diagnostics', icon: 'vial' },
        { _id: 'default3', name: 'Vaccination', category: 'Preventive', icon: 'syringe' },
        { _id: 'default4', name: 'Imaging', category: 'Radiology', icon: 'x-ray' },
        { _id: 'default5', name: 'Physical Therapy', category: 'Rehabilitation', icon: 'walking' },
        { _id: 'default6', name: 'Dental', category: 'Oral Health', icon: 'tooth' }
    ];

    // Helper function to get appropriate icon based on service category
    const getServiceIcon = (service) => {
        // If service has an icon property, use it
        if (service.icon) return service.icon;
        
        // Otherwise map category to an icon
        const iconMap = {
            'Medical': 'stethoscope',
            'Diagnostics': 'vial',
            'Laboratory': 'microscope',
            'Preventive': 'shield-virus',
            'Radiology': 'x-ray',
            'Imaging': 'x-ray',
            'Rehabilitation': 'walking',
            'Dental': 'tooth',
            'Pharmacy': 'pills',
            'Emergency': 'ambulance',
            'Specialty': 'user-md',
            'Mental': 'brain'
        };
        
        return iconMap[service.category] || 'medkit';
    };

    // Animated button for each service
    const AnimatedServiceButton = ({ service, icon }) => {
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
        
        const handlePress = () => {
            // Navigate directly to doctorspecialty with service info
            navigation.navigate('bookservices', { 
                serviceData: service,
                isServiceAppointment: service.name.toLowerCase() !== 'consultation'
            });
        };

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                onPress={handlePress}
            >
                <Animated.View
                    style={[
                        styles.optionBox,
                        { transform: [{ scale: scaleValue }] }
                    ]}
                >
                    {service.imageUrl ? (
                        <Image 
                            source={{ uri: `${ip.address}/${service.imageUrl}` }}
                            style={styles.serviceImage}
                            resizeMode="cover"
                        />
                    ) : (
                        <FontAwesome5 
                            name={icon} 
                            style={styles.optionImage}
                        />
                    )}
                    <Text style={{ textAlign: 'center', fontFamily: sd.fonts.medium }}>
                        {service.name}
                    </Text>
                </Animated.View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.mainContaineer}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Your existing header here */}
                
                {/* Services section */}
                <Text style={styles.title}>How can we help you today?</Text>
                
                {isLoading ? (
                    <ActivityIndicator size="large" color={sd.colors.blue} />
                ) : (
                    <View style={styles.optionsContainer}>
                        {services.map((service, index) => (
                            <AnimatedServiceButton
                                key={service._id || `service-${index}`}
                                service={service}
                                icon={getServiceIcon(service)}
                            />
                        ))}
                    </View>
                )}
                
                {/* Your existing additional sections */}
            </ScrollView>
        </SafeAreaView>
    );
}

export default Homepage;