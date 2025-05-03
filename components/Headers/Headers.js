import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Pressable, StyleSheet } from 'react-native';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import axios from 'axios';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import headerStyles from './HeaderStyle';

import { ip } from '../../ContentExport';
import { getData } from '../storageUtility';
import { useTheme } from 'react-native-paper';
import { useUser } from '../../UserContext';

// Add lastRefreshTimestamp as a prop
const Header3 = ({ name, imageUri, lastRefreshTimestamp }) => {
    const [search, setSearch] = useState('');
    const [userId, setUserId] = useState('');
    const [patient, setPatient] = useState(null); // Initialized to null
    const [activeTab, setActiveTab] = useState('Upcoming');
    const [image, setImage] = useState("images/014ef2f860e8e56b27d4a3267e0a193a.jpg");
    const [notifications, setNotifications] = useState([]);
    const [localUnreadCount, setLocalUnreadCount] = useState(0);
    const navigation = useNavigation();
    const { unreadNotificationsCount } = useUser();

    const handleNotification = () => {
      navigation.navigate('ptnnotification');
    };

    const theme = useTheme();
    const styles = headerStyles(theme);

    useEffect(() => {
      const fetchNotifications = async () => {
        if (!userId) {
          // Get userId if not already present
          const id = await getData('userId');
          if (id) {
            setUserId(id);
            fetchPatientNotifications(id);
          }
        } else {
          fetchPatientNotifications(userId);
        }
      };
      
      fetchNotifications();
    }, [userId]);

    const fetchPatientNotifications = async (patientId) => {
      try {
        const response = await axios.get(`${ip.address}/api/patient/api/onepatient/${patientId}`);
        if (response.data && response.data.thePatient) {
          const patientData = response.data.thePatient;
          
          // Sort notifications by creation time (newest first)
          const sortedNotifications = (patientData.notifications || [])
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          
          setNotifications(sortedNotifications);
          
          // Calculate unread count directly from notifications
          const unreadCount = sortedNotifications.filter(notif => !notif.isRead).length;
          setLocalUnreadCount(unreadCount);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    useFocusEffect(
      useCallback(() => {
        if (userId) {
          fetchPatientNotifications(userId);
        }
        
        return () => {
          // Cleanup if needed
        };
      }, [userId])
    );

    // Add this effect to refresh notifications when master refresh happens
    useEffect(() => {
      if (lastRefreshTimestamp > 0 && userId) {
        fetchPatientNotifications(userId);
      }
    }, [lastRefreshTimestamp, userId]);

    // Debugging outputs
    useEffect(() => {
      console.log("Header3 - localUnreadCount:", localUnreadCount);
      console.log("Header3 - unreadNotificationsCount:", unreadNotificationsCount);
      console.log("Header3 - Should show badge:", localUnreadCount > 0 || (typeof unreadNotificationsCount === 'number' && unreadNotificationsCount > 0));
    }, [localUnreadCount, unreadNotificationsCount]);

    return (
      <>
        <View style={styles.mainContainer}> 
          <View style={styles.wrapper}>
            
              <Image
                source={
                  imageUri 
                    ? { uri: `${ip.address}/${imageUri}` } 
                    : null  // Use a local image instead
                }
                style={{ width: 50, height: 50, borderRadius: 50 }}
              />
        

            <View style={styles.textCont}>
              <View style={styles.infoCont}>
                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 18, }}>
                  {name ? name : 'Loading...'}
                </Text>
              </View>

              <View style={styles.infoCont}>
                <Text style={{ fontFamily: 'Poppins', fontSize: 12 }}> 
                  Patient
                </Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.notificationButton}
              onPress={() => {
                navigation.navigate('ptnnotification');
              }}
            >
              <View style={styles.bellContainer}>
                <FontAwesome5 
                  name="bell" 
                  size={22} 
                  color="#333"
                />
                
                {/* Show badge when there are unread notifications */}
                {(localUnreadCount > 0 || (typeof unreadNotificationsCount === 'number' && unreadNotificationsCount > 0)) && (
                  <View style={styles.notificationBadge} />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
};

const styles = StyleSheet.create({
  notificationButton: {
    padding: 10,
    marginLeft: 'auto', // This will push it to the right
    zIndex: 2,
  },
  bellContainer: {
    position: 'relative',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 12,
    height: 12,
    backgroundColor: '#FF3B30',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    zIndex: 999,
    // Add shadow for better visibility
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30', // Brighter red for better visibility
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: 'white',
    zIndex: 10, // Ensure the badge is on top
    elevation: 5, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  simpleBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 5,
    width: 10,
    height: 10,
    zIndex: 10,
  },
  improvedBadge: {
    position: 'absolute',
    top: 0, // Position at top of button
    right: 0, // Position at right of button
    width: 16, // Make it larger
    height: 16, // Make it larger
    backgroundColor: 'red', // Bright red color
    borderRadius: 8, // Make it a circle
    borderWidth: 2,
    borderColor: 'white',
    zIndex: 10, // Higher z-index to ensure it's on top
    elevation: 5, // Increased elevation for Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
});

export default Header3;
