import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, TouchableWithoutFeedback, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";
import { DoctorSpecialtyStyles, UpcomingStyles, tabStyles } from '../DoctorStyleSheet/DoctorCSS';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import DoctorNavigation from "../DoctorNavigation/DoctorNavigation"
import DoctorUpcoming from './DoctorUpcoming';
import UpperNavigation from './UpperNavigation';
import DoctorAcceptedPatient from './DoctorAcceptedPatient';

//For Searching
const patientData = [
    { id: 'P001', name: 'Yasmin Asistido', specialization: 'Patient', status: 'Upcoming' },
    { id: 'P002', name: 'La Grande Dame', specialization: 'Patient', status: 'Upcoming' },
    { id: 'P003', name: 'Marina Summers', specialization: 'Patient', status: 'Upcoming' },
    { id: 'P004', name: 'Alicia Fox', specialization: 'Patient', status: 'Upcoming' },
    { id: 'P005', name: 'Jeong Jaehyun', specialization: 'Patient', status: 'Upcoming' },
  ];

  const Tab = createMaterialTopTabNavigator();
const DoctorAppointment = ({ navigation }) => {
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('Upcoming');
    console.log(activeTab);
    const handleSearch = (query) => {
      setSearch(query);
    };
 
    const filteredPatients = patientData.filter((patient) =>
      patient.id.toLowerCase().includes(search.toLowerCase())
    );
  
    return (
      <>

        
        <ScrollView style={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.bluecont}> 
            <View style={styles.container2}>
            <Image
                source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD29ZbwcUoURx5JZQ0kEwp6y4_NmjEJhh2Z6OdKRkbUw&s" }}
                style={{ width: 50, height: 50, borderRadius: 50 }}
            />
            <View style={styles.container21}>
                <View style={styles.container211}>
                <Text style={{fontFamily: 'Poppins-SemiBold', fontSize: 18, }}>Dr. Analyn Santos</Text>
                </View>
                <View style={styles.container211}>
                <Text style={{fontFamily: 'Poppins', fontSize: 12 }}> 
                <FontAwesome name="circle" size={12} style={{color:'green'}} />  Active Now</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.editButton}>
                <FontAwesome5 name="bell" size={25} style={{}}/>
            </TouchableOpacity>
            </View>
        </View>
        <Text style={{ paddingLeft: 5, fontFamily: 'Poppins-SemiBold', fontSize: 20, paddingVertical: 20, marginLeft: 20, }}>Appointment</Text>
        <View style={styles.con3}>
                <UpperNavigation setActiveTab={setActiveTab} styles={{marginTop: 50}} />
                    {activeTab === 'Upcoming' ? (
                    <DoctorUpcoming />
                        ) : (
                    <DoctorAcceptedPatient />
                    )}
              
        </View>
  
          <View style={[DoctorSpecialtyStyles.container41, { paddingBottom: 50 }]}></View>
        </ScrollView>
        <DoctorNavigation />
      </>
    );
  };
  

export default DoctorAppointment;

const styles = StyleSheet.create({
  bluecont: {
    paddingTop: 15,
    paddingHorizontal: 15,
    width: '100%',
    height: 140,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    elevation: 2, 
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 5 }, 
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
    marginTop: - 20,
   
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
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
