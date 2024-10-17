import React, { useState, useEffect } from "react";
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
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

//   { id: "2", doctor: "Dr. Lalisa Manoban", specialty: "Dermatologist", rating: 4.8, image: doctorImage1 },
//   { id: "3", doctor: "Dr. Sasha Banks", specialty: "Pediatrician", rating: 4.5, image: doctorImage1 },
//   { id: "4", doctor: "Dr. Jennie Kim", specialty: "Neurologist", rating: 4.5, image: doctorImage1 },
//   { id: "5", doctor: "Dr. Vice Ganda", specialty: "Pediatrician", rating: 4.5, image: doctorImage1 },
//   { id: "6", doctor: "Dr. Fiona Dutirti", specialty: "Pediatrician", rating: 4.5, image: doctorImage1 },
// ];

const SearchForAppointment = ({ route }) => {
  const [searchText, setSearchText] = useState("");
  // const [appointments, setAppointments] = useState(dummyAppointments);
  const [allDoctorArray, setAllDoctorArray] = useState([]);
  const [doctorFiltered, setDoctorFiltered] = useState([]);
  // const [filteredAppointments, setFilteredAppointments] = useState([]);
  // const [uniqueSpecialties, setUniqueSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const { specpec } = route.params || {};
  console.log("specpec = " + specpec, typeof (specpec));

  const navigation = useNavigation();

  // Get all doctors
  
  useEffect(() => {
    axios.get(`${ip.address}/api/doctor/api/alldoctor`)
      .then((res) => {
        if (Array.isArray(res.data.theDoctor)) {
          setAllDoctorArray(res.data.theDoctor); // Set the response if it's an array
          console.log('Docs set:', res.data.theDoctor); // Log the array being set
        } else {
          console.error('Expected an array but got:', typeof res.data.theDoctor, res.data.theDoctor);
        }
      })
      .catch((err) => {
        console.log('error here');
      });
  }, []);

  // Filter based on params
  useEffect(() => {
    if( specpec == null ){
      setDoctorFiltered(allDoctorArray);
    }
    else{
    const filteredDoctors = allDoctorArray.filter(doctor => doctor.dr_specialty === specpec);
    setDoctorFiltered(filteredDoctors);
    console.log(filteredDoctors);
    }
  }, [allDoctorArray, specpec]);

  const bookAppointmentButton = (item) => {
    navigation.navigate('aboutdoctor', { item });
    console.log(item)
  };
  
  // For search
  useEffect(() => {
    const filteredData = allDoctorArray.filter((item) =>
      item.dr_firstName.toLowerCase().includes(searchText.toLowerCase()
    || item.dr_lastName.toLowerCase().includes(searchText.toLowerCase())
  )
    );
    setDoctorFiltered(filteredData);
  }, [searchText]);

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
    if(mappedSpecialty == 'All'){
      setDoctorFiltered(allDoctorArray)
    }
    else{
      const filteredDoctors = allDoctorArray.filter(doctor => doctor.dr_specialty === mappedSpecialty);
      setDoctorFiltered(filteredDoctors);
    }
  };

  // useEffect(() => {
  //   console.log(doctorFiltered)
  // }, [doctorFiltered])

  const renderItem = ({ item }) => {
    console.log('Rendering item: ', item);
  
    if (!item) return null;
  
    return (
      <TouchableOpacity style={styles.appointmentItem} onPress={() => bookAppointmentButton(item)}>
        <Image source={{uri: `${ip.address}/${item.dr_image}`}} style={styles.doctorImage} />
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
  

  return (
    <>
      <ScrollView
        backgroundColor={sd.colors.white}
      >
          <View style={styles.headerCont}>
              <Entypo name="chevron-thin-left" size={sd.fontSizes.large} color={sd.colors.blue} style={{flex:1}} onPress={()=>{navigation.goBack()}}/>
              <Text style= {styles.headerText}>
                {specpec ? specpec + ' Department' : 'All Doctors'}
              </Text>
              <View style = {{flex:1}}></View>
          </View>

        <ScrollView style={styles.container}>   
          <View style={styles.appointmentBox}>
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
              style={{ marginVertical: 10, marginTop: 20,  }}
              theme = {{colors: {outlineVariant: sd.colors.blue}}}
            />
            <FlatList
              data={doctorFiltered}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </ScrollView>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({

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
    //marginTop: 20,
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
    //height: 40,
    justifyContent: 'center',
    //marginLeft: 12,
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
    paddingRight: 20, // Add paddingRight here
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
    //width: '100%',
    height: 110,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 12,
    ...sd.shadows.large,
    alignSelf: 'center',
    //marginHorizontal: 20,
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
});

export default SearchForAppointment;
