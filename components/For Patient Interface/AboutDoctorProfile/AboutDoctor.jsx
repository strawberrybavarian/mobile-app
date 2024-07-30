import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import doctorImage1 from '../../../assets/pictures/Doc.png'
import NavigationBar from '../Navigation/NavigationBar';
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { AboutDoctorStyle } from '../PatientStyleSheet/PatientCSS';
import { DoctorNotificationStyle } from '../../For Doctor Interface/DoctorStyleSheet/DoctorCSS';
import { useNavigation } from '@react-navigation/native';



const AboutDoctor = ({navigation, route}) => {
    
    //const navigation = useNavigation();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [specialty, setSpecialty] = useState('');

    const { item } = route.params || {};
    console.log(item)

    useEffect(() => {
        setFirstName(item.dr_firstName)
        setLastName(item.dr_lastName)

        let placeholder;
        switch (item.dr_specialty) {
            case 'PrimaryCare':
                placeholder = 'General';
                break;
            case 'Obgyn':
                placeholder = 'OB-GYN';
                break;
            case 'Pedia':
                placeholder = 'Pediatrics';
                break;
            case 'Cardio':
                placeholder = 'Cardiology';
                break;
            case 'Opthal':
                placeholder = 'Eye & Vision';
                break;
            case 'Derma':
                placeholder = 'Dermatology';
                break;
            case 'Neuro':
                placeholder = 'Neurology';
                break;
            case 'InternalMed':
                placeholder = 'Gastroenterology';
                break;
        }
        setSpecialty(placeholder)
    },[])

    const backButton = () => {
        navigation.goBack()
      }

  const nextButton = () => {
    navigation.navigate('bookappointment', {item})
  }
  return (
    <>
        <ScrollView style={AboutDoctorStyle.scrollContainer}>
            {/* Header */}
            <View style={AboutDoctorStyle.header}>
                <TouchableOpacity
                    style={DoctorNotificationStyle.arrowButton}
                    onPress={backButton}>
                    <Entypo name="chevron-thin-left" size={14} />
                </TouchableOpacity>
                <View style={{ justifyContent: 'center', width: "83%" }}>
                    <Text style={DoctorNotificationStyle.title}>About this Doctor</Text>
                </View>
            </View>
            
            {/* Main Container */}
            <View style={AboutDoctorStyle.mainContainer}>

                <View style={AboutDoctorStyle.containerCard}>
                    <View style={AboutDoctorStyle.doctorContainer}>
                        <Image source={doctorImage1} style={AboutDoctorStyle.doctorImage} />
                        <Text style={{fontFamily:'Poppins-SemiBold', fontSize: 20, marginTop: 5,}}>Dr. {firstName} {lastName}</Text>
                        <Text style={{fontFamily:'Poppins', fontSize: 12,}}>{specialty}</Text>
                    </View>

                    <View style={AboutDoctorStyle.profileDoctorContainer}>
                        <Text style={{fontFamily:'Poppins-SemiBold', fontSize: 20,}}>Profile</Text>
                        <Text style={{fontFamily:'Poppins', fontSize: 14, textAlign: 'justify' }}>Ako si Doktora Analyn, ang goddessa, hottiana bratzy ng pasay city at ganda lang ambag sa lipunan kasi wala lang ganda ko lang beh lorem ipsum keme keme shonget mo sis koh</Text>
                    </View>

                    <View style={AboutDoctorStyle.profileDoctorContainer}>
                        <Text style={{fontFamily:'Poppins-SemiBold', fontSize: 20,}}>Announcements</Text>
                        <Text style={{fontFamily:'Poppins', fontSize: 14, textAlign: 'justify' }}>Available only monday, tuesday, 7 days a week</Text>

                    </View>

                    <View style={[AboutDoctorStyle.profileDoctorContainer,{paddingBottom:20}]}>
                        <Text style={{fontFamily:'Poppins-SemiBold', fontSize: 20,}}>Certifications/Award</Text>
                        <Text style={{fontFamily:'Poppins', fontSize: 14, textAlign: 'justify' }}>With High Tama sa Alak</Text>
                        <Text style={{fontFamily:'Poppins', fontSize: 14, textAlign: 'justify' }}>Summalangit nawa ang kaluluwa</Text>
                        <Text style={{fontFamily:'Poppins', fontSize: 14, textAlign: 'justify' }}>Best in English</Text>
                        <Text style={{fontFamily:'Poppins', fontSize: 14, textAlign: 'justify' }}>Best in Math</Text>
                        <Text style={{fontFamily:'Poppins', fontSize: 14, textAlign: 'justify' }}>Best in Chemistry</Text>
                        <Text style={{fontFamily:'Poppins', fontSize: 14, textAlign: 'justify' }}>Best in Biology</Text>
                        <Text style={{fontFamily:'Poppins', fontSize: 14, textAlign: 'justify' }}>Best Fashion Taste</Text>
                        <Text style={{fontFamily:'Poppins', fontSize: 14, textAlign: 'justify' }}>Most Beautiful Human Being</Text>
                        <Text style={{fontFamily:'Poppins', fontSize: 14, textAlign: 'justify' }}>Gin Bilog Awardee 2024</Text>
                    </View>

                  
                </View>

              
              
              
            </View>
            
            <View style={{paddingBottom:100}}>

            </View>
           

        </ScrollView>
        <View style={AboutDoctorStyle.buttonContainer}>
                    <TouchableOpacity style={AboutDoctorStyle.bookButton} onPress={nextButton}>
                        <Text style={AboutDoctorStyle.buttonText}>Book Now!</Text>
                    </TouchableOpacity>
                </View>
        <NavigationBar/>
    </>
  );
};

  

export default AboutDoctor;
