import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native';
import { DoctorHomeStyles } from './DoctorHomeStyles';
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import sd from '../../../utils/styleDictionary';
import { Card, useTheme, Divider, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { ip } from '@/ContentExport';
import { getData } from '@/components/storageUtility';
import DoctorPosts from './DoctorHomeComponents/DoctorPosts';
import { useNavigation } from '@react-navigation/native';

const DoctorHome = ({ }) => {
  const [doctorId, setDoctorId] = useState(null);
  const [doctor, setDoctor] = useState({});

  const navigation = useNavigation();

  const [announcement, setAnnouncement] = useState('');
  const [announcementsList, setAnnouncementsList] = useState([]);

  const theme = useTheme();  
  const styles = DoctorHomeStyles(theme);

  // Fetch and set the doctor ID
  useEffect(() => {
    const fetchDoctorId = async () => {
      try {
        const id = await getData('userId'); // Ensure we fetch asynchronously
        console.log('Doctor ID fetched:', id);
        setDoctorId(id);
      } catch (err) {
        console.error('Error fetching doctor ID:', err);
      }
    };

    fetchDoctorId();
  }, []);

  // Fetch announcements when doctorId is available
  useEffect(() => {
    if (doctorId) {
      fetchAnnouncements(doctorId);
      fetchDoctor(doctorId);
    }
  }, [doctorId]);

  const refreshPosts = () => {
    fetchAnnouncements(doctorId);
  };

  const handlePostAnnouncement = () => {
    // Handle posting announcements logic
  };

  const fetchDoctor = (id) => {
    axios
      .get(`${ip.address}/api/doctor/one/${id}`)
      .then((res) => {
        console.log('Doctor fetched:', res.data);
        setDoctor(res.data?.doctor);
      })
      .catch((err) => console.error('Error fetching doctor:', err));
  };

  const fetchAnnouncements = (id) => {
    axios
      .get(`${ip.address}/api/doctor/api/post/getallpost/${id}`)
      .then((res) => {
        console.log('Announcements fetched:', res.data);
        setAnnouncementsList(res.data?.posts.reverse());
      })
      .catch((err) => console.error('Error fetching announcements:', err));
  };

  return (  
    <>
      <SafeAreaView 
        style={[styles.container, {padding: 0}]}
        edges={['left', 'right', 'bottom']}
        >
        <ScrollView 
          showsVerticalScrollIndicator={false}
        >
        {/* Status Card */}
        <View style={{ flex: 1 }}>  
          <Text style={styles.title}> Status</Text>
          <Card style={{ backgroundColor: theme.colors.surface, marginVertical: 10, marginHorizontal: 5 }}>
            <Card.Content style={styles.statusContainer}>
              <Text style={styles.statusLabel}>Patients</Text>
            </Card.Content> 
          </Card>  
        </View>  

        {/* Posts */}
        <View style={{ flex: 2, marginTop: 20 }}>
          <Text style={styles.title}> Announcements</Text>
          <Divider/>
          <DoctorPosts posts={announcementsList} doctor = {doctor} refreshPosts={ refreshPosts}/>
        </View>

       
      </ScrollView>

      <FAB
        icon="plus"
        size="medium"
        style={{
          position: 'absolute',
          right: 0,
          bottom: 80,
          margin: 16,
          backgroundColor: theme.colors.primary,
        }}
        onPress={() =>
          navigation.navigate('drpost', { 
            doctorId, 
            fetchPosts: () => fetchAnnouncements(doctorId) ,
            drimg: doctor?.dr_image,
          })
        }
      />
      
      </SafeAreaView>
    </>
  );
};

export default DoctorHome;
