import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import doctorImage1 from '../../assets/pictures/Doc.png';
import NavigationBar from '../Navigation/NavigationBar';
const StarRating = ({ rating, starSize = 16, starColor = "#FFD700" }) => {
  const totalStars = 5;
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <View style={{ flexDirection: "row" }}>
      {[...Array(filledStars)].map((_, index) => (
        <Text key={index} style={{ fontSize: starSize, color: starColor }}>★</Text>
      ))}
      {hasHalfStar && (
        <Text style={{ fontSize: starSize, color: starColor }}>☆</Text>
      )}
    </View>
  );
};

const DoctorCard = ({ doctorName, specialty, rating, image }) => (
  <View style={styles.doctorCardContainer}>
    <Image source={image} style={styles.doctorCardImage} />
    <View style={styles.doctorCardContent}>
      <Text style={styles.doctorCardName}>{doctorName}</Text>
      <Text style={styles.doctorCardSpecialty}>{specialty}</Text>
      <View style={styles.doctorCardRating}>
        <StarRating rating={rating} starSize={20} starColor="#FFD700" />
        <Text style={styles.doctorCardRatingText}>{rating.toFixed(1)}</Text>
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
      navigation.navigate('Appointment', { date: selectedDate, hour: selectedHour });
    } else {
      // Show an alert or error message
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

  return (
    <>
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.arrowButton}>
          <Text style={styles.arrowText}>&lt;</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Book Appointment</Text>
      </View>

      <DoctorCard
        doctorName="DRA Analyn Santos"
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
          textStyle={{ color: '#000' }}
          customDatesStyles={[
            {
              date: selectedDate,
              style: { backgroundColor: '#92a3fd' },
              textStyle: { color: 'white' },
            },
          ]}
          dayShape="square"
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
        onPress={handleNext}
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
  },
  arrowButton: {
    padding: 8,
  },
  arrowText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "#9dceff"
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    
  },
  subtitle: {
    fontSize: 14,
    marginTop: 16,
    marginBottom: 8,
    fontWeight: "bold"
  },
  calendarContainer: {
    backgroundColor: '#cfe2f3',
    borderRadius: 10,
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
    borderRadius: 10,
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
    borderRadius: 10,
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
    backgroundColor: '#cfe2f3',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  doctorCardImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  doctorCardContent: {
    flex: 1,
  },
  doctorCardName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  doctorCardSpecialty: {
    fontSize: 16,
    color: '#666',
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
