import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Text, Alert, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getData } from '../../storageUtility';
import { ip } from '../../../ContentExport';
import axios from 'axios';
import sd from '../../../utils/styleDictionary';
import { useUser } from '../../../UserContext';

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

  const logout = () => {
    axios.post(`${ip.address}/api/logout`)
      .then((res) => {
        console.log(res);
        navigation.navigate('landingpage');
      })
      .catch((err) => console.error('Logout error:', err));
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = () => {
        if (userId) {
          axios.get(`${ip.address}/api/doctor/one/${userId}`)
            .then(res => {
              const { dr_firstName, dr_lastName } = res.data.doctor;
              setFirstName(dr_firstName);
              setLastName(dr_lastName);
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
        {
          text: 'Logout',
          onPress: async () => {
            try {
              console.log("Logging out...");
              logout();
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'An error occurred during logout.');
            }
          }
        }
      ],
      { cancelable: true }
    );
  };

  const renderSettingOption = (icon, label, onPress = () => {}) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.settingCard}>
        <Card.Content style={styles.settingCardContent}>
          <FontAwesome name={icon} size={20} style={styles.iconStyle} />
          <Text style={styles.textProfile}>{label}</Text>
          <Entypo name="chevron-right" size={20} color={sd.colors.blue} />
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Welcome, Dr. {firstName} {lastName}</Text>
          <Text style={styles.headerSubtitle}>Manage your account and settings</Text>
        </View>

        <View style={styles.settingsContainer}>
          {/* Account Management */}
          {renderSettingOption("user", "Account", () => navigation.navigate('viewdrprofile'))}

          {/* Schedule Management */}
          {renderSettingOption("calendar", "Schedule Management", () => navigation.navigate('dravailability'))}

          {/* Activity Logs */}
          {renderSettingOption("history", "Activity Logs", () => navigation.navigate('draudit'))}

          {/* Logout */}
          {renderSettingOption("sign-out", "Logout", logoutButton)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  headerContainer: {
    marginBottom: 20,
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: sd.colors.blue,
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: sd.fonts.bold,
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: '#e0e0e0',
  },
  settingsContainer: {
    marginTop: 10,
  },
  settingCard: {
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    ...sd.shadows.small,
  },
  settingCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconStyle: {
    color: sd.colors.blue,
    marginRight: 10,
  },
  textProfile: {
    flex: 1,
    fontFamily: sd.fonts.medium,
    fontSize: 16,
    color: sd.colors.textPrimary,
  },
});

export default DoctorProfile;