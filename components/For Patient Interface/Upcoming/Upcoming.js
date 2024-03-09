import React from 'react';
import { View, Text, StyleSheet, Image, TextInput, Button, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import NavigationBar from '../Navigation/NavigationBar';
import Home from './Home';

import Profile from './Profile';
import { LinearGradient } from "expo-linear-gradient";

const Upcoming = () => {

  const Stack = createNativeStackNavigator();
  const BottomTab = createMaterialBottomTabNavigator();
  const handleCancelBooking = () => {
    alert('Booking Cancelled!');
  };
  
  const handleReschedule = () => {
    alert('Appointment Rescheduled!');
  };
  return (
    <>

    <View style={{padding: 10}}>
    <View style={styles.container}>
      <Text style={styles.title}> My Appointment </Text>
      <Image
          style={styles.magni}
          contentFit="cover"
      
        />
         <Image
          style={[styles.filter]}
          contentFit="cover"
        
        /> 
    </View>

    <View style={styles.cont}>
        
      <View style={styles.container1}>
          <Image style={styles.filter1} contentFit="cover" source={require("../../../assets/pictures/Doc.png")}/> 
            <View>
              <View style={{marginTop: 5}}>
                <Text style={styles.doctorName}>Dr. Ana Santos</Text>
                <View style={styles.statusContainer}>
                  <Text style={styles.specialization}>Neurosurgeon | </Text>
                  <TouchableOpacity style={styles.status}>
                      <Text style={{color: '#E59500', fontFamily: 'Poppins', fontSize:11}}> Upcoming </Text>
                  </TouchableOpacity>
                </View>
              </View>
                <Text style={styles.dateTime}>Date: February 28, 2024 | Time: 10:00 AM</Text>
            </View>
      </View>

      <View style={styles.buttonsContainer}>
                <TouchableOpacity  style={styles.cancelButton} title="Cancelled Booking"  onPress={() => handleCancelBooking()}>
                   <Text style={styles.text1}>Cancel Booking</Text>
                </TouchableOpacity>

                <LinearGradient
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 2 }}
          colors={["#92A3FD", "#9DCEFF"]}
          style={{
            width: 150,
            padding: 10,
            height: 45,
            borderRadius: 40,
            marginTop: 12,  
          }}
        >
          <TouchableOpacity
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            onPress={handleReschedule}
          >
            <Text style={{color: 'white', fontFamily: 'Poppins-SemiBold'}}>Reschedule</Text>
          </TouchableOpacity>
        </LinearGradient>        
      </View>    
    
    
    <View>
            
            
    </View>

     

      

    </View>
    </View>


    <View style={styles.navcontainer}>
        <NavigationBar/>
    </View>

  

    </>
    
  );
};

const styles = StyleSheet.create({
  status:{
    backgroundColor: 'rgba(240, 182, 75, 0.30)',
    width: 90,
    height: 25,
    borderRadius: 4,
    justifyContent:'center',
    alignItems:'center',
    marginLeft: 5,
  },
  statusContainer:{
    flexDirection:'row'
  },
  text1:{
    color: 'red',
    fontFamily: 'Poppins-SemiBold'
  },
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
  navcontainer:{
    position: 'absolute',
    bottom: 0,
    width: '100%',
    },
  cancelButton:{
    padding: 10,
    height: 45,
    borderColor: "red",
    borderRadius: 40,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  buttonsContainer:{
    marginTop: 20,
   flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    borderTopWidth: 1,
    borderColor: 'rgba(158, 150, 150, .3)'
  },
  container: {
 
   
    alignItems: 'flex-start',
    flexDirection:'row',
    padding: 20,
  },
  container1: { 
 
    flexDirection: 'row',
 },
  title: {
    fontSize: 24,
    fontFamily:'Poppins-SemiBold',
    marginBottom: 10,
    padding: 10,

  },
  text: {
    fontSize: 16,
  },
  magni: {
    marginBottom: 10,
    padding: 25,
    height: 30,
    width: 30,
    right: '20%',
    position: "absolute",
},
filter: {
    marginBottom: 10,
    padding: 25,
    height: 30,
    width: 30,
    left: '80%',
    position: "absolute",
},
filter1: {


  height: 100,
  width: 100,
  borderRadius: 40,


},
doctorName: {
  fontSize: 20,
  fontFamily:'Poppins-SemiBold',
 
},
specialization: {
  fontSize: 14,
  fontFamily:'Poppins',
  marginBottom: 10,
},
dateTime: {
  fontSize: 12,
  marginBottom: 20,
},
});

export default Upcoming;