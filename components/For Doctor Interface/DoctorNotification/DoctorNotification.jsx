import React, { useState, useEffect, useCallback } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
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
import { SafeAreaView } from "react-native-safe-area-context";
import sd from "../../../utils/styleDictionary";
import { useUser } from "../../../UserContext";

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

const { width } = Dimensions.get('window');

const DoctorNotifications = () => {
  const { user, updateUnreadNotificationsCount } = useUser();
  const navigation = useNavigation();
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
      console.log(`Fetching notifications for doctor: ${user._id}`);

      // Make the request with proper headers
      const response = await axios.get(`${ip.address}/api/doctor/one/${user._id}`, config);
      
      if (response.data && response.data.doctor.notifications) {
        const sortedNotifications = response.data.doctor.notifications.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        // Enhance notifications with additional details
        const enhancedNotifs = await enhanceNotifications(sortedNotifications);
        setNotifications(enhancedNotifs);
        
        // Count unread notifications and update context
        const unreadCount = enhancedNotifs.filter(n => !n.isRead).length;
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

      // If notification wasn't already read, update count
      if (!notification.isRead && typeof updateUnreadNotificationsCount === 'function') {
        updateUnreadNotificationsCount(prev => Math.max(0, prev - 1));
      }

      // API call to mark notification as read
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

  const handleImagePress = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsImageModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setActiveImageIndex(0);
  };

  const closeImageModal = () => {
    setIsImageModalVisible(false);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
  }, []);

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
      marginBottom: 12,
      textAlign: 'center',
      color: sd.colors.blue,
      marginTop: 16,
    },
    notificationItem: {
      flexDirection: 'row',
      backgroundColor: 'white',
      padding: 16,
      marginBottom: 1,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
      alignItems: 'flex-start',
    },
    unreadNotification: {
      backgroundColor: '#f0f7ff',
    },
    notificationIconContainer: {
      position: 'relative',
      marginRight: 16,
      marginTop: 4,
    },
    notificationIcon: {
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
    notificationHeadline: {
      fontSize: 15,
      fontFamily: sd.fonts.semiBold,
      color: '#333',
      marginBottom: 4,
    },
    notificationMessage: {
      fontSize: 14,
      fontFamily: sd.fonts.regular,
      color: '#333',
      marginBottom: 8,
    },
    unreadText: {
      fontFamily: sd.fonts.semiBold,
      color: '#000',
    },
    thumbnailContainer: {
      position: 'relative',
      marginBottom: 8,
      width: 120,
      height: 80,
      borderRadius: 8,
      // overflow: 'hidden',
    },
    notificationThumbnail: {
      width: '100%',
      height: '100%',
    },
    moreImagesIndicator: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderTopLeftRadius: 8,
    },
    moreImagesText: {
      color: 'white',
      fontSize: 12,
      fontFamily: sd.fonts.medium,
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
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: '90%',
      ...sd.shadows.large,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    modalIcon: {
      backgroundColor: '#f0f7ff',
      padding: 12,
      borderRadius: 24,
      marginRight: 16,
    },
    modalTitle: {
      flex: 1,
      fontSize: 18,
      fontFamily: sd.fonts.semiBold,
      color: sd.colors.blue,
    },
    modalCloseButton: {
      padding: 8,
    },
    modalScrollContent: {
      padding: 20,
      maxHeight: 300,
    },
    imagesContainer: {
      width: '100%',
      height: width * 0.6, // Maintain aspect ratio
    },
    imageSlide: {
      width: width,
      height: width * 0.6,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalImage: {
      width: width,
      height: width * 0.6,
      resizeMode: 'cover',
    },
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 10,
      left: 0,
      right: 0,
    },
    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(255,255,255,0.5)',
      margin: 3,
    },
    activePaginationDot: {
      backgroundColor: 'white',
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    modalMessage: {
      fontSize: 16,
      fontFamily: sd.fonts.regular,
      color: '#333',
      lineHeight: 24,
      marginBottom: 16,
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
      margin: 20,
      borderRadius: 8,
      alignItems: 'center',
    },
    closeButtonText: {
      color: 'white',
      fontSize: 16,
      fontFamily: sd.fonts.semiBold,
    },
    // Full-screen image modal styles
    fullScreenModal: {
      margin: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    fullScreenImageContainer: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.9)',
    },
    fullScreenImage: {
      width: width,
      height: width,
      resizeMode: 'contain',
    },
    fullScreenCloseButton: {
      position: 'absolute',
      top: 40,
      right: 20,
      zIndex: 10,
      padding: 10,
    },
  });

export default DoctorNotifications;