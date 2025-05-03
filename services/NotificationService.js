import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import axios from 'axios';
import { ip } from '../ContentExport';
import { getData } from '../components/storageUtility';

// Import shared utilities
import { getNotificationIcon } from './NotificationUtility';

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Register for push notifications and save token to backend
 * @returns {Object|null} Push token or null
 */
export async function registerForPushNotificationsAsync() {
  let token;

  if (!Device.isDevice) {
    console.warn('Push notifications only work on physical devices, not on simulators/emulators');
    return null;
  }

  // Check permissions first
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Failed to get permission for push notifications');
    return null;
  }

  try {
    // Get the token, using projectId from app.json via Constants
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    });
    
    console.log('Push token received:', token.data);
    
    // Important: Register this token with your backend
    const userId = await getData("userId");
    const userRole = await getData("userRole");
    
    if (userId && userRole && token.data) {
      await sendTokenToBackend(token.data, userId, userRole);
    }
    
    // Also configure for Android
    if (Platform.OS === 'android') {
      await configureAndroidNotificationChannel();
    }
    
    return token;
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
}

// Add this function for Android notification channel
async function configureAndroidNotificationChannel() {
  await Notifications.setNotificationChannelAsync('default', {
    name: 'Default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF231F7C',
  });
}

// Helper to send token to backend
async function sendTokenToBackend(tokenData, userId, userType) {
  try {
    const authToken = await getData('authToken');
    const config = {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    };

    await axios.post(`${ip.address}/api/notifications/register-token`, {
      userId,
      pushToken: tokenData,
      userType,
      deviceInfo: {
        platform: Platform.OS,
        deviceName: Device.deviceName,
        osVersion: Platform.Version
      }
    }, config);
    console.log('Push token registered with backend');
  } catch (error) {
    console.error('Failed to register push token with backend:', error);
  }
}

/**
 * Send a local notification
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {Object} data - Additional data to send with notification
 * @param {Object} trigger - Trigger conditions (defaults to immediate)
 */
export async function scheduleLocalNotification(title, body, data = {}, trigger = null) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger: trigger || { seconds: 1 },
  });
}

/**
 * Trigger a local notification
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {Object} data - Additional data for navigation
 */
export async function triggerLocalNotification(title, body, data = {}) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger: null, // Trigger immediately
  });
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Fetch notifications for a user
 * @param {string} userId - User ID
 * @param {string} userType - 'Patient' or 'Doctor'
 * @returns {Array} Array of notifications
 */
export async function fetchUserNotifications(userId, userType) {
  try {
    if (!userId) {
      console.error('No user ID provided to fetch notifications');
      return [];
    }

    const authToken = await getData('authToken');
    if (!authToken) {
      console.error('No auth token available');
      return [];
    }
    
    const config = {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    
    // Different endpoints for doctors and patients
    let url;
    if (userType === 'Doctor') {
      url = `${ip.address}/api/doctor/one/${userId}`;
    } else {
      url = `${ip.address}/api/patient/api/onepatient/${userId}`;
    }
    
    console.log(`Fetching notifications from: ${url}`);
    const response = await axios.get(url, config);
    
    // Extract notifications based on user type
    let notifications = [];
    if (userType === 'Doctor' && response.data && response.data.doctor) {
      notifications = response.data.doctor.notifications || [];
    } else if (response.data && response.data.thePatient) {
      notifications = response.data.thePatient.notifications || [];
    }
    
    // Sort notifications by date (newest first)
    const sortedNotifications = notifications.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    // Enhance notifications with additional data when needed
    const enhancedNotifications = await Promise.all(
      sortedNotifications.map(async (notification) => {
        if ((notification?.type === 'News' || notification?.type === 'news') && notification?.link) {
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
    
    return enhancedNotifications;
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return [];
  }
}

/**
 * Mark a notification as read
 * @param {string} notificationId - Notification ID
 * @returns {boolean} Success status
 */
export async function markNotificationAsRead(notificationId) {
  try {
    const authToken = await getData('authToken');
    if (!authToken) {
      console.error('No auth token available');
      return false;
    }
    
    const config = {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    };
    
    await axios.put(`${ip.address}/api/notifications/${notificationId}/read`, {}, config);
    return true;
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    return false;
  }
}

/**
 * Mark all notifications as read for a user
 * @param {string} userId - User ID
 * @param {string} userType - 'Patient' or 'Doctor'
 * @returns {boolean} Success status
 */
export async function markAllNotificationsAsRead(userId, userType) {
  try {
    const authToken = await getData('authToken');
    if (!authToken) {
      console.error('No auth token available');
      return false;
    }
    
    const config = {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    };
    
    await axios.put(`${ip.address}/api/notifications/read-all`, {
      userId,
      userType
    }, config);
    return true;
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
    return false;
  }
}

/**
 * Delete a notification
 * @param {string} notificationId - Notification ID
 * @returns {boolean} Success status
 */
export async function deleteNotification(notificationId) {
  try {
    const authToken = await getData('authToken');
    if (!authToken) {
      console.error('No auth token available');
      return false;
    }
    
    const config = {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    };
    
    await axios.delete(`${ip.address}/api/notifications/${notificationId}`, config);
    return true;
  } catch (error) {
    console.error('Failed to delete notification:', error);
    return false;
  }
}

/**
 * Set up a handler for notification responses (when user taps notification)
 * @param {React.RefObject} navigationRef - Reference to the navigation object
 * @returns {Function} Notification response listener
 */
export function setupNotificationResponseHandler(navigationRef) {
  return Notifications.addNotificationResponseReceivedListener(response => {
    const data = response.notification.request.content.data;
    
    if (data) {
      console.log('Notification tapped with data:', data);
      
      // Handle navigation based on notification type
      if (data.screen && navigationRef.current) {
        navigationRef.current.navigate(data.screen, data.params || {});
      }
      
      // Handle special notification types
      if (data.type === 'appointment' && data.appointmentId) {
        // Navigate to appointment details
        const screen = data.userType === 'Doctor' ? 'DoctorAppointmentDetails' : 'AppointmentDetails';
        if (navigationRef.current) {
          navigationRef.current.navigate(screen, { appointmentId: data.appointmentId });
        }
      } else if (data.type === 'message' && data.chatId) {
        // Navigate to chat screen
        const screen = data.userType === 'Doctor' ? 'DoctorChat' : 'PatientChat';
        if (navigationRef.current) {
          navigationRef.current.navigate(screen, { chatId: data.chatId });
        }
      } else if (data.type === 'news' && data.newsId) {
        // Navigate to news detail
        if (navigationRef.current) {
          navigationRef.current.navigate('NewsDetail', { newsId: data.newsId });
        }
      }
    }
  });
}

/**
 * Get full URL for an image
 * @param {string} imageUrl - Image path or URL
 * @returns {string} Full image URL
 */
export function getImageUrl(imageUrl) {
  if (!imageUrl) return null;
  
  return imageUrl.startsWith('http') 
    ? imageUrl 
    : `${ip.address}/${imageUrl}`;
}

/**
 * Format a timestamp as a relative time string
 * @param {string|Date} dateString - Date to format
 * @returns {string} Formatted relative time
 */
export function getTimeAgo(dateString) {
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
}

/**
 * Strip HTML tags from a string and decode HTML entities
 * @param {string} html - HTML string to process
 * @returns {string} Plain text without HTML
 */
export function stripHtmlTags(html) {
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
}

/**
 * Get appropriate icon name for notification type
 * @param {string} type - Notification type
 * @returns {string} FontAwesome icon name
 */


/**
 * Group notifications by date for display
 * @param {Array} notifications - Array of notification objects
 * @returns {Object} Grouped notifications by date
 */
export function groupNotificationsByDate(notifications) {
  const grouped = {};

  if (!notifications || !Array.isArray(notifications)) return grouped;

  notifications.forEach(notification => {
    const date = new Date(notification.createdAt).toDateString();
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(notification);
  });

  return grouped;
}

// Add badge count to app icon
export async function setBadgeCount(count) {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    await Notifications.setBadgeCountAsync(count);
  }
}

// Get number of unread notifications
export function getUnreadCount(notifications) {
  if (!notifications || !Array.isArray(notifications)) return 0;
  return notifications.filter(n => !n.isRead).length;
}

// Update badge count based on notifications
export async function updateBadgeFromNotifications(notifications) {
  const count = getUnreadCount(notifications);
  await setBadgeCount(count);
  return count;
}