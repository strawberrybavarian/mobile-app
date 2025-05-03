import React, { useState, useEffect, useRef, useCallback} from 'react';
import { 
    View, 
    Text, 
    SafeAreaView, 
    ScrollView, 
    TouchableOpacity, 
    Animated, 
    ActivityIndicator, 
    Image, 
    Dimensions,
    FlatList,
    RefreshControl,
    StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { ip } from '../../../ContentExport';
import { getData } from '../../storageUtility';
import styles from './HomepageStyles';
import sd from '../../../utils/styleDictionary';
import { FontAwesome5 } from '@expo/vector-icons';


const { width } = Dimensions.get('window');

const Homepage = () => {
    const [userId, setUserId] = useState(null);
    const [services, setServices] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [news, setNews] = useState([]);
    const [extendedNews, setExtendedNews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingSpecialties, setIsLoadingSpecialties] = useState(true);
    const [isLoadingNews, setIsLoadingNews] = useState(true);
    const [activeNewsIndex, setActiveNewsIndex] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();
    
    const newsCarouselRef = useRef(null);
    const autoScrollTimerRef = useRef(null);

    const fetchUserAndServices = async () => {
        try {
            const id = await getData('userId');
            setUserId(id);
            
            const response = await axios.get(`${ip.address}/api/admin/getall/services`);
            
            if (response.data && response.data.length > 0) {
                setServices(response.data);
            } else {
                setServices(getDefaultServices());
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            setServices(getDefaultServices());
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSpecialties = async () => {
        setIsLoadingSpecialties(true);
        try {
            const response = await axios.get(`${ip.address}/api/doctor/api/specialties`);

            if (response.data && response.data.specialties && response.data.specialties.length > 0) {
                setSpecialties(response.data.specialties);
            } else {
                setSpecialties(getDefaultSpecialties());
            }
        } catch (error) {
            console.error('Error fetching specialties:', error);
            setSpecialties(getDefaultSpecialties());
        } finally {
            setIsLoadingSpecialties(false);
        }
    };

    const fetchNews = async () => {
        setIsLoadingNews(true);
        try {
            const response = await axios.get(`${ip.address}/api/news/api/getgeneralnews`);
            if (response.data && Array.isArray(response.data.news) && response.data.news.length > 0) {
                const newsData = response.data.news;
                
                setNews(newsData);
                
                if (newsData.length > 1) {
                    const extended = [
                        ...newsData.slice(-1),
                        ...newsData,
                        ...newsData.slice(0, 1)
                    ];
                    setExtendedNews(extended);
                } else {
                    setExtendedNews(newsData);
                }
            } else {
                setNews([]);
                setExtendedNews([]);
            }
        } catch (error) {
            console.error('Error fetching news:', error);
            setNews([]);
            setExtendedNews([]);
        } finally {
            setIsLoadingNews(false);
        }
    };

    const fetchAllData = useCallback(async () => {
        const promises = [
            fetchUserAndServices(),
            fetchSpecialties(),
            fetchNews()
        ];
        
        await Promise.all(promises);
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        
        if (autoScrollTimerRef.current) {
            clearInterval(autoScrollTimerRef.current);
        }
        
        try {
            await fetchAllData();
        } finally {
            setRefreshing(false);
            
            if (news.length > 1) {
                startAutoScroll();
            }
        }
    }, []);

    useEffect(() => {
        fetchAllData();
    }, []);

    useEffect(() => {
        if (extendedNews.length > 0 && newsCarouselRef.current) {
            setTimeout(() => {
                newsCarouselRef?.current?.scrollToOffset({
                    offset: width,
                    animated: false
                });
            }, 100);
        }
    }, [extendedNews]);

    useEffect(() => {
        if (news.length > 1) {
            startAutoScroll();
        }
        
        return () => {
            if (autoScrollTimerRef.current) {
                clearInterval(autoScrollTimerRef.current);
            }
        };
    }, [news, extendedNews]);

    const startAutoScroll = () => {
        if (autoScrollTimerRef.current) {
            clearInterval(autoScrollTimerRef.current);
        }
        
        autoScrollTimerRef.current = setInterval(() => {
            if (newsCarouselRef.current && news.length > 1) {
                let nextIndex = (activeNewsIndex + 1) % news.length;
                const scrollToIndex = nextIndex + 1;
                
                newsCarouselRef.current.scrollToOffset({
                    offset: scrollToIndex * width,
                    animated: true
                });
            }
        }, 4000);
    };

    const resetAutoScrollTimer = () => {
        if (news.length > 1) {
            startAutoScroll();
        }
    };

    const getDefaultServices = () => [
        { _id: 'default1', name: 'Consultation', category: 'Medical', icon: 'stethoscope' },
        { _id: 'default2', name: 'Laboratory', category: 'Diagnostics', icon: 'vial' },
        { _id: 'default3', name: 'Vaccination', category: 'Preventive', icon: 'syringe' },
        { _id: 'default4', name: 'Imaging', category: 'Radiology', icon: 'x-ray' },
        { _id: 'default5', name: 'Physical Therapy', category: 'Rehabilitation', icon: 'walking' },
        { _id: 'default6', name: 'Dental', category: 'Oral Health', icon: 'tooth' }
    ];

    const getDefaultSpecialties = () => [
        { _id: 'spec1', name: 'Cardiology', icon: 'heartbeat' },
        { _id: 'spec2', name: 'Dermatology', icon: 'allergies' },
        { _id: 'spec3', name: 'Neurology', icon: 'brain' },
        { _id: 'spec4', name: 'Orthopedics', icon: 'bone' },
        { _id: 'spec5', name: 'Pediatrics', icon: 'child' },
        { _id: 'spec6', name: 'Dentistry', icon: 'tooth' },
        { _id: 'spec7', name: 'Ophthalmology', icon: 'eye' },
        { _id: 'spec8', name: 'General Medicine', icon: 'stethoscope' },
        { _id: 'spec9', name: 'ENT', icon: 'ear' }
    ];

    const getServiceIcon = (service) => {
        if (service.icon) return service.icon;
        
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

    const getSpecialtyIcon = (specialtyName) => {
        const iconMap = {
            'Cardiology': 'heartbeat',
            'Dermatology': 'allergies',
            'Neurology': 'brain',
            'Orthopedics': 'bone',
            'Pediatrics': 'child',
            'Psychiatry': 'comment-medical',
            'Ophthalmology': 'eye',
            'Gynecology': 'venus',
            'Urology': 'procedures',
            'ENT': 'ear',
            'Dentistry': 'tooth',
            'General Medicine': 'stethoscope',
            'Internal Medicine': 'lungs',
            'Surgery': 'cut'
        };
        
        return iconMap[specialtyName] || 'user-md';
    };

    const AnimatedServiceButton = ({ service, icon }) => {
        const scaleValue = useRef(new Animated.Value(1)).current;
        const opacityValue = useRef(new Animated.Value(0)).current;
        const translateYValue = useRef(new Animated.Value(20)).current;
        
        useEffect(() => {
            // Staggered entrance animation
            Animated.sequence([
                Animated.delay(index * 100), // Stagger based on index
                Animated.parallel([
                    Animated.timing(opacityValue, {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true
                    }),
                    Animated.timing(translateYValue, {
                        toValue: 0,
                        duration: 400,
                        useNativeDriver: true
                    })
                ])
            ]).start();
        }, []);
        
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
                        { 
                            transform: [
                                { scale: scaleValue },
                                { translateY: translateYValue }
                            ],
                            opacity: opacityValue
                        }
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
                    <Text style={styles.optionText}>
                        {service.name}
                    </Text>
                </Animated.View>
            </TouchableOpacity>
        );
    };

    const AnimatedSpecialtyButton = ({ specialty }) => {
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
            navigation.navigate('ptnmain', {
                screen: 'doctorspecialty',
                specialty: specialty.name
            });
        };

        const icon = specialty.icon || getSpecialtyIcon(specialty.name);

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                onPress={handlePress}
            >
                <Animated.View
                    style={[
                        styles.specialtyBox,
                        { transform: [{ scale: scaleValue }] }
                    ]}
                >
                    {specialty.imageUrl ? (
                        <Image 
                            source={{ uri: `${ip.address}/${specialty.imageUrl}` }}
                            style={styles.serviceImage}
                            resizeMode="cover"
                        />
                    ) : (
                        <FontAwesome5 
                            name={icon} 
                            style={styles.specialtyImage}
                        />
                    )}
                    <Text style={styles.optionText}>
                        {specialty.name}
                    </Text>
                </Animated.View>
            </TouchableOpacity>
        );
    };

    const renderNewsItem = ({ item }) => {
        const imageUrl = item.images && item.images.length > 0 
            ? `${ip.address}/${item.images[0]}`
            : `${ip.address}/news/images/default-news.jpg`;
            
        return (
            <TouchableOpacity 
                style={styles.newsSlide}
                activeOpacity={0.9}
                onPress={() => handleNewsPress(item)}
            >
                <Image 
                    source={{ uri: imageUrl }}
                    style={styles.newsImage}
                    resizeMode="cover"
                />
                <View style={styles.newsOverlay}>
                    <Text style={styles.newsHeadline} numberOfLines={2}>
                        {item.headline}
                    </Text>
                    
                </View>
            </TouchableOpacity>
        );
    };

    const handleNewsPress = (newsItem) => {
        console.log('News item clicked:', newsItem._id);
        
        if (autoScrollTimerRef.current) {
            clearInterval(autoScrollTimerRef.current);
        }
        
        navigation.navigate('NewsDetail', { newsItem });
    };

    const handleNewsScroll = useCallback((event) => {
        if (!news.length) return;
        
        resetAutoScrollTimer();
        
        const contentOffset = event.nativeEvent.contentOffset;
        const viewSize = event.nativeEvent.layoutMeasurement;
        
        let newIndex = Math.round(contentOffset.x / viewSize.width);
        
        if (newIndex === 0) {
            newsCarouselRef?.current?.scrollToOffset({
                offset: viewSize.width * news.length,
                animated: false
            });
            newIndex = news.length;
        } else if (newIndex === extendedNews.length - 1) {
            newsCarouselRef?.current?.scrollToOffset({
                offset: viewSize.width,
                animated: false
            });
            newIndex = 1;
        }
        
        setActiveNewsIndex((newIndex - 1) % news.length);
    }, [news]);

    const goToPreviousSlide = () => {
        if (newsCarouselRef.current && news.length > 1) {
            let prevIndex = (activeNewsIndex - 1 + news.length) % news.length;
            const scrollToIndex = prevIndex + 1;
            newsCarouselRef.current.scrollToOffset({
                offset: scrollToIndex * width,
                animated: true
            });
            resetAutoScrollTimer();
        }
    };

    const goToNextSlide = () => {
        if (newsCarouselRef.current && news.length > 1) {
            let nextIndex = (activeNewsIndex + 1) % news.length;
            const scrollToIndex = nextIndex + 1;
            newsCarouselRef.current.scrollToOffset({
                offset: scrollToIndex * width,
                animated: true
            });
            resetAutoScrollTimer();
        }
    };

    return (
        <SafeAreaView style={styles.mainContaineer}>
            <ScrollView 
                contentContainerStyle={styles.scrollContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[sd.colors.blue]}
                        tintColor={sd.colors.blue}
                        title="Pull to refresh..."
                        titleColor={sd.colors.blue}
                    />
                }
            >
                {isLoadingNews ? (
                    <View style={styles.newsCarouselPlaceholder}>
                        <ActivityIndicator size="large" color={sd.colors.blue} />
                    </View>
                ) : news.length > 0 ? (
                    <View style={styles.newsCarouselContainer}>
                        {news.length > 1 && (
                            <TouchableOpacity 
                                style={styles.carouselArrow}
                                activeOpacity={0.7}
                                onPress={goToPreviousSlide}
                            >
                                <FontAwesome5 name="chevron-left" size={18} color="white" />
                            </TouchableOpacity>
                        )}
                        
                        <FlatList
                            ref={newsCarouselRef}
                            data={extendedNews.length > 0 ? extendedNews : news}
                            renderItem={renderNewsItem}
                            keyExtractor={(item, index) => `${item._id}-${index}`}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            onMomentumScrollEnd={handleNewsScroll}
                            onScrollBeginDrag={() => resetAutoScrollTimer()}
                            initialNumToRender={3}
                            maxToRenderPerBatch={3}
                            windowSize={3}
                            snapToInterval={width}
                            snapToAlignment="start"
                            decelerationRate="fast"
                        />
                        
                        {news.length > 1 && (
                            <TouchableOpacity 
                                style={[styles.carouselArrow, styles.carouselArrowRight]}
                                activeOpacity={0.7}
                                onPress={goToNextSlide}
                            >
                                <FontAwesome5 name="chevron-right" size={18} color="white" />
                            </TouchableOpacity>
                        )}
                    </View>
                ) : null}

                <Text style={styles.sectionTitle}>How can we help you today?</Text>
                
                                {isLoading ? (
                    <ActivityIndicator size="small" color={sd.colors.blue} />
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
                
                {/* News navigation arrows - move outside the services map */}
                {news.length > 1 && (
                    <TouchableOpacity 
                        style={[styles.carouselArrow, styles.carouselArrowRight]}
                        activeOpacity={0.7}
                        onPress={goToNextSlide}
                    >
                        <FontAwesome5 name="chevron-right" size={18} color="white" />
                    </TouchableOpacity>
                )}
                
                {/* Pagination dots - move outside the services map */}
                {news.length > 1 && (
                    <View style={styles.paginationContainer}>
                        {news.map((_, index) => (
                            <View 
                                key={index}
                                style={[
                                    styles.paginationDot,
                                    index === activeNewsIndex && styles.activePaginationDot
                                ]} 
                            />
                        ))}
                    </View>
                )}

                <View style={styles.sectionSpacing} />

                <Text style={styles.sectionTitle}>Medical Specialties</Text>
                
                {isLoadingSpecialties ? (
                    <ActivityIndicator size="small" color={sd.colors.secondary} />
                ) : (
                    <Animated.View style={{ opacity: fadeAnim.specialties, transform: [{ translateY: fadeAnim.specialties.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0]
                    })}] }}>
                        <View style={styles.optionsContainer}>
                            {specialties.map((specialty, index) => (
                                <AnimatedSpecialtyButton
                                    key={specialty._id || `specialty-${index}`}
                                    specialty={specialty}
                                    index={index}
                                />
                            ))}
                        </View>
                    </Animated.View>
                )}

                <View style={styles.sectionSpacing} />

                <View style={styles.sectionDivider} />

                <Text style={styles.sectionTitle}>Our Medical Services</Text>

                {isLoading ? (
                    <ActivityIndicator size="small" color={sd.colors.blue} />
                ) : (
                    <Animated.View style={{ opacity: fadeAnim.services, transform: [{ translateY: fadeAnim.services.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0]
                    })}] }}>
                        <View style={styles.optionsContainer}>
                            {services.map((service, index) => (
                                <AnimatedServiceButton
                                    key={service._id || `service-${index}`}
                                    service={service}
                                    icon={getServiceIcon(service)}
                                    index={index}
                                />
                            ))}
                        </View>
                    </Animated.View>
                )}

                <View style={styles.sectionSpacing} />

                <View style={styles.sectionDivider} />
                
                <View style={doctorStyles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Our Medical Professionals</Text>
                    <TouchableOpacity 
                        style={doctorStyles.viewAllButton}
                        onPress={() => {
                            // Navigate to the DoctorSpecialty tab by setting index to 2
                            navigation.navigate('ptnmain', { 
                                setActiveTab: 'Doctor Specialty'
                            });
                        }}
                    >
                        <Text style={doctorStyles.viewAllText}>View All</Text>
                    </TouchableOpacity>
                </View>
                
                {isLoadingDoctors ? (
                    <View style={doctorStyles.loadingContainer}>
                        <ActivityIndicator size="small" color={sd.colors.blue} />
                        <Text style={doctorStyles.loadingText}>Loading doctors...</Text>
                    </View>
                ) : doctors.length > 0 ? (
                    <Animated.View style={{ opacity: fadeAnim.doctors, transform: [{ translateY: fadeAnim.doctors.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0]
                    })}] }}>
                        <FlatList
                            horizontal
                            data={doctors}
                            renderItem={renderDoctorCard}
                            keyExtractor={item => item._id}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={doctorStyles.doctorsList}
                            snapToAlignment="start"
                            decelerationRate="fast"
                        />
                    </Animated.View>
                ) : (
                    <View style={doctorStyles.emptyContainer}>
                        <Text style={doctorStyles.emptyText}>No doctors available</Text>
                    </View>
                )}
                
                <View style={styles.sectionDivider} />
                
                <Text style={styles.sectionTitle}>Find Doctors by Specialty</Text>
                
                {isLoadingSpecialties ? (
                    <ActivityIndicator size="small" color={sd.colors.secondary} />
                ) : (
                    <View style={styles.optionsContainer}>
                        {specialties.map((specialty, index) => (
                            <AnimatedSpecialtyButton
                                key={specialty._id || `specialty-${index}`}
                                specialty={specialty}
                            />
                        ))}
                    </View>
                )}
                
            </ScrollView>
        </SafeAreaView>
    );
};

const doctorStyles = StyleSheet.create({
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginVertical: 5, // Reduced from 10
    },
    viewAllButton: {
        padding: 4, // Reduced from 6
    },
    viewAllText: {
        color: sd.colors.blue,
        fontSize: 14,
        fontFamily: sd.fonts.medium,
    },
    doctorsList: {
        paddingHorizontal: 16,
        paddingVertical: 5, // Reduced from 10
    },
    doctorCard: {
        width: 145,
        height: 205,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginRight: 10,
        padding: 0, // Remove padding so image touches edges
        alignItems: 'center',
        overflow: 'hidden', // Ensures image corners are clipped if card is rounded
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    doctorImage: {
        width: '100%',
        height: 110, // or whatever fits your card height
        borderRadius: 0, // Remove the circle
        marginBottom: 8,
        resizeMode: 'cover', // Make sure the image covers the area
    },
    doctorInfo: {
        alignItems: 'center',
        paddingTop: 4, // Reduced from 6
    },
    doctorName: {
        fontSize: 14,
        fontFamily: sd.fonts.semiBold,
        textAlign: 'center',
        marginBottom: 2, // Reduced from 4
        color: '#212121',
    },
    loadingContainer: {
        height: 140, // Reduced from 160
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        height: 140, // Reduced from 160
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Homepage;