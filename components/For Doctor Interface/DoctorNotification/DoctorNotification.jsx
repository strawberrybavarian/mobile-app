import React, { useState, useEffect, useCallback } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  StatusBar
} from "react-native";
import { getData } from "../../storageUtility";
import axios from "axios";
import { ip } from "../../../ContentExport";
import Modal from 'react-native-modal';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { SafeAreaView } from "react-native-safe-area-context";
import sd from "../../../utils/styleDictionary";
import { useUser } from "@/UserContext";

const DoctorNotifications = () => {
  const { user } = useUser();
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Fetch notifications when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      // Get token from storage for authorization
      const token = await getData("authToken");
      if (!token) {
        console.error("No auth token available");
        setLoading(false);
        return;
      }

      // Set proper headers with authorization
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      };

      console.log("Fetching notifications for doctor");

      // Make the request with proper headers
      const response = await axios.get(`${ip.address}/api/doctor/one/${user._id}`, config);
      console.log("Response data:", response.data);
      if (response.data) {
        const sortedNotifications = response.data.doctor.notifications.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNotifications(sortedNotifications);
      } else {
        console.log("No notifications data in response:", response.data);
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleNotification = async (notification) => {
    try {
      if (!notification._id) {
        console.error('Notification ID is undefined');
        return;
      }

      // Update UI immediately for better UX
      setNotifications(prevNotifications =>
        prevNotifications.map(notif =>
          notif._id === notification._id ? { ...notif, isRead: true } : notif
        )
      );

      // API call to mark notification as read
      await axios.put(`${ip.address}/api/notifications/${notification._id}/read`);

      // Set selected notification and show modal
      setSelectedNotification(notification);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error handling notification:", error);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
  }, []);

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'appointment':
        return "calendar-alt";
      case 'message':
        return "comment-medical";
      case 'reminder':
        return "bell";
      case 'news':
        return "newspaper";
      default:
        return "info-circle";
    }
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
      }
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Group notifications by date
  const groupNotificationsByDate = () => {
    const grouped = {};

    notifications.forEach(notification => {
      const date = new Date(notification.createdAt).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(notification);
    });

    return grouped;
  };

  const groupedNotifications = groupNotificationsByDate();

  return (
    <>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.outerContainer}>
        <SafeAreaView style={styles.container} edges={['right', 'left', 'top']}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <FontAwesome5 name="arrow-left" size={20} color={sd.colors.blue} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Notifications</Text>
            <View style={{width: 46}} />
          </View>

          {loading && !refreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={sd.colors.blue} />
              <Text style={styles.loadingText}>Loading notifications...</Text>
            </View>
          ) : (
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollViewContent}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[sd.colors.blue]}
                  tintColor={sd.colors.blue}
                />
              }
            >
              {notifications.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <FontAwesome5 name="bell" size={60} color="#ccc" />
                  <Text style={styles.emptyText}>No notifications yet</Text>
                  <Text style={styles.emptySubtext}>
                    We'll notify you when something important happens
                  </Text>
                </View>
              ) : (
                Object.keys(groupedNotifications).map(date => (
                  <View key={date}>
                    <Text style={styles.dateHeader}>
                      {new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'short', 
                        day: 'numeric'
                      })}
                    </Text>

                    {groupedNotifications[date].map(notification => (
                      <TouchableOpacity
                        key={notification._id}
                        style={[
                          styles.notificationItem,
                          !notification.isRead && styles.unreadNotification
                        ]}
                        onPress={() => handleNotification(notification)}
                      >
                        <View style={styles.notificationIconContainer}>
                          <FontAwesome5 
                            name={getNotificationIcon(notification.type)} 
                            size={24} 
                            color={sd.colors.blue}
                            style={styles.notificationIcon}
                          />
                          {!notification.isRead && <View style={styles.unreadDot} />}
                        </View>

                        <View style={styles.notificationContent}>
                          <Text style={[
                            styles.notificationMessage,
                            !notification.isRead && styles.unreadText
                          ]}>
                            {notification.message}
                          </Text>
                          <Text style={styles.notificationTime}>
                            {getTimeAgo(notification.createdAt)}
                          </Text>
                        </View>

                        <FontAwesome5 name="chevron-right" size={16} color="#888" />
                      </TouchableOpacity>
                    ))}
                  </View>
                ))
              )}
            </ScrollView>
          )}

          {/* Notification Detail Modal */}
          {selectedNotification && (
            <Modal
              isVisible={isModalVisible}
              onBackdropPress={closeModal}
              onBackButtonPress={closeModal}
              animationIn="slideInUp"
              animationOut="slideOutDown"
              backdropTransitionOutTiming={0}
              style={styles.modal}
            >
              <View style={styles.modalContent}>
                <View style={styles.modalIcon}>
                  <FontAwesome5 
                    name={getNotificationIcon(selectedNotification.type)} 
                    size={36} 
                    color={sd.colors.blue}
                  />
                </View>

                <Text style={styles.modalTitle}>
                  {selectedNotification.title || "Notification"}
                </Text>

                <Text style={styles.modalMessage}>
                  {selectedNotification.message}
                </Text>

                <Text style={styles.modalTime}>
                  {new Date(selectedNotification.createdAt).toLocaleString()}
                </Text>

                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={closeModal}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          )}
        </SafeAreaView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
    outerContainer: {
      flex: 1,
      backgroundColor: 'white',
    },
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: 'white',
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
      ...sd.shadows.small,
    },
    backButton: {
      padding: 8,
    },
    headerTitle: {
      fontSize: 20,
      fontFamily: sd.fonts.semiBold,
      color: sd.colors.blue,
    },
    scrollView: {
      flex: 1,
      backgroundColor: '#f8f8f8',
    },
    scrollViewContent: {
      paddingBottom: 20,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      fontFamily: sd.fonts.regular,
      color: '#666',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
      marginTop: 80,
      backgroundColor: '#f8f8f8',
    },
    emptyText: {
      fontSize: 18,
      fontFamily: sd.fonts.semiBold,
      color: '#555',
      marginTop: 16,
    },
    emptySubtext: {
      fontSize: 14,
      fontFamily: sd.fonts.regular,
      color: '#888',
      textAlign: 'center',
      marginTop: 8,
    },
    dateHeader: {
      fontSize: 14,
      fontFamily: sd.fonts.semiBold,
      color: '#888',
      backgroundColor: '#f0f0f0',
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    notificationItem: {
      flexDirection: 'row',
      backgroundColor: 'white',
      padding: 16,
      marginBottom: 1,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
      alignItems: 'center',
    },
    unreadNotification: {
      backgroundColor: '#f0f7ff',
    },
    notificationIconContainer: {
      position: 'relative',
      marginRight: 16,
    },
    notificationIcon: {
      //backgroundColor: '#f0f7ff',
      padding: 10,
      borderRadius: 20,
    },
    unreadDot: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 10,
      height: 10,
      backgroundColor: sd.colors.red,
      borderRadius: 5,
    },
    notificationContent: {
      flex: 1,
      marginRight: 8,
    },
    notificationMessage: {
      fontSize: 15,
      fontFamily: sd.fonts.regular,
      color: '#333',
      marginBottom: 4,
    },
    unreadText: {
      fontFamily: sd.fonts.semiBold,
      color: '#000',
    },
    notificationTime: {
      fontSize: 12,
      fontFamily: sd.fonts.regular,
      color: '#888',
    },
    modal: {
      justifyContent: 'flex-end',
      margin: 0,
      
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 24,
      paddingBottom:60,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      alignItems: 'center',
      ...sd.shadows.large,
    },
    modalIcon: {
      backgroundColor: '#f0f7ff',
      padding: 16,
      borderRadius: 40,
      marginBottom: 16,
    },
    modalTitle: {
      fontSize: 20,
      fontFamily: sd.fonts.semiBold,
      marginBottom: 12,
      textAlign: 'center',
      color: sd.colors.blue,
    },
    modalMessage: {
      fontSize: 16,
      textAlign: 'center',
      color: '#555',
      marginBottom: 16,
      lineHeight: 24,
      fontFamily: sd.fonts.regular,
    },
    modalTime: {
      fontSize: 14,
      fontFamily: sd.fonts.regular,
      color: '#888',
      marginBottom: 24,
    },
    closeButton: {
      backgroundColor: sd.colors.blue,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 8,
      width: '100%',
      alignItems: 'center',
    },
    closeButtonText: {
      color: 'white',
      fontSize: 16,
      fontFamily: sd.fonts.semiBold,
    }
  });

export default DoctorNotifications;