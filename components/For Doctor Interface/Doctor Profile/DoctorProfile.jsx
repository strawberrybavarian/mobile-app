// DoctorMain.jsx
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Alert} from 'react-native';
import DoctorNavigation from '../DoctorNavigation/DoctorNavigation';
import DoctorAppointment from '../DoctorAppointment/DoctorAppointment';
import DoctorHome from '../DoctorHome/DoctorHome';
import DoctorHeader from '../DoctorHeader/DoctorHeader';
import { DoctorProfileStyles } from '../DoctorStyleSheet/DoctorCSS';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from '@react-navigation/native';
import { getData } from '../../storageUtility';
import { ip } from '../../../ContentExport';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DoctorProfile = () => {
  const [userId, setUserId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getData('userId');
        id ? setUserId(id) : console.log('User not found');
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserId();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchData = () => {
        if (userId) {
          axios.get(`${ip.address}/api/patient/api/onepatient/${userId}`)
            .then(res => {
              const { patient_firstName, patient_lastName } = res.data.thePatient;
              setFirstName(patient_firstName);
              setLastName(patient_lastName);
            })
            .catch(err => console.log(err));
        }
      };
      fetchData();
    }, [userId])
  );

  const logoutButton = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => navigation.navigate('landingpage') }
      ],
      { cancelable: true }
    );
  };

  //const profileFormEdit = () => navigation.navigate('profileform');

  const renderSettingOption = (icon, label, onPress = () => {}) => (
    <TouchableOpacity style={DoctorProfileStyles.settingItem} onPress={onPress}>
      <View style={DoctorProfileStyles.container31}>
        <FontAwesome name={icon} size={18} style={DoctorProfileStyles.iconStyle} />
        <Text style={DoctorProfileStyles.textProfile}>{label}</Text>
      </View>
      <Entypo name="chevron-thin-right" size={11} />
    </TouchableOpacity>
  );

  return (
    <>
    <SafeAreaView style = {{flex : 1, }}>
        <ScrollView style={styles.scrollContainer}>

          <View style={DoctorProfileStyles.container3}>
            <View style={DoctorProfileStyles.settings}>
              <Text style={{ fontFamily: 'Poppins', fontSize: 14 }}> Settings </Text>
              {renderSettingOption("user", "Account", () => navigation.navigate('viewdrprofile'))}
              {renderSettingOption("map", "Activity Logs")}
              {renderSettingOption("globe", "Others")}
            </View>
          </View>

          <View style={DoctorProfileStyles.container4}>
            <View style={DoctorProfileStyles.settings4}>
              <Text> Others </Text>
              {renderSettingOption("exclamation-circle", "About Us")}
              {renderSettingOption("headphones", "Customer Service")}
              {renderSettingOption("envelope-open-text", "Invite Other")}
              {renderSettingOption("sign-out", "Logout", logoutButton)}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    marginTop: 30,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 30,
  },
  profileInfo: {
    marginTop: 10,
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  profileDetails: {
    flexDirection: "column",
    marginLeft: 5,
  },
  nameText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
  },
  textJoin: {
    fontSize: 10,
    fontFamily: 'Poppins',
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  editButtonGradient: {
    width: 60,
    height: 25,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  textButton: {
    color: "white",
    fontSize: 12,
    fontFamily: 'Poppins',
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: 'white',
  },
  background: {
    paddingHorizontal: 10,
    height: "28%",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.20,
    shadowRadius: 20,
    backgroundColor: 'white',
  }
});
export default DoctorProfile;
