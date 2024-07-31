import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, TouchableWithoutFeedback, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";
import NavigationBar from '../Navigation/NavigationBar';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { getData } from '../../storageUtility';

//For Searching

const DoctorSpecialty = ({ navigation }) => {
  const [search, setSearch] = useState('');
  // const [filternav, setFilterNav] = useState('')

  const specialtiesData = 
 [
  { id: 1, name: 'Primary Care & General Medicine', image: require('../../../assets/pictures/Stethoscope.png'), spec: 'PrimaryCare' },
  { id: 2, name: "OB-GYN's & Women's Health", image: require('../../../assets/pictures/FemaleReproductive.png'), spec: 'Obgyn' },
  { id: 3, name: 'Pediatrics', image: require('../../../assets/pictures/Pedia.png'), spec: 'Pedia'  }, 
  { id: 4, name: 'Heart & Cardiology', image: require('../../../assets/pictures/Heart.png'), spec: 'Cardio'  },
  { id: 5, name: 'Eye & Vision', image: require('../../../assets/pictures/Eye.png'), spec: 'Opthal'  },
  { id: 6, name: 'Skin & Dermatology', image: require('../../../assets/pictures/Dermatology.png'), spec: 'Derma'  },
  { id: 7, name: 'Brain & Nerves', image: require('../../../assets/pictures/Brain.png'), spec: 'Neuro'  },
  { id: 8, name: 'Stomach, Digestion &  Gastroenterology', image: require('../../../assets/pictures/Stomach.png'), spec: 'InternalMed'  },
 

];
   console.log(getData('userId'));

  const handleSearch = (serts) => {
    setSearch(serts);
  };

  const filteredSpecialties = specialtiesData.filter(specialty =>
    specialty.name.toLowerCase().includes(search.toLowerCase())
  );

  const appointmentButton = (spec) => {
    console.log(spec, typeof(spec))
    const specpec = spec
    navigation.navigate('searchappointment', { specpec })
  }

  return (
    <>
      <ScrollView style={styles.scrollContainer} >
      
      <View style={styles.bluecont}> 
        <View style={styles.container2}>
          <Image
            source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD29ZbwcUoURx5JZQ0kEwp6y4_NmjEJhh2Z6OdKRkbUw&s" }}
            style={{ width: 50, height: 50, borderRadius: 50 }}
          />
          <View style={styles.container21}>
            <View style={styles.container211}>
              <Text style={{fontFamily: 'Poppins', fontSize: 12, }}>Welcome!</Text>
            </View>
            <View style={styles.container211}>
              <Text style={{fontFamily: 'Poppins-SemiBold', fontSize: 17, }}>Analyn Santos</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.editButton}>
              <FontAwesome5 name="bell" size={25} style={{}}/>
          </TouchableOpacity>
        </View>

        <View style={styles.con3}>
            <View style={styles.searchContainer}>
                <FontAwesome5 name="search" style={{marginRight: 5, color: '#DDDADA'}}/>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search Specialty"
                  value={search}
                  onChangeText={handleSearch}
                />
              <View style={styles.filterContainer}>
              <Text style={{color: '#DDDADA'}}> | </Text>
                <TouchableWithoutFeedback >
                    
                  <FontAwesome5
                    name="filter"
                    size={18}
                    style={{marginTop: 3, color:'#92A3FD'}}
                  />
                </TouchableWithoutFeedback>
              </View>
            </View>
        </View>
      </View>

      <View>
        <View style={styles.container4}>
            <Text style={{paddingLeft: 20, marginLeft:3, fontFamily:'Poppins-SemiBold', fontSize: 18}}>Doctor Specialty</Text>
            <View style={styles.container41}>
            {filteredSpecialties.map((specialty, index) => (
              <TouchableOpacity onPress={() => appointmentButton(specialty.spec)} key={specialty.id} style={styles.specialtyButton}>
                <View style={styles.container42}>
                <Image source={specialty.image} style={styles.images} />
                  <Text style={styles.buttonText}>{specialty.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
        </View>
            <View style={[styles.container41,{paddingBottom:50}]}></View> 
        </View> 
      </View>
      </ScrollView>
    
      <NavigationBar/>
    </>
  )
}

export default DoctorSpecialty;

const styles = StyleSheet.create({
  bluecont: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    elevation: 5, 
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.08, 
    shadowRadius: 50, 
    backgroundColor: 'white'
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    marginTop: 50,
   
  },

  container2: {
    marginTop: 50,
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
    marginTop: -5,
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
    backgroundColor: '#ffffffff',
    
    flex: 1,

  },

});
