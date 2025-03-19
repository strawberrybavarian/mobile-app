import React, { useState, useEffect, useCallback } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Platform 
} from "react-native";
import ActionSheet from "react-native-actions-sheet";
import { getData } from "../../storageUtility";
import axios from "axios";
import { ip } from "../../../ContentExport";
import Modal from 'react-native-modal';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useUser } from "../../../UserContext";
import { format } from 'date-fns';
import { SafeAreaView } from "react-native-safe-area-context";

const Notifications = () => {
  const navigation = useNavigation();
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Fetch notifications when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [user])
  );
  
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      if (!user || !user._id) {
        console.log("No user ID available");
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`${ip.address}/api/notifications/patient/${user._id}`);
      
      if (response.data && response.data.notifications) {
        // Sort notifications by date (newest first)
        const sortedNotifications = response.data.notifications.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNotifications(sortedNotifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const markAsRead = async (notification) => {
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
      console.error("Error marking notification as read:", error);
    }
  };

  const handleNotificationAction = (notification) => {
    setIsModalVisible(false);
    
    // Handle navigation based on notification link or type
    if (notification.link) {
      // Parse the link to determine which screen to navigate to
      if (notification.link.includes('appointment')) {
        navigation.navigate('upcoming');
      } else if (notification.link.includes('doctor')) {
        navigation.navigate('doctorspecialty');
      } else {
        navigation.navigate('home');
      }
    }
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
      return format(date, 'MMM d, yyyy');
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome5 name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2F88D4" />
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#2F88D4"]}
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
                    onPress={() => markAsRead(notification)}
                  >
                    <View style={styles.notificationIconContainer}>
                      <FontAwesome5 
                        name={getNotificationIcon(notification.type)} 
                        size={24} 
                        color="#2F88D4"
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
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}
        onBackButtonPress={() => setIsModalVisible(false)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropTransitionOutTiming={0}
        style={styles.modal}
      >
        {selectedNotification && (
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <FontAwesome5 
                name={getNotificationIcon(selectedNotification.type)} 
                size={36} 
                color="#2F88D4"
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
              style={styles.actionButton}
              onPress={() => handleNotificationAction(selectedNotification)}
            >
              <Text style={styles.actionButtonText}>
                {selectedNotification.actionText || "View Details"}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
  },
  dateHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
    backgroundColor: '#f0f7ff',
    padding: 10,
    borderRadius: 20,
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    backgroundColor: '#f44336',
    borderRadius: 5,
  },
  notificationContent: {
    flex: 1,
    marginRight: 8,
  },
  notificationMessage: {
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
  },
  unreadText: {
    fontWeight: '600',
    color: '#000',
  },
  notificationTime: {
    fontSize: 12,
    color: '#888',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  modalIcon: {
    backgroundColor: '#f0f7ff',
    padding: 16,
    borderRadius: 40,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 16,
    lineHeight: 24,
  },
  modalTime: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#2F88D4',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#888',
    fontSize: 16,
  },
});

export default Notifications;