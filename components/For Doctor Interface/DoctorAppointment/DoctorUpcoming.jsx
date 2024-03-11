
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TouchableWithoutFeedback, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { UpcomingStyles } from '../DoctorStyleSheet/DoctorCSS';

//For Searching
const patientData = [
    { id: 'P001', name: 'Yasmin Asistido', specialization: 'Patient', status: 'Upcoming' },
    { id: 'P002', name: 'La Grande Dame', specialization: 'Patient', status: 'Upcoming' },
    { id: 'P003', name: 'Marina Summers', specialization: 'Patient', status: 'Upcoming' },
    { id: 'P004', name: 'Alicia Fox', specialization: 'Patient', status: 'Upcoming' },
    { id: 'P005', name: 'Jeong Jaehyun', specialization: 'Patient', status: 'Upcoming' },
  ];


const DoctorUpcoming = ({ showBanner }) => {
    const [search, setSearch] = useState('');
  
    const handleSearch = (query) => {
      setSearch(query);
    };
  
    const filteredPatients = patientData.filter((patient) =>
      patient.id.toLowerCase().includes(search.toLowerCase())
    );
  
    return (
      <>
       {showBanner && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>5</Text>
        </View>
      )}
          
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
                  {/* Image */}
                  <Image style={UpcomingStyles.filter1} contentFit="cover" source={require("../../../assets/pictures/Doc.png")} />
  
                  <View>
                    <Text style={UpcomingStyles.doctorName}>{patient.name}</Text>
                    <Text style={UpcomingStyles.patientid}>Patient ID: {patient.id}</Text>
                    <View style={UpcomingStyles.statusContainer}>
                      <Text style={UpcomingStyles.specialization}>{patient.specialization} | </Text>
                      <Text style={UpcomingStyles.status}>{patient.status}</Text>
                    </View>
                    <Text style={UpcomingStyles.specialization}>March 10, 2024 | 5:00 PM </Text> 
                  </View>
                </View>
  
                <View style={UpcomingStyles.buttonsContainer}>
                    <LinearGradient
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 2 }}
                        colors={["#92A3FD", "#9DCEFF"]}
                        style={{
                                width: 130,
                                padding: 10,
                                height: 45,
                                borderRadius: 40,
                                marginTop: 12,  
                            }}
                    >
                        {/* Review Status of the Patient */}
                        <TouchableOpacity
                            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}S
                        >
                            <Text style={{color: 'white', fontFamily: 'Poppins-SemiBold'}}>Review Status</Text>
                        </TouchableOpacity>

                    </LinearGradient>
                    {/* Accept */}
                    <TouchableOpacity style={UpcomingStyles.button}>
                            <Text style={{color: 'green', fontFamily: 'Poppins-SemiBold'}}>Accept</Text>
                    </TouchableOpacity>
                    {/* Cancel */}
                    <TouchableOpacity style={UpcomingStyles.button1}>
                            <Text style={{color: 'red', fontFamily: 'Poppins-SemiBold'}}>Cancel</Text>
                    </TouchableOpacity>
                </View>
              </View>
            ))}
          
  
     
  
      
      </>
    );
  };
  

export default DoctorUpcoming;

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

  banner: {
    backgroundColor: '#FF5733', 
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  bannerText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Poppins',
    fontWeight: 'bold',
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
