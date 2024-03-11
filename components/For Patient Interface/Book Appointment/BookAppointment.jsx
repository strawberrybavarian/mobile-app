import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import doctorImage1 from '../../../assets/pictures/Doc.png'
import NavigationBar from '../Navigation/NavigationBar';
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const DoctorCard = ({ doctorName, specialty, rating, image }) => (
  <View style={styles.doctorCardContainer}>
    <Image source={image} style={styles.doctorCardImage} />
    <View style={styles.doctorCardContent}>
      <Text style={styles.doctorCardName}>{doctorName}</Text>
      <Text style={styles.doctorCardSpecialty}>{specialty}</Text>
      <View style={{flexDirection: 'row'}}>
      <FontAwesome5 name="thumbtack" size={12} style={styles.Icon} />
        <Text style={styles.doctorCardSpecialty1}>NU Hospital</Text>
      </View>
      
    </View>
  </View>
);

const BookAppointment = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const handleHourSelect = (hour) => {
    setSelectedHour(hour);
  };
  const handleNext = () => {
    if (selectedDate && selectedHour) {
      navigation.navigate('healthassess', { date: selectedDate, hour: selectedHour });
    } else {
    }
  };
  const formatHour = (hour) => {
    let period = hour >= 12 ? 'PM' : 'AM';
    if (hour > 12) {
      hour -= 12;
    } else if (hour === 0) {
      hour = 12;
    }
    return `${hour}:00 ${period}`;
  };
  const groupedHours = [6, 7, 8, 12, 13, 14].reduce((acc, hour, index, array) => {
    if (index % 3 === 0) {
      acc.push(array.slice(index, index + 3));
    }
    return acc;
  }, []);
  const backButton = () => {
    navigation.navigate('searchappointment')
  }

 

  const nextButton = () => {
    navigation.navigate('healthassess')
  }
  return (
    <>
    <ScrollView style={styles.container}>

    <View style={styles.header}>
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={backButton}
          >
            <Entypo name="chevron-thin-left" size={14} />
          </TouchableOpacity>
          <View style={{ justifyContent: 'center', width: "83%" }}>
            <Text style={styles.title}>Book Appointment</Text>
          </View>
    </View>

      <DoctorCard
        doctorName="Dr. Analyn Santos"
        specialty="Cardiologist"
        rating={4.5}
        image={doctorImage1}
      />

      <Text style={styles.subtitle}>Select a Date</Text>
      <View style={styles.calendarContainer}>
        <CalendarPicker 
          onDateChange={handleDateChange} 
          selectedDayColor="#92a3fd"
          selectedDayTextColor="white"
          todayBackgroundColor="transparent"
          todayTextStyle={{ color: '#000' }}
          textStyle={{ color: '#000', fontFamily:'Poppins' }}
          customDatesStyles={[
            {
              date: selectedDate,
              style: { backgroundColor: 'red' },
              textStyle: { color: 'white' },
            },
          ]}
          dayShape="circle"
          width={300}
          height={300}
          hideDayNames={true}
        />
      </View>

      <Text style={styles.subtitle}>Select Hour</Text>
      <View style={styles.hourContainer}>
        {groupedHours.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.rowContainer}>
            {row.map((hour) => (
              <TouchableOpacity 
                key={hour} 
                style={[
                  styles.hourOval, 
                  selectedHour === hour && styles.selectedHour 
                ]}
                onPress={() => handleHourSelect(hour)}
              >
                <Text style={[
                  styles.hourText, 
                  selectedHour === hour && styles.selectedHourText,
                  styles.boldText,
                ]}>
                  {formatHour(hour)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.nextButton} 
        onPress={nextButton}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
                <NavigationBar/>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,

  },
  arrowButton: {
    padding: 10,
  },
  arrowText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "#9dceff"
  },
  title: {
    fontSize: 20,
    fontFamily:'Poppins-SemiBold',
    textAlign: 'center',
   
  },
  subtitle: {
    fontSize: 14,
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 5,
    fontFamily: 'Poppins-SemiBold'
  },
  calendarContainer: {
    backgroundColor: 'rgba(146, 163, 253, 0.10)',
    borderRadius: 20,
    padding: 10,
    marginTop: 10,
    width: '100%',
  },
  hourContainer: {
    marginTop: 8,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hourOval: {
    marginLeft: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: '#9dceff',
    borderRadius: 20,
    alignItems: "center",
    flexDirection: "row",
    borderStyle: "solid",
    flex: 1,
    marginVertical: 5,
  },
  selectedHour: {
    backgroundColor: '#92a3fd',
  },
  hourText: {
    color: '#92a3fd',
    fontSize: 12,
  },
  selectedHourText: {
    color: '#fff',
  },
  boldText: {
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#9dceff',
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 16,
  },
  nextButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // DoctorCard styles
  doctorCardContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(146, 163, 253, 0.10)',
    padding: 16,
    borderRadius: 20,
    marginTop: 26,
  },
  doctorCardImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  doctorCardContent: {

    justifyContent: 'center'
  },
  doctorCardName: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold'
  },
  Icon:{
    width: 20,
    
    justifyContent:'flex-start',
    marginTop: 2,
    color: '#666',
  },
  doctorCardSpecialty: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Poppins'
  },
  doctorCardSpecialty1: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Poppins',
    marginLeft: 3,
  },
  doctorCardRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  doctorCardRatingText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#666',
  },
});

export default BookAppointment;
