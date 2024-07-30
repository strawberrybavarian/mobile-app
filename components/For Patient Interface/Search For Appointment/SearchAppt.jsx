import React, { useState, useEffect } from "react";
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import doctorImage1 from '../../../assets/pictures/Doc.png';
import magnify from '../../../assets/pictures/magni.png';
import NavigationBar from '../Navigation/NavigationBar';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DoctorHomeStyles } from "../../For Doctor Interface/DoctorStyleSheet/DoctorCSS";
import axios from "axios";



return (
    <>
      <View style={styles.allSearch}>
        <View style={styles.arrowCont}>
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={() => navigation.goBack()}>
            <Entypo name="chevron-thin-left" style={styles.arrowText} size={11} />
          </TouchableOpacity>
        </View>
        <View style={styles.searchInputContainer}>
          <Image source={magnify} style={styles.magnifyIcon} />
          <TextInput
            style={[styles.searchInput]}
            placeholder="Search your Doctor"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
        </View>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ width: "100%", }}>
          <View style={styles.specialtyOvalContainer}>
            {renderSpecialtyOval("All")}
            {renderSpecialtyOval("General")}
            {uniqueSpecialties.map((specialty) => renderSpecialtyOval(specialty))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.container}>
        <View style={styles.appointmentBox}>
          <FlatList
            data={doctorFiltered}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>

      <View style={styles.navcontainer}>
        <NavigationBar />
      </View>

      <View style={{ marginTop: 70 }}></View>
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
  arrowButton: {
     
  },

  arrowCont:{
   
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  arrowText: {
    fontSize: 15,
    fontFamily: 'Poppins',
  
    color: "#9dceff",
  },
  allSearch: {


    flexDirection: "row",
    padding: 20,
    marginTop: 40,
   
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    marginLeft: 12,
    width:"90%",
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 14,
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
    width: '100%',
    height: 110,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    alignSelf: 'center',
  },
  appointmentBox:{
    width: '100%',
    padding: 10,

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

export default SearchAppt