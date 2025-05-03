import React, { useState, useCallback } from "react";
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
} from "react-native";
import { ip } from "../../../ContentExport";
import Modal from 'react-native-modal';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useUser } from "../../../UserContext";
import { SafeAreaView } from "react-native-safe-area-context";
import sd from "../../../utils/styleDictionary";
import styles from './NotificationsCSS';
import axios from "axios";
// Import shared utilities
import { 
  stripHtmlTags, 
  getTimeAgo, 
  getNotificationIcon, 
  markNotificationAsRead,
  getImageUrl,
  groupNotificationsByDate,
  enhanceNotifications,
  getAuthConfig
} from "../../../services/NotificationUtility";

const PatientNotifications = () => {
  const navigation = useNavigation();
  const { user, updateUnreadNotificationsCount } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
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
      
      // Get authorized config
      const config = await getAuthConfig();
      
      console.log(`Fetching notifications for patient: ${user._id}`);
      
      // Make the request with proper headers
      const response = await axios.get(`${ip.address}/api/patient/api/onepatient/${user._id}`, config);
      
      // Check if response is valid
      if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
        console.error("Received HTML response instead of JSON");
        setNotifications([]);
        updateUnreadNotificationsCount(0); // Make sure we always update count
        return;
      }
      
      if (response.data && response.data.thePatient.notifications) {
        const sortedNotifications = response.data.thePatient.notifications.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        // Enhance notifications with additional details
        const enhancedNotifs = await enhanceNotifications(sortedNotifications);
        setNotifications(enhancedNotifs);
        
        // Count unread notifications and update context
        const unreadCount = enhancedNotifs.filter(n => !n.isRead).length;
        console.log(`Found ${unreadCount} unread notifications`); // Add this log
        if (typeof updateUnreadNotificationsCount === 'function') {
          updateUnreadNotificationsCount(unreadCount);
        }
      } else {
        console.log("No notifications data in response:", response.data);
        setNotifications([]);
        if (typeof updateUnreadNotificationsCount === 'function') {
          updateUnreadNotificationsCount(0);
        }
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
      if (typeof updateUnreadNotificationsCount === 'function') {
        updateUnreadNotificationsCount(0);
      }
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

      // Update UI immediately for responsiveness
      setNotifications(prevNotifications =>
        prevNotifications.map(notif =>
          notif._id === notification._id ? { ...notif, isRead: true } : notif
        )
      );

      // Use the utility function that now has the correct endpoint
      await markNotificationAsRead(notification._id);
      
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

  // Function to render an image with proper error handling
  const renderImage = (imageUrl, style, index = 0) => {
    if (!imageUrl) return null;
    const fullUrl = getImageUrl(imageUrl);
    
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

  const handleImagePress = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsImageModalVisible(true);
  };

  const closeImageModal = () => {
    setIsImageModalVisible(false);
  };

  const groupedNotifications = groupNotificationsByDate(notifications);

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
                        <TouchableOpacity 
                          style={styles.imageSlide}
                          onPress={() => handleImagePress(item)}
                        >
                          {renderImage(item, styles.modalImage, index)}
                        </TouchableOpacity>
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

          {/* Full-Screen Image Modal */}
          <Modal
            isVisible={isImageModalVisible}
            onBackdropPress={closeImageModal}
            onBackButtonPress={closeImageModal}
            animationIn="fadeIn"
            animationOut="fadeOut"
            backdropTransitionOutTiming={0}
            style={styles.fullScreenModal}
          >
            <View style={styles.fullScreenImageContainer}>
              <TouchableOpacity 
                style={styles.fullScreenCloseButton}
                onPress={closeImageModal}
              >
                <FontAwesome5 name="times" size={24} color="white" />
              </TouchableOpacity>
              
              {renderImage(selectedImage, styles.fullScreenImage)}
            </View>
          </Modal>
        </SafeAreaView>
      </View>
    </>
  );
};

export default PatientNotifications;