import React from 'react';
import { View, Text, StyleSheet, Image, TextInput, Button } from 'react-native';


const Upcoming = () => {
  const handleCancelBooking = () => {
    alert('Booking Cancelled!');
  };
  
  const handleReschedule = () => {
    alert('Appointment Rescheduled!');
  };
  return (
    <>
     <View style={styles.container}>
      <Text style={styles.title}> My Appointment </Text>
      <Image
          style={styles.magni}
          contentFit="cover"
          source={require("../assets/magni.png")}
        />
         <Image
          style={[styles.filter]}
          contentFit="cover"
          source={require("../assets/filter.png")}
        /> 
    </View>

    <View style={styles.container1}>
    <Image
        style={[styles.filter1]}
        contentFit="cover"
        source={require("../assets/Doc.png")}/> 
      <Text style={styles.doctorName}>Dr. Ana Santos</Text>
      <Text style={styles.specialization}>Neurosurgeon</Text>
      <Text style={styles.dateTime}>Date: February 28, 2024 | Time: 10:00 AM</Text>
      <View style={styles.buttonsContainer}>
        <Button title="Cancelled Booking" color="red" onPress={() => handleCancelBooking()} />
        <Button title="Reschedule" color="blue" onPress={() => handleReschedule()} />
      </View>
    </View>
    </>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection:'row',
    padding: 20,
  },
  container1: { 
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
    borderColor:'blue',
    borderWidth:1,
    borderRadius:10,
    marginBottom:50,
    height: '10%',
    
 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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
  marginBottom: 10,
  padding: 25,
  height: 40,
  width: 30,
  left: '80%',
  position: "absolute",
},
doctorName: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 10,
},
specialization: {
  fontSize: 16,
  marginBottom: 10,
},
dateTime: {
  fontSize: 14,
  marginBottom: 20,
},
});

export default Upcoming;