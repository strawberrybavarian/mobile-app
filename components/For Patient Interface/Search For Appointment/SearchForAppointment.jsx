import React, { useState, useEffect } from "react";
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import doctorImage1 from '../../../assets/pictures/Doc.png';
import magnify from '../../../assets/pictures/magni.png';
import NavigationBar from '../Navigation/NavigationBar';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DoctorHomeStyles } from "../../For Doctor Interface/DoctorStyleSheet/DoctorCSS";
import axios from "axios";
import { ip } from "../../../ContentExport";
import sd from "../../../utils/styleDictionary";
import { useNavigation } from "@react-navigation/native";
import { Divider, Searchbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const SearchForAppointment = ({ route }) => {
  const [searchText, setSearchText] = useState("");
  const [allDoctorArray, setAllDoctorArray] = useState([]);
  const [doctorFiltered, setDoctorFiltered] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const { specpec, serviceData, isServiceAppointment } = route.params || {};
  
  // Add loading state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigation = useNavigation();

  // Get all doctors with loading state
  useEffect(() => {
    setIsLoading(true);
    axios.get(`${ip.address}/api/doctor/api/alldoctor`)
      .then((res) => {
        if (Array.isArray(res.data.theDoctor)) {
          setAllDoctorArray(res.data.theDoctor); // Set the response if it's an array
          console.log('Docs set:', res.data.theDoctor.length); // Log array length for debugging
        } else {
          console.error('Expected an array but got:', typeof res.data.theDoctor);
          setError('Invalid response from server');
        }
      })
      .catch((err) => {
        console.log('Error fetching doctors:', err);
        setError('Failed to load doctors');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Filter based on params - keep as is
  useEffect(() => {
    if(allDoctorArray.length > 0) {
      if(specpec == null) {
        setDoctorFiltered(allDoctorArray);
      } else {
        const filteredDoctors = allDoctorArray.filter(doctor => doctor.dr_specialty === specpec);
        setDoctorFiltered(filteredDoctors);
        console.log(filteredDoctors);
      }
    }
  }, [allDoctorArray, specpec]);

  const bookAppointmentButton = (item) => {
    navigation.navigate('bookappointment', { 
      item,
      serviceData: serviceData || null,
      isServiceAppointment: isServiceAppointment || false
    });
    console.log(item);
  };
  
  // For search - keep as is
  useEffect(() => {
    if (searchText && allDoctorArray.length > 0) {
      const filteredData = allDoctorArray.filter((item) =>
        item.dr_firstName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.dr_lastName.toLowerCase().includes(searchText.toLowerCase())
      );
      setDoctorFiltered(filteredData);
    } else if (allDoctorArray.length > 0) {
      // Reset to initial filter state when search is cleared
      if(specpec == null) {
        setDoctorFiltered(allDoctorArray);
      } else {
        const filteredDoctors = allDoctorArray.filter(doctor => doctor.dr_specialty === specpec);
        setDoctorFiltered(filteredDoctors);
      }
    }
  }, [searchText, allDoctorArray]);

  const renderSpecialtyOval = (specialty) => (
    <TouchableOpacity
      key={specialty}
      style={[
        styles.specialtyOval,
        selectedSpecialty === specialty && styles.selectedSpecialty,
      ]}
      onPress={() => handleSpecialtyClick(specialty)}
    >
      <Text style={[styles.specialtyText, selectedSpecialty === specialty && styles.selectedText]}>
        {specialty}
      </Text>
    </TouchableOpacity>
  );

  const handleSpecialtyClick = (specialty) => {
    console.log(`Clicked on: ${specialty}`);
    let mappedSpecialty;
    
    switch (specialty) {
      case 'General':
        mappedSpecialty = 'PrimaryCare'
        break;
      case 'OB-GYN':
        mappedSpecialty = 'Obgyn'
        break;
      case 'Pediatrics':
        mappedSpecialty = 'Pedia';
        break;
      case 'Cardiology':
        mappedSpecialty = 'Cardio';
        break;
      case 'Eye & Vision':
        mappedSpecialty = 'Opthal';
        break;
      case 'Dermatology':
        mappedSpecialty = 'Derma';
        break;
      case 'Neurology':
        mappedSpecialty = 'Neuro';
        break;
      case 'Gastroenterology':
        mappedSpecialty = 'InternalMed';
        break;
      default:
        mappedSpecialty = 'All';
    }

    setSelectedSpecialty(specialty);
    
    if(mappedSpecialty === 'All'){
      setDoctorFiltered(allDoctorArray)
    } else {
      const filteredDoctors = allDoctorArray.filter(doctor => doctor.dr_specialty === mappedSpecialty);
      setDoctorFiltered(filteredDoctors);
    }
  };

  const renderItem = ({ item }) => {
    if (!item) return null;
  
    return (
      <TouchableOpacity style={styles.appointmentItem} onPress={() => bookAppointmentButton(item)}>
        <Image 
          source={item.dr_image ? {uri: `${ip.address}/${item.dr_image}`} : null}
          style={styles.doctorImage} 
        />
        <View style={styles.textContainer}>
          <Text style={styles.doctorName}>Dr. {item.dr_firstName} {item.dr_lastName}</Text>
          <Text style={styles.specialty}>{item.dr_specialty}</Text>
          <View style={styles.ratingContainer}>
            <View style={DoctorHomeStyles.container211}>
              <Text style={{ fontFamily: 'Poppins', fontSize: 12 }}>
                <FontAwesome name="circle" size={12} style={{ color: 'green' }} /> Active Now | 
              </Text>
              <Text style={{ fontSize: 12, fontFamily: 'Poppins' }}>Molino Polyclinic</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  // Create a header component for the FlatList
  const ListHeaderComponent = () => (
    <View style={styles.headerContent}>
      <View style={styles.searchInputContainer}>
        <Searchbar
          placeholder="Search your Doctor"
          onChangeText={(text) => setSearchText(text)}
          value={searchText}
          style={{ width: "100%", borderRadius: 20 }}
        />
      </View>
      <Divider
        bold
        style={{ marginVertical: 10, marginTop: 20 }}
        theme={{colors: {outlineVariant: sd.colors.blue}}}
      />
    </View>
  );

  // Loading component that matches your UI style
  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={sd.colors.blue} />
      <Text style={styles.loadingText}>Loading doctors...</Text>
    </View>
  );

  // Error component that matches your UI style
  const renderError = () => (
    <View style={styles.errorContainer}>
      <FontAwesome name="exclamation-triangle" size={40} color="#ff6666" />
      <Text style={styles.errorText}>{error || "Failed to load doctors"}</Text>
      <TouchableOpacity 
        style={styles.retryButton}
        onPress={() => {
          setIsLoading(true);
          setError(null);
          axios.get(`${ip.address}/api/doctor/api/alldoctor`)
            .then((res) => {
              if (Array.isArray(res.data.theDoctor)) {
                setAllDoctorArray(res.data.theDoctor);
              } else {
                setError('Invalid response from server');
              }
            })
            .catch((err) => {
              setError('Failed to load doctors. Please try again.');
            })
            .finally(() => {
              setIsLoading(false);
            });
        }}
      >
        <Text style={styles.retryText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  // Empty state component
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome name="user-md" size={40} color="#cccccc" />
      <Text style={styles.emptyText}>
        {searchText ? 
          `No doctors found matching "${searchText}"` : 
          `No doctors available for ${specpec || 'this specialty'}`}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{flex:1, backgroundColor: sd.colors.white}}>
      <View
        backgroundColor={sd.colors.white}
        style={{ flex: 1, backgroundColor: sd.colors.white }}
      >
        <View style={styles.headerCont}>
          <Entypo 
            name="chevron-thin-left" 
            size={sd.fontSizes.large} 
            color={sd.colors.blue} 
            style={{flex:1}} 
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerText}>
            {specpec ? specpec + ' Department' : 'All Doctors'}
          </Text>
          <View style={{flex:1}}></View>
        </View>

        {/* Show service info if applicable */}
        {isServiceAppointment && serviceData && (
          <View style={styles.serviceInfoCard}>
            <Text style={styles.serviceTitle}>Booking: {serviceData.name}</Text>
            {serviceData.category && (
              <Text style={styles.serviceCategory}>{serviceData.category}</Text>
            )}
          </View>
        )}

        <View style={styles.container}>
          {isLoading ? (
            renderLoading()
          ) : error ? (
            renderError()
          ) : doctorFiltered && doctorFiltered.length > 0 ? (
            <FlatList
              data={doctorFiltered}
              renderItem={renderItem}
              keyExtractor={(item) => item._id || item.id || Math.random().toString()}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={ListHeaderComponent}
              contentContainerStyle={styles.appointmentBox}
            />
          ) : (
            <View style={styles.appointmentBox}>
              <ListHeaderComponent />
              {renderEmpty()}
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

// Keep all original styles and add new ones
const styles = StyleSheet.create({
  // All your existing styles
  navcontainer:{
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  container: {
    flex: 1,
  },
  searchInput: {
    fontSize: 15,
    height: 50,
    fontFamily: 'Poppins',
    width: "100%",
    top: 1,
    backgroundColor: 'rgba(182, 178, 178, 0.288)',
    overflow: 'hidden',
    paddingLeft: 10,
    paddingRight: 50,
  },
  headerCont: {
    flexDirection: "row",
    padding: 20,
    alignItems: 'center',
    backgroundColor: sd.colors.white,
  },
  headerText:{
    fontSize: sd.fontSizes.large,
    fontFamily: sd.fonts.semiBold,
    color: sd.colors.blue,
  },
  arrowCont:{
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  arrowText: {
    fontSize: 15,
    fontFamily: 'Poppins',
    color: "#9dceff",
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width:"90%",
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 50,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  magnifyIcon: {
    width: 20,
    height: 20,
    marginLeft: 55,
    marginRight: 10,
  },
  filterContainer: {
    marginBottom: 10,
    justifyContent: "space-between",
  },
  specialtyOvalContainer: {
    flexDirection: "row",
    paddingRight: 20,
    overflow: 'visible',
  },
  specialtyOval: {
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#92a3fd",
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 3,
    paddingTop: 3,
    marginLeft: 10,
  },
  selectedSpecialty: {
    backgroundColor: "#92a3fd",
  },
  specialtyText: {
    color: "#92a3fd",
  },
  selectedText: {
    color: 'white',
  },
  appointmentItem: {
    backgroundColor: '#ffffff',
    height: 110,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 12,
    ...sd.shadows.large,
    alignSelf: 'center',
  },
  appointmentBox:{
    width: '100%',
    paddingHorizontal: 20,
  },
  doctorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 16,
    alignItems: 'center'
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
    marginLeft: 15
  },
  doctorName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  specialty: {
    fontSize: 12,
    fontFamily: 'Poppins',
    color: "#666",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 13,
    fontFamily: 'Poppins',
    color: "#666",
  },
  
  // New styles for loading, error and empty states
  headerContent: {
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Poppins',
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  errorText: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 16,
    fontFamily: 'Poppins',
    color: "#666",
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: sd.colors.blue,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Poppins',
    color: "#666",
    textAlign: 'center',
  },
  serviceInfoCard: {
    backgroundColor: '#f0f7ff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: sd.colors.blue,
  },
  serviceTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: sd.colors.blue,
  },
  serviceCategory: {
    fontSize: 14,
    fontFamily: 'Poppins',
    color: '#666',
    marginTop: 2,
  },
});

export default SearchForAppointment;
