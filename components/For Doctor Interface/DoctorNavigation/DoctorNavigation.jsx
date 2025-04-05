// DoctorNavigation.jsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, Pressable, Animated, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import sd from '../../../utils/styleDictionary';

const DoctorNavigation = ({ activeTab, onTabChange }) => {
  const navigation = useNavigation();
  const route = useRoute();
  console.log(route);

  const [scaleAnim1] = useState(new Animated.Value(1));
  const [scaleAnim2] = useState(new Animated.Value(1));
  const [scaleAnim3] = useState(new Animated.Value(1));
  const [scaleAnim4] = useState(new Animated.Value(1));
  const [activeButton, setActiveButton] = useState(null);

  //Animations:
  const handlePressIn = (scaleAnim, buttonName) => () => {
    setActiveButton(buttonName);

    Animated.spring(scaleAnim, {
      toValue: 1.2,
      useNativeDriver: true,
    }).start();

    onTabChange(buttonName);
  };

  const handlePressOut = (scaleAnim) => () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const navigateTo = (routeName) => {
    navigation.navigate(routeName);
  };

  return (
    <>
      <View style={styles.NavContainer}>
        <View style={styles.NavBar}>
          <Pressable
            onPressIn={handlePressIn(scaleAnim1, 'Home')}
            onPressOut={handlePressOut(scaleAnim1)}
          >
            <Animated.View style={{ transform: [{ scale: scaleAnim1 }] }}>
              <View style={styles.IconBehavior}>
                <Entypo
                  style={{ color: activeTab === 'Home' ? sd.colors.blue : '#98A3B3' }}
                  name="home"
                  size={30}
                />
                <Text
                  style={[
                    styles.texts,
                    {
                      color: activeTab === 'Home' ? sd.colors.blue : '#98A3B3',
                      fontFamily: 'Poppins',
                      marginBottom: 2,
                    },
                  ]}
                >
                  Home
                </Text>
              </View>
            </Animated.View>
          </Pressable>

          <Pressable
            onPressIn={handlePressIn(scaleAnim2, 'Appointment')}
            onPressOut={handlePressOut(scaleAnim2)}
          >
            <Animated.View style={{ transform: [{ scale: scaleAnim2 }] }}>
              <View style={styles.IconBehavior}>
                <FontAwesome6
                  style={{ color: activeTab === 'Appointment' ? sd.colors.blue : '#98A3B3' }}
                  name="calendar-alt"
                  size={30}
                />
                <Text
                  style={[
                    styles.texts,
                    {
                      color: activeTab === 'Appointment' ? sd.colors.blue : '#98A3B3',
                      fontFamily: 'Poppins',
                      marginBottom: 2,
                      fontFamily: 'Poppins',
                    },
                  ]}
                >
                  Appointment
                </Text>
              </View>
            </Animated.View>
          </Pressable>

          {/* <Pressable
            onPressIn={handlePressIn(scaleAnim3, 'My Patients')}
            onPressOut={handlePressOut(scaleAnim3)}
          >
            <Animated.View style={{ transform: [{ scale: scaleAnim3 }] }}>
              <View style={styles.IconBehavior}>
                <Entypo
                  style={{ color: activeTab === 'My Patients' ? sd.colors.blue : '#98A3B3' }}
                  name="users"
                  size={30}
                />
                <Text
                  style={[
                    styles.texts,
                    {
                      color: activeTab === 'My Patients' ? sd.colors.blue : '#98A3B3',
                      fontFamily: 'Poppins',
                      marginBottom: 2,
                    },
                  ]}
                >
                  My Patients
                </Text>
              </View>
            </Animated.View>
          </Pressable> */}

          <Pressable 
            onPressIn={handlePressIn(scaleAnim4, 'Profile')}
            onPressOut={handlePressOut(scaleAnim4)}
          >
            <Animated.View style={{ transform: [{ scale: scaleAnim4 }] }}>
              <View style={styles.IconBehavior}>
                <FontAwesome
                  style={{ color: activeTab === 'Profile' ? sd.colors.blue : '#98A3B3' }}
                  name="user-md"
                  size={30}
                />
                <Text
                  style={[
                    styles.texts,
                    {
                      color: activeTab === 'Profile' ? sd.colors.blue : '#98A3B3',
                      fontFamily: 'Poppins',
                    },
                  ]}
                >
                  Profile
                </Text>
              </View>
            </Animated.View>
          </Pressable>


        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  NavContainer: {
    position: 'relative',
    width: '100%',
    bottom: 0,
  },
  NavBar: {
    flexDirection: 'row',
    width: '100%',
    height: 80,
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
  
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    elevation: 5,
    shadowOffset: { width: 0, height: 50 },
    shadowColor: 'black',
    shadowOpacity: 0.20, 
    shadowRadius: 20, 
    borderWidth: 2,
    borderColor: '#f0eeeea2',
  },
  IconBehavior: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 7,
  },
  texts: {
    fontSize: 9,
    marginTop: 2,
  },
});

export default DoctorNavigation;
