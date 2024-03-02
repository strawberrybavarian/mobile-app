import React, { useState } from 'react';
import { StyleSheet, Pressable, Animated, View } from 'react-native';
import Entypo from "@expo/vector-icons/Entypo";

const NavigationBar = ({ navigation }) => {
  const [scaleAnim1] = useState(new Animated.Value(1)); 
  const [scaleAnim2] = useState(new Animated.Value(1)); 
  const [scaleAnim3] = useState(new Animated.Value(1)); 
  const [scaleAnim4] = useState(new Animated.Value(1)); 

  const handlePressIn = (scaleAnim) => () => {
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

  const signinPageButton = () => {
    navigation.navigate('SigninPage');
  };

  return (
    <>
      <View style={styles.NavContainer}>
        <View style={styles.NavBar}>
        <Pressable onPressIn={handlePressIn(scaleAnim1)} onPressOut={handlePressOut(scaleAnim1)}>
          <Animated.View style={{ transform: [{ scale: scaleAnim1 }] }}>
            <Entypo name="home" size={20} />
          </Animated.View>
        </Pressable>

        <Pressable onPressIn={handlePressIn(scaleAnim2)} onPressOut={handlePressOut(scaleAnim2)}>
          <Animated.View style={{ transform: [{ scale: scaleAnim2 }] }}>
            <Entypo name="home" size={20} />
          </Animated.View>
        </Pressable>

        <Pressable onPressIn={handlePressIn(scaleAnim3)} onPressOut={handlePressOut(scaleAnim3)}>
          <Animated.View style={{ transform: [{ scale: scaleAnim3 }] }}>
            <Entypo name="home" size={20} />
          </Animated.View>
        </Pressable>

        <Pressable onPressIn={handlePressIn(scaleAnim4)} onPressOut={handlePressOut(scaleAnim4)}>
          <Animated.View style={{ transform: [{ scale: scaleAnim4 }] }}>
            <Entypo name="home" size={20} />
          </Animated.View>
        </Pressable>
        </View>
        
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 40,
    width: 270,
    textAlign: "center"
  },
  NavContainer: {
    position: 'absolute',
    alignItems: "center",
    width: '100%',
    bottom: 20,
  },
  NavBar: {
    flexDirection: 'row',
    width: '90%',
    height: 50,
    backgroundColor: '#e2e1e1',
    justifyContent: 'space-evenly',
    alignItems: "center",
    borderRadius: 100,
  },
  IconBehavior: {
    padding: 14,
  }
});

export default NavigationBar;
