import React, { useCallback, useEffect, useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  ActivityIndicator, 
  TextInput,
  RefreshControl, // Add this import
  Platform
} from 'react-native';
import { MaterialIcons, FontAwesome5, Feather, Ionicons } from "@expo/vector-icons";
import { getData } from '../../storageUtility';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { ip } from '../../../ContentExport';
import styles from './DoctorSpecialtyStyles';
import sd from '../../../utils/styleDictionary';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Checkbox, Menu, Divider } from 'react-native-paper';

const DoctorSpecialty = ({ preSelectedSpecialty, specialties: propSpecialties, recommendedDoctors }) => {
  const route = useRoute();
  const { serviceData, isServiceAppointment } = route.params || {};
  const [isLoading, setIsLoading] = useState(false);
  // User data states
  const [userId, setUserId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState(null);
  
  // Doctor data states
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  
  // Filter states
  const [searchName, setSearchName] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(preSelectedSpecialty || '');
  const [showDropdown, setShowDropdown] = useState(false);
  
  const [refreshing, setRefreshing] = useState(false); // Add refreshing state
  
  const navigation = useNavigation();

  // Fetch doctors and specialties
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch specialties
      const specialtiesResponse = await axios.get(`${ip.address}/api/doctor/api/specialties`);
      setSpecialties(specialtiesResponse.data.specialties);
      
      // Fetch all doctors
      const doctorsResponse = await axios.get(`${ip.address}/api/doctor/api/alldoctor`);
      if (doctorsResponse.data && doctorsResponse.data.theDoctor) {
        const allDoctors = doctorsResponse.data.theDoctor;
        setDoctors(allDoctors);
        
        // Apply filters immediately if there's a selected specialty
        if (selectedSpecialty) {
          console.log("Filtering doctors immediately for specialty:", selectedSpecialty);
          const filtered = allDoctors.filter(doctor => 
            doctor.dr_specialty === selectedSpecialty
          );
          setFilteredDoctors(filtered);
        } else {
          setFilteredDoctors(allDoctors);
        }
      }
    } catch (err) {
      console.log('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    fetchData();
    
    // Fetch user data
    const fetchUserId = async () => {
      try {
        const id = await getData('userId');
        if (id) {
          setUserId(id);
        }
      } catch (err) {
        console.log(err);
      }
    };
    
    fetchUserId();
  }, []);
  
  // Apply filters when search or specialty selection changes
  useEffect(() => {
    if (!doctors.length) return;
    
    const filtered = doctors.filter((doctor) => {
      // Filter by name
      const doctorName = `${doctor.dr_firstName || ''} ${doctor.dr_lastName || ''}`.toLowerCase();
      const nameMatch = !searchName || doctorName.includes(searchName.toLowerCase());
      
      // Filter by specialty
      const specialtyMatch = !selectedSpecialty || doctor.dr_specialty === selectedSpecialty;
      
      return nameMatch && specialtyMatch;
    });
    
    setFilteredDoctors(filtered);
  }, [searchName, selectedSpecialty, doctors]);
  
  // Add useFocusEffect to handle specialty changes when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      
      // Re-fetch data or re-apply filters when screen is focused
      if (preSelectedSpecialty && doctors.length > 0) {
        const filtered = doctors.filter(doctor => 
          doctor.dr_specialty === preSelectedSpecialty
        );
        setFilteredDoctors(filtered);
      }
      
      return () => {
        // Cleanup when screen loses focus
      };
    }, [preSelectedSpecialty, doctors])
  );

  // Directly watch route params for specialty changes
  useEffect(() => {
    if (route.params?.specialty) {
      console.log("Received specialty from route params:", route.params.specialty);
      setSelectedSpecialty(route.params.specialty);
    }
  }, [route.params?.specialty]);
  
  // Utility function for calculating time since last active
  const timeSinceLastActive = (lastActive) => {
    if (!lastActive) return "Status not available";
    
    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const secondsAgo = Math.floor((now - lastActiveDate) / 1000);
    const minutesAgo = Math.floor(secondsAgo / 60);
    const hoursAgo = Math.floor(minutesAgo / 60);
    const daysAgo = Math.floor(hoursAgo / 24);

    if (minutesAgo < 1) return "Just now";
    if (minutesAgo < 60) return `${minutesAgo}m ago`;
    if (hoursAgo < 24) return `${hoursAgo}h ago`;
    if (daysAgo < 7) return `${daysAgo}d ago`;
    return `Inactive`;
  };
  
  // Get status details and styling
  const getStatusDetails = (doctor) => {
    if (doctor.activityStatus === "Online") {
      return { text: "Online", color: '#4CAF50', dotColor: '#4CAF50' };
    } else if (doctor.activityStatus === "In Session") {
      return { text: "In Session", color: '#2196F3', dotColor: '#2196F3' };
    } else {
      return { 
        text: timeSinceLastActive(doctor.lastActive), 
        color: '#757575', 
        dotColor: '#757575' 
      };
    }
  };
  
  // Navigate to book appointment with selected doctor
  const handleDoctorSelect = (doctor) => {
    navigation.navigate('bookappointment', { 
      item: doctor,
      serviceData: serviceData || null,
      isServiceAppointment: isServiceAppointment || false
    });
  };
  
  // Reset filters
  const handleResetFilters = () => {
    setSearchName('');
    setSelectedSpecialty('');
  };
  
  // Render a single doctor card
  const renderDoctorCard = (doctor) => {
    const status = getStatusDetails(doctor);
    
    return (
      <TouchableOpacity 
        key={doctor._id}
        style={doctorStyles.doctorCard}
        onPress={() => handleDoctorSelect(doctor)}
      >
        <Image 
          source={
            doctor.dr_image 
              ? { uri: `${ip.address}/${doctor.dr_image}` } 
              : require('../../../assets/pictures/Doc.png')
          }
          style={doctorStyles.doctorImage}
        />
        
        <View style={doctorStyles.statusIndicator}>
          <View style={[doctorStyles.statusDot, { backgroundColor: status.dotColor }]} />
        </View>
        
        <View style={doctorStyles.doctorInfo}>
          <Text style={doctorStyles.doctorName}>
            Dr. {doctor.dr_firstName} {doctor.dr_lastName}
          </Text>
          <Text style={doctorStyles.doctorSpecialty}>{doctor.dr_specialty}</Text>
          <View style={doctorStyles.statusContainer}>
            <Text style={[doctorStyles.statusText, { color: status.color }]}>
              {status.text}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={doctorStyles.bookButton}
          onPress={() => handleDoctorSelect(doctor)}
        >
          <Text style={doctorStyles.bookButtonText}>Book</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };
  
  return (
    <SafeAreaView style={doctorStyles.container}>
      <ScrollView 
        style={doctorStyles.scrollContainer}
        contentContainerStyle={doctorStyles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[sd.colors.blue]} // Android colors
            tintColor={sd.colors.blue} // iOS color
            title="Refreshing..." // iOS only
            titleColor={sd.colors.blue} // iOS only
          />
        }
      >
        {/* Header with search */}
        <View style={doctorStyles.header}>
          <Text style={doctorStyles.headerTitle}>Find a Doctor</Text>
          
          <View style={doctorStyles.searchContainer}>
            <Ionicons name="search" size={16} color="#757575" style={doctorStyles.searchIcon} />
            <TextInput
              style={doctorStyles.searchInput}
              placeholder="Search by doctor name"
              value={searchName}
              onChangeText={setSearchName}
              placeholderTextColor="#9E9E9E"
            />
            {searchName ? (
              <TouchableOpacity onPress={() => setSearchName('')}>
                <Ionicons name="close-circle" size={16} color="#757575" />
              </TouchableOpacity>
            ) : null}
          </View>
          
          {/* Filter row with dropdown */}
          <View style={doctorStyles.filterRow}>
            <Menu
              visible={showDropdown}
              onDismiss={() => setShowDropdown(false)}
              anchor={
                <TouchableOpacity 
                  style={doctorStyles.filterButton}
                  onPress={() => setShowDropdown(true)}
                >
                  <Text style={doctorStyles.filterButtonText} numberOfLines={2}>
                    {selectedSpecialty ? selectedSpecialty : 'Filter by Specialty'}
                  </Text>
                  <Ionicons name="chevron-down" size={14} color={sd.colors.blue} />
                </TouchableOpacity>
              }
            >
              <Menu.Item 
                onPress={() => {
                  setSelectedSpecialty('');
                  setShowDropdown(false);
                }} 
                title="All Specialties" 
                titleStyle={{
                  fontWeight: !selectedSpecialty ? 'bold' : 'normal',
                  color: !selectedSpecialty ? sd.colors.blue : '#000'
                }}
              />
              <Divider />
              {specialties.map((specialty) => (
                <Menu.Item
                  key={specialty._id}
                  onPress={() => {
                    setSelectedSpecialty(specialty.name);
                    setShowDropdown(false);
                  }}
                  title={specialty.name}
                  titleStyle={{
                    fontWeight: selectedSpecialty === specialty.name ? 'bold' : 'normal',
                    color: selectedSpecialty === specialty.name ? sd.colors.blue : '#000'
                  }}
                />
              ))}
            </Menu>
            
            {(selectedSpecialty || searchName) && (
              <TouchableOpacity 
                style={doctorStyles.resetButton}
                onPress={handleResetFilters}
              >
                <Text style={doctorStyles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {/* Doctors list */}
        <View style={doctorStyles.resultsContainer}>
          <Text style={doctorStyles.resultsText}>
            Found {filteredDoctors.length} {filteredDoctors.length === 1 ? 'doctor' : 'doctors'}
          </Text>
          
          {isLoading ? (
            <View style={doctorStyles.loadingContainer}>
              <ActivityIndicator size="small" color={sd.colors.blue} />
              <Text style={doctorStyles.loadingText}>Loading doctors...</Text>
            </View>
          ) : error ? (
            <View style={doctorStyles.errorContainer}>
              <Text style={doctorStyles.errorText}>{error}</Text>
              <TouchableOpacity style={doctorStyles.retryButton} onPress={fetchData}>
                <Text style={doctorStyles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : filteredDoctors.length === 0 ? (
            <View style={doctorStyles.emptyContainer}>
              <Text style={doctorStyles.emptyText}>No doctors found</Text>
              <Text style={doctorStyles.emptySubtext}>Try changing your search criteria</Text>
            </View>
          ) : (
            <View style={doctorStyles.doctorsContainer}>
              {filteredDoctors.map(doctor => renderDoctorCard(doctor))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const doctorStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },
  scrollContainer: {
    flex: 1,
    paddingBottom: 500,
  },
  scrollContentContainer: {
    paddingBottom: 50, // Bottom margin of 50
  },
  header: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: sd.fonts.semiBold,
    marginBottom: 10,
    color: sd.colors.blue,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 8,
    height: 36,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: 36,
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: '#212121',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Changed to flex-start to align with wrap
    marginTop: 2,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 15,
    backgroundColor:'#F5F5F5',
    borderRadius: 6,
     // Limit width to ensure reset button stays visible
    flexWrap: 'wrap', // Allow content to wrap
  },
  filterButtonText: {
    marginHorizontal: 6,
    fontSize: 12,
    fontFamily: sd.fonts.medium,
    color: sd.colors.blue,
    flexShrink: 1, // Allow text to shrink and wrap
  },
  resetButton: {
    padding: 6,
    alignSelf: 'flex-start',
  },
  resetButtonText: {
    fontSize: 12,
    fontFamily: sd.fonts.medium,
    color: '#F44336',
  },
  resultsContainer: {
    padding: 12,
    paddingBottom: 100,
  },
  resultsText: {
    fontSize: 12,
    fontFamily: sd.fonts.regular,
    color: '#757575',
    marginBottom: 10,
  },
  doctorsContainer: {
    marginBottom: 20,
  },
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    position: 'relative',
  },
  doctorImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 10,
  },
  statusIndicator: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  doctorInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: 14,
    fontFamily: sd.fonts.semiBold,
    marginBottom: 2,
    color: '#212121',
  },
  doctorSpecialty: {
    fontSize: 12,
    fontFamily: sd.fonts.regular,
    color: '#757575',
    marginBottom: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 10,
    fontFamily: sd.fonts.medium,
  },
  bookButton: {
    backgroundColor: sd.colors.blue,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: sd.fonts.medium,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: '#757575',
  },
  errorContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: '#F44336',
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: sd.colors.blue,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: sd.fonts.medium,
  },
  emptyContainer: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: sd.fonts.medium,
    color: '#424242',
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 12,
    fontFamily: sd.fonts.regular,
    color: '#757575',
  },
});

export default DoctorSpecialty;