import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Alert, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";
import NavigationBar from '../Navigation/NavigationBar';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { ip } from '../../../ContentExport';
import { useFocusEffect } from '@react-navigation/native';
import { getData } from '../../storageUtility';
import sd from '../../../utils/styleDictionary';

const MyProfile = ({ navigation }) => {
  const [userId, setUserId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [isAccountModalVisible, setAccountModalVisible] = useState(false);
  

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
          axios.get(`${ip.address}/patient/api/onepatient/${userId}`)
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

  const profileFormEdit = () => navigation.navigate('profileform');

  const renderSettingOption = (icon, label, onPress = () => {}) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingOptionContainer}>
        <FontAwesome name={icon} size={18} style={styles.iconStyle} />
        <Text style={styles.textProfile}>{label}</Text>
      </View>
      <Entypo name="chevron-thin-right" size={11} />
    </TouchableOpacity>
  );

  return (
    <>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.settingsContainer}>
          <Text style={styles.settingsTitle}> Settings </Text>
          {renderSettingOption("user", "Account")}
          {renderSettingOption("map", "Activity Logs")}
          {renderSettingOption("globe", "Others")}
        </View>

        <View style={styles.othersContainer}>
          <Text style={styles.othersTitle}> Others </Text>
          {renderSettingOption("exclamation-circle", "About Us")}
          {renderSettingOption("headphones", "Customer Service")}
          {renderSettingOption("users", "Invite Other")}
          {renderSettingOption("sign-out", "Logout", logoutButton)}
        </View>
      </ScrollView>
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
    marginTop: 50,
  },
  title: {
    fontFamily: sd.fonts.semiBold,
    fontSize: sd.fontSizes.xl,
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
    fontFamily: sd.fonts.semiBold,
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
    fontFamily: sd.fonts.semiBold,
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
  },
  settingsContainer: {
    marginTop: 30,
    flexDirection: "column",
    paddingLeft: 20,
    paddingRight: 20,
  },
  settingsTitle: {
    fontFamily: sd.fonts.semiBold,
    fontSize: sd.fontSizes.large,
  },
  othersContainer: {
    marginTop: 10,
    padding: 20,
  },
  othersTitle: {
    fontFamily: sd.fonts.semiBold,
    fontSize: sd.fontSizes.large,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
  },
  settingOptionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconStyle: {
    marginRight: 10,
    color: sd.colors.blue,
  },
  textProfile: {
    fontFamily: sd.fonts.light,
    color: sd.colors.textPrimary,
    fontSize: 14,
  },
});

export default MyProfile;
