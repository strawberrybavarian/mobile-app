import React, { useState, useEffect, useCallback } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Image,
  FlatList,
  Dimensions
} from "react-native";
import { getData } from "../../storageUtility";
import axios from "axios";
import { ip } from "../../../ContentExport";
import Modal from 'react-native-modal';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useUser } from "../../../UserContext";
import { format } from 'date-fns';
import { SafeAreaView } from "react-native-safe-area-context";
import sd from "../../../utils/styleDictionary";
// Import styles from external file
import styles from './NotificationsCSS';

// Function to strip HTML tags and decode entities
const stripHtmlTags = (html) => {
  if (!html) return '';
  
  // First replace common line break tags with newlines
  const withLineBreaks = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n');
  
  // Then strip all remaining HTML tags
  const withoutTags = withLineBreaks.replace(/<[^>]*>/g, '');
  
  // Decode HTML entities
  return withoutTags
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
};

const Notifications = () => {
  const navigation = useNavigation();
  const { user, updateUnreadNotificationsCount } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
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
      
      console.log(`Fetching notifications for patient: ${user._id}`);
      
      // Make the request with proper headers
      const response = await axios.get(`${ip.address}/api/patient/api/onepatient/${user._id}`, config);
      
      console.log("Response:", response.data.thePatient.notifications);
      
      // Check if response is HTML instead of JSON
      if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
        console.error("Received HTML response instead of JSON");
        setNotifications([]);
        return;
      }
      
      if (response.data && response.data.thePatient.notifications) {
        const sortedNotifications = response.data.thePatient.notifications.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        // For notifications with content references (like news or announcements)
        // we need to fetch the additional details
        const enhancedNotifications = await Promise.all(
          sortedNotifications.map(async (notification) => {
            if (notification.type === 'News' && notification.link) {
              try {
                // Extract news ID from link if available
                const newsIdMatch = notification.link.match(/\/news\/(\d+)/);
                const newsId = newsIdMatch ? newsIdMatch[1] : null;
                
                if (newsId) {
                  const newsResponse = await axios.get(`${ip.address}/api/news/api/getnews/${newsId}`, config);
                  if (newsResponse.data && newsResponse.data.news) {
                    return {
                      ...notification,
                      headline: newsResponse.data.news.headline,
                      images: newsResponse.data.news.images || [],
                      content: newsResponse.data.news.content
                    };
                  }
                }
              } catch (error) {
                console.error(`Error fetching news details for notification ${notification._id}:`, error);
              }
            }
            return notification;
          })
        );

        setNotifications(enhancedNotifications);
        
        // Count unread notifications and update context
        const unreadCount = enhancedNotifications.filter(n => !n.isRead).length;
        updateUnreadNotificationsCount(unreadCount);
      } else {
        console.log("No notifications data in response:", response.data);
        setNotifications([]);
        updateUnreadNotificationsCount(0);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
      updateUnreadNotificationsCount(0);
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

      // If the notification wasn't already read, update the unread count
      if (!notification.isRead) {
        updateUnreadNotificationsCount(prev => Math.max(0, prev - 1));
      }

      // API call to mark notification as read
      await axios.put(`${ip.address}/api/notifications/${notification._id}/read`);
      
      // Reset active image index when opening a new notification
      setActiveImageIndex(0);
      
      // Set selected notification and show modal
      setSelectedNotification(notification);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error handling notification:", error);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setActiveImageIndex(0);
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
      case 'announcement':
        return "bullhorn";
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

  // Function to render an image with proper error handling
  const renderImage = (imageUrl, style, index = 0) => {
    const fullUrl = imageUrl.startsWith('http') 
      ? imageUrl 
      : `${ip.address}/${imageUrl}`;
      
    return (
      <Image
        source={{ uri: fullUrl }}
        style={style}
        resizeMode="cover"
        defaultSource={null}
        onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
      />
    );
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
                          {notification.headline && (
                            <Text style={styles.notificationHeadline}>
                              {notification.headline}
                            </Text>
                          )}
                          
                          <Text style={[
                            styles.notificationMessage,
                            !notification.isRead && styles.unreadText
                          ]}>
                            {notification.message}
                          </Text>
                          
                          {notification.images && notification.images.length > 0 && (
                            <View style={styles.thumbnailContainer}>
                              {renderImage(notification.images[0], styles.notificationThumbnail)}
                              {notification.images.length > 1 && (
                                <View style={styles.moreImagesIndicator}>
                                  <Text style={styles.moreImagesText}>+{notification.images.length - 1}</Text>
                                </View>
                              )}
                            </View>
                          )}
                          
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
          
          {/* Enhanced Notification Detail Modal with Images Support */}
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
                <View style={styles.modalHeader}>
                  <View style={styles.modalIcon}>
                    <FontAwesome5 
                      name={getNotificationIcon(selectedNotification.type)} 
                      size={28} 
                      color={sd.colors.blue}
                    />
                  </View>
                  
                  <Text style={styles.modalTitle}>
                    {selectedNotification.headline || selectedNotification.title || "Notification"}
                  </Text>
                  
                  <TouchableOpacity onPress={closeModal} style={styles.modalCloseButton}>
                    <FontAwesome5 name="times" size={20} color="#757575" />
                  </TouchableOpacity>
                </View>
                
                {/* Images carousel if notification has images */}
                {selectedNotification.images && selectedNotification.images.length > 0 && (
                  <View style={styles.imagesContainer}>
                    <FlatList
                      data={selectedNotification.images}
                      horizontal
                      pagingEnabled
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(item, index) => index.toString()}
                      onMomentumScrollEnd={(e) => {
                        const contentOffset = e.nativeEvent.contentOffset;
                        const viewSize = e.nativeEvent.layoutMeasurement;
                        const pageNum = Math.floor(contentOffset.x / viewSize.width);
                        setActiveImageIndex(pageNum);
                      }}
                      renderItem={({item, index}) => (
                        <View style={styles.imageSlide}>
                          {renderImage(item, styles.modalImage, index)}
                        </View>
                      )}
                    />
                    
                    {/* Image pagination dots */}
                    {selectedNotification.images.length > 1 && (
                      <View style={styles.paginationContainer}>
                        {selectedNotification.images.map((_, index) => (
                          <View 
                            key={index}
                            style={[
                              styles.paginationDot,
                              index === activeImageIndex && styles.activePaginationDot
                            ]} 
                          />
                        ))}
                      </View>
                    )}
                  </View>
                )}
                
                <ScrollView style={styles.modalScrollContent}>
                  <Text style={styles.modalMessage}>
                    {stripHtmlTags(selectedNotification.content) || selectedNotification.message}
                  </Text>
                  
                  <Text style={styles.modalTime}>
                    {new Date(selectedNotification.createdAt).toLocaleString()}
                  </Text>
                </ScrollView>
                
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

export default Notifications;