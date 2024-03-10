import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, TouchableWithoutFeedback, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";
import { DoctorHomeStyles } from '../DoctorStyleSheet/DoctorCSS';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import DoctorNavigation from '../DoctorNavigation/DoctorNavigation';
import { useNavigation } from '@react-navigation/native';



const DoctorHeader = () => {
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('Upcoming');
    const navigation = useNavigation();
    console.log(activeTab);
    const handleNotification = () => {
      navigation.navigate('doctornotification')
    };
 
 
    return (
      <>

       
        <View style={DoctorHomeStyles.bluecont}> 
            <View style={DoctorHomeStyles.container2}>
            <Image
                source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD29ZbwcUoURx5JZQ0kEwp6y4_NmjEJhh2Z6OdKRkbUw&s" }}
                style={{ width: 50, height: 50, borderRadius: 50 }}
            />
            <View style={DoctorHomeStyles.container21}>
                <View style={DoctorHomeStyles.container211}>
                <Text style={{fontFamily: 'Poppins-SemiBold', fontSize: 18, }}>Dr. Analyn Santos</Text>
                </View>
                <View style={DoctorHomeStyles.container211}>
                  <Text style={{fontFamily: 'Poppins', fontSize: 12 }}> 
                  <FontAwesome name="circle" size={12} style={{color:'green'}} />  Active Now</Text>
                </View>
            </View>

            <TouchableOpacity style={DoctorHomeStyles.editButton} onPress={handleNotification}>
                <FontAwesome5 name="bell" size={25} style={{}}/>
            </TouchableOpacity>
            </View>
        </View>
      
  
   
      </>
    );
  };
  

export default DoctorHeader;

const styles = StyleSheet.create({
  
  scrollContainer: {
    backgroundColor: '#FFFFFF',
    flexGrow: 1,

  },



});
