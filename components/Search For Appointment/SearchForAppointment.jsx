import React, { useState, useEffect } from "react";
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

// Import doctor images from assets
import doctorImage1 from '../../assets/pictures/Doc.png';
import magnify from '../../assets/pictures/magni.png';
import { ScrollView } from "react-native-web";
import NavigationBar from '../Navigation/NavigationBar';
const StarRating = ({ rating, starSize = 16, starColor = "#FFD700" }) => {
  const totalStars = 5;
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <View style={{ flexDirection: "row" }}>
      {[...Array(filledStars)].map((_, index) => (
        <Text key={index} style={{ fontSize: starSize, color: starColor }}>★</Text>
      ))}
      {hasHalfStar && (
        <Text style={{ fontSize: starSize, color: starColor }}>☆</Text>
      )}
    </View>
  );
};

// Dummy data for appointments
const dummyAppointments = [
  { id: "1", doctor: "DRA Analyn Santos", specialty: "Cardiologist", rating: 4.5, image: doctorImage1 },
  { id: "2", doctor: "DRA Analyn Santos", specialty: "Dermatologist", rating: 4.8, image: doctorImage1 },
  { id: "3", doctor: "DRA Analyn Santos", specialty: "Pediatrician", rating: 4.5, image: doctorImage1 }, // Adjusted rating
  // Add more appointment data as needed
];

const SearchForAppointment = () => {
  const [searchText, setSearchText] = useState("");
  const [appointments, setAppointments] = useState(dummyAppointments);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [uniqueSpecialties, setUniqueSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);

  useEffect(() => {
    const filteredData = appointments.filter((item) =>
      item.doctor.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredAppointments(filteredData);

    const specialties = Array.from(new Set(appointments.map(item => item.specialty)));
    setUniqueSpecialties(specialties);
  }, [searchText, appointments]);

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
    setSelectedSpecialty(specialty);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.appointmentItem}>
      <Image source={item.image} style={styles.doctorImage} />
      <View style={styles.textContainer}>
        <Text style={styles.doctorName}>{item.doctor}</Text>
        <Text style={styles.specialty}>{item.specialty}</Text>
        <View style={styles.ratingContainer}>
          <StarRating rating={item.rating} starSize={20} starColor="#FFD700" />
          <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
    <View style={styles.container}>
      <View style={styles.allSearch}>
        <TouchableOpacity style={styles.arrowButton}>
          <Text style={styles.arrowText}>&lt;</Text>
        </TouchableOpacity>
        <View style={styles.searchInputContainer}>
          <Image
            source={magnify}
            style={styles.magnifyIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
        </View>
      </View>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      <View style={styles.filterContainer} horizontal={true}>
        <View style={styles.specialtyOvalContainer}>
          {renderSpecialtyOval("All")}
          {renderSpecialtyOval("General")}
          {uniqueSpecialties.map((specialty) => renderSpecialtyOval(specialty))}
        </View>
      </View>
      </ScrollView>
      
      <View style={styles.appointmentBox}>
        <FlatList
          data={filteredAppointments}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    
    </View>
    <View style={styles.navcontainer}>
    <NavigationBar/>
      </View>
   </>
  );
};

const styles = StyleSheet.create({

  navcontainer:{
    position: 'absolute',
  bottom: 0,
  width: '100%',
  backgroundColor: 'yellow',
    
    
  },
  container: {

    padding: 10,
  },
  searchInput: {
    flex: 1,
    width: 240,
    height: '100%', // Adjust the height to fill the container
  },
  arrowButton: {
    padding: 8,
    marginRight: 10,
  },
  arrowText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: "#9dceff",
  },
  allSearch: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
    backgroundColor: "#e7e6e6",
    marginBottom: 16,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  magnifyIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  specialtyOvalContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  specialtyOval: {
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#92a3fd",
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
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
  appointmentBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  appointmentItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  doctorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  specialty: {
    fontSize: 16,
    color: "#666",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#666",
  },
});

export default SearchForAppointment;
