import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import DoctorNavigation from '../DoctorNavigation/DoctorNavigation';
import DoctorHeader from '../DoctorHeader/DoctorHeader';
import { styles } from './DoctorHomeStyles';


const DoctorHome = ({ navigation }) => {
  const [announcement, setAnnouncement] = useState('');
  const [announcementsList, setAnnouncementsList] = useState([]);

  const handlePostAnnouncement = () => {
    if (announcement.trim() !== '') {
      setAnnouncementsList((prevList) => [
        {
          id: Math.random().toString(),
          text: announcement,
          timestamp: new Date().toISOString(),
        },
        ...prevList,
      ]);
      setAnnouncement('');
    }
  };

  return (
    <>
      <Text style={{ paddingLeft: 5, fontFamily: 'Poppins-SemiBold', fontSize: 20, paddingVertical: 20, marginLeft: 20 }}>Post Announcement</Text>
      <View style={styles.container}>
        {/* Post Announcement Container */}
        <View style={styles.postContainer}>
          <TextInput
            style={styles.postInput}
            placeholder="Post Announcement Here!"
            value={announcement}
            onChangeText={(text) => setAnnouncement(text)}
          />
          <View style={styles.buttonPostContainer}>
            <TouchableOpacity style={styles.postButton} onPress={handlePostAnnouncement}>
              <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      

      {/* Display Announcements */}
      {announcementsList.map((item) => (
        <View key={item.id} style={styles.announcementContainer}>
          <Text style={styles.announcementText}>{item.text}</Text>
          <Text style={styles.announcementTimestamp}>{item.timestamp}</Text>
        </View>
      ))}
      </View>
    </>
  );
};

export default DoctorHome;


