import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, TouchableWithoutFeedback, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";
import { DoctorSpecialtyStyles, UpcomingStyles } from '../DoctorStyleSheet/DoctorCSS';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import DoctorNavigation from "../DoctorNavigation/DoctorNavigation"
//For Searching
const patientData = [
    { id: 'P012', name: 'Nymphia Wind', specialization: 'Banana', status: 'Accepted' },
    
    ,
  ];


const DoctorAcceptedPatient = ({ navigation }) => {
    const [search, setSearch] = useState('');
  
    const handleSearch = (query) => {
      setSearch(query);
    };
  
    const filteredPatients = patientData.filter((patient) =>
      patient.id.toLowerCase().includes(search.toLowerCase())
    );
  
    return (
      <>
      

      
            <View style={styles.searchContainer}>
              <FontAwesome5 name="search" style={{ marginRight: 5, color: '#DDDADA' }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by Patient ID"
                value={search}
                onChangeText={handleSearch}
              />
              <View style={styles.filterContainer}>
                <Text style={{ color: '#DDDADA' }}> | </Text>
                <TouchableWithoutFeedback>
                  <FontAwesome5
                    name="filter"
                    size={18}
                    style={{ marginTop: 3, color: '#92A3FD' }}
                  />
                </TouchableWithoutFeedback>
              </View>
            </View>
   
            {filteredPatients.map((patient) => (
              <View key={patient.id} style={UpcomingStyles.cont}>
                <View style={{ flexDirection: 'row' }}>
                  {/* Use appropriate image for the patient */}
                  <Image 
                    style={UpcomingStyles.filter1} 
                    resizeMode="cover" 
                    source={require("../../../assets/pictures/Doc.png")} 
                  />
  
                  <View>
                    <Text style={UpcomingStyles.doctorName}>{patient.name}</Text>
                    <Text style={UpcomingStyles.patientid}>Patient ID: {patient.id}</Text>
                    <View style={UpcomingStyles.statusContainer}>
                      <Text style={UpcomingStyles.specialization}>{patient.specialization} | </Text>
                      <Text style={UpcomingStyles.status2}>{patient.status}</Text>
                      
                      
                    </View>
                    <Text style={UpcomingStyles.specialization}>March 10, 2024 | 5:00 PM </Text>
                    
                  </View>
                </View>
  
                <View style={UpcomingStyles.buttonsContainer}>
                
                    
                    {/* Accept */}
                    <TouchableOpacity style={UpcomingStyles.button3}>
                            <Text style={{color: '#fd9217', fontFamily: 'Poppins-SemiBold'}}>Send Lab Result</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={UpcomingStyles.button4}>
                            <Text style={{color: '#1767fd', fontFamily: 'Poppins-SemiBold'}}>Send Rx</Text>
                    </TouchableOpacity>
                    {/* Cancel */}
                    <TouchableOpacity style={UpcomingStyles.button2}>
                            <Text style={{color: 'green', fontFamily: 'Poppins-SemiBold'}}>Complete</Text>
                    </TouchableOpacity>
                </View>
              </View>
            ))}
  
     
  
     
      </>
    );
  };
  

export default DoctorAcceptedPatient;

const styles = StyleSheet.create({
  bluecont: {
    paddingTop: 15,
    paddingHorizontal: 15,
    width: '100%',
    height: 140,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    elevation: 100, 
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 }, 
    shadowOpacity: 0.20, 
    shadowRadius: 20, 
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    marginTop: 30,
  },

  container2: {
    marginTop: 40,
    flexDirection: "row",
    height: 60,
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    alignItems: "center",
    marginBottom: 10, 
  },
  container21: {
    flex: 1,
    flexDirection: "column",
    padding: 5,
    marginLeft: 5,
  },
  container211: {
    flexDirection: "row",
    width: 200,
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "",

  },
  textButton: {
    color: "white",
    fontSize: 12,
    fontFamily: 'Poppins',
  },
  textJoin:{
    fontSize: 12,
    fontFamily: 'Poppins',
  },

  con3: {
    flexDirection: "column",
    marginTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#F2F4F7",
    marginVertical: 10,
    paddingLeft: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 15,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:'center',
    padding: 10,
  },
  container4:{
    marginTop: 10,
    flexDirection: 'column',
    padding: 10.
  },

  container41:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
  },

  specialtyButton:{
    backgroundColor: '#F9F5FF',
    width: '48%',
    height: 120,
    aspectRatio: 1,
    marginBottom: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 10,
    backgroundColor: '#FFFFFF',
  },
  container42:{

        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
   
  },
  images:{
    width: 90,
    height: 90, 
  
  },

  buttonText:{
    fontFamily:"Poppins",
    fontSize: 15,
    bottom: 0,
    textAlign: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
  },
  scrollContainer: {
    backgroundColor: '#FFFFFF',
    flexGrow: 1,

  },

//   for appointment containers
cont:{
    flexDirection:'column',
    padding: 10,
    backgroundColor: '#ffffff',
    width: '100%',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },

});
