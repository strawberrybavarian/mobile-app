import React, { useState, useEffect } from 'react';
import { StyleSheet, Pressable, Animated, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, } from '@react-navigation/native';
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const NavigationBar = () => {
  const navigation = useNavigation();
  const route = useRoute();

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
            onPress={() => navigateTo('doctorspecialty')}
            onPressIn={handlePressIn(scaleAnim1)}
            onPressOut={handlePressOut(scaleAnim1)}
          >
            <Animated.View style={{ transform: [{ scale: scaleAnim1 }] }}>
              <View style={styles.IconBehavior}>
                <Entypo 
                  style={{ color: route.name === 'doctorspecialty' ? '#92A3FD' : '#98A3B3' }} 
                  name="home"
                  size={20}
                />
                <Text
                  style={[
                    styles.texts,
                    {color: route.name === 'doctorspecialty' ? '#92A3FD' : '#98A3B3',fontFamily: 'Poppins',marginBottom: 2,
                    },
                  ]}
                >
                  Home
                </Text>
              </View>
            </Animated.View>
          </Pressable>

          <Pressable
        
            onPressIn={handlePressIn(scaleAnim2)}
            onPressOut={handlePressOut(scaleAnim2)}
          >
            <Animated.View style={{ transform: [{ scale: scaleAnim2 }] }}>
              <View style={styles.IconBehavior}>
                <FontAwesome6
                  style={{ color: activeButton ? '#92A3FD' : '#98A3B3' }}
                  name="calendar-alt"
                  size={19}
                />
                <Text
                  style={[
                    styles.texts,
                    {
                      color: activeButton ? '#92A3FD' : '#98A3B3',
                      fontFamily: 'Poppins',
                    },
                  ]}
                >
                  Appointment
                </Text>
              </View>
            </Animated.View>
          </Pressable>

          <Pressable
            onPress={() => navigateTo('searchappointment')}
            onPressIn={handlePressIn(scaleAnim3)}
            onPressOut={handlePressOut(scaleAnim3)}
          >
            <Animated.View style={{ transform: [{ scale: scaleAnim3 }] }}>
              <View style={styles.IconBehavior}>
                <FontAwesome
                  style={{ color: route.name === 'searchappointment' ? '#92A3FD' : '#98A3B3' }}
                  name="user-md"
                  size={20}
                />
                <Text
                  style={[
                    styles.texts,
                    {
                      color: route.name === 'searchappointment' ? '#92A3FD' : '#98A3B3',
                      fontFamily: 'Poppins',
                    },
                  ]}
                >
                  Doctors
                </Text>
              </View>
            </Animated.View>
          </Pressable>

          <Pressable
            onPress={() => navigateTo('myprofilepage')}
            onPressIn={handlePressIn(scaleAnim4)}
            onPressOut={handlePressOut(scaleAnim4)}
          >
            <Animated.View style={{ transform: [{ scale: scaleAnim4 }] }}>
              <View style={styles.IconBehavior}>
                <FontAwesome6
                  style={{ color: route.name === 'myprofilepage' ? '#92A3FD' : '#98A3B3' }}
                  name="user"
                  size={20}
                />
                <Text
                  style={[
                    styles.texts,
                    {
                      color: route.name === 'myprofilepage' ? '#92A3FD' : '#98A3B3',
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
    height: 60,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    elevation: 50,
    shadowOffset: { width: 0, height: 50 },
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#f0eeeea2',
  },
  IconBehavior: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  texts: {
    fontSize: 9,
    marginTop: 2,
  },
});

export default NavigationBar;
