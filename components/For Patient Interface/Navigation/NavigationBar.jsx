import React, { useState, useEffect } from 'react';
import { StyleSheet, Pressable, Animated, View, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import sd from '../../../utils/styleDictionary';

const NavigationBar = (props) => {
  const [scaleAnim1] = useState(new Animated.Value(1));
  const [scaleAnim2] = useState(new Animated.Value(1));
  const [scaleAnim3] = useState(new Animated.Value(1));
  const [scaleAnim4] = useState(new Animated.Value(1));

  const { activeTab, onTabChange } = props;

  // Animations:
  const handlePressIn = (scaleAnim, buttonName) => () => {
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
            onPressIn={handlePressIn(scaleAnim2, 'Upcoming')}
            onPressOut={handlePressOut(scaleAnim2)}
          >
            <Animated.View style={{ transform: [{ scale: scaleAnim2 }] }}>
              <View style={styles.IconBehavior}>
                <FontAwesome6
                  style={{ color: activeTab === 'Upcoming' ? sd.colors.blue : '#98A3B3' }}
                  name="calendar-alt"
                  size={30}
                />
                <Text
                  style={[
                    styles.texts,
                    {
                      color: activeTab === 'Upcoming' ? sd.colors.blue : '#98A3B3',
                      fontFamily: 'Poppins',
                      marginBottom: 2,
                    },
                  ]}
                >
                  Appointment
                </Text>
              </View>
            </Animated.View>
          </Pressable>

          <Pressable
            onPressIn={handlePressIn(scaleAnim3, 'Doctor Specialty')}
            onPressOut={handlePressOut(scaleAnim3)}
          >
            <Animated.View style={{ transform: [{ scale: scaleAnim3 }] }}>
              <View style={styles.IconBehavior}>
                <FontAwesome
                  style={{ color: activeTab === 'Doctor Specialty' ? sd.colors.blue : '#98A3B3' }}
                  name="user-md"
                  size={30}
                />
                <Text
                  style={[
                    styles.texts,
                    {
                      color: activeTab === 'Doctor Specialty' ? sd.colors.blue : '#98A3B3',
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
            onPressIn={handlePressIn(scaleAnim4, 'My Profile')}
            onPressOut={handlePressOut(scaleAnim4)}
          >
            <Animated.View style={{ transform: [{ scale: scaleAnim4 }] }}>
              <View style={styles.IconBehavior}>
                <FontAwesome6
                  style={{ color: activeTab === 'My Profile' ? sd.colors.blue : '#98A3B3' }}
                  name="user"
                  size={30}
                />
                <Text
                  style={[
                    styles.texts,
                    {
                      color: activeTab === 'My Profile' ? sd.colors.blue : '#98A3B3',
                      fontFamily: 'Poppins',
                      fontSize: 9,
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
    elevation: 50,
    shadowOffset: { width: 0, height: 50 },
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
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

export default NavigationBar;