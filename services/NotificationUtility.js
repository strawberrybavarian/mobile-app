import axios from 'axios';
import { ip } from '../ContentExport';
import { useUser } from '../UserContext';
import { getData } from '../components/storageUtility';

// Export existing utility functions
export const stripHtmlTags = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '');
};

export const getTimeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'just now';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  
  return new Date(dateString).toLocaleDateString();
};

export const getNotificationIcon = (type) => {
  switch(type?.toLowerCase()) {
    case 'appointment': return 'calendar-check';
    case 'message': return 'comment-dots';
    case 'system': return 'info-circle';
    case 'reminder': return 'clock';
    case 'test': return 'file-medical';
    case 'billing': return 'receipt';
    case 'results': return 'clipboard-check';
    default: return 'bell';
  }
};

// Add this new function to fetch notification count
export const fetchNotificationCount = async (userId) => {
  try {
    // Get the updateUnreadNotificationsCount function from context
    // We can't use hooks directly, so we need to import and access it differently
    const { updateUnreadNotificationsCount } = require('../UserContext').useUser._currentValue;
    
    if (!updateUnreadNotificationsCount) {
      console.error('updateUnreadNotificationsCount not available');
      return;
    }
    
    // First try to get from backend
    const config = await getAuthConfig();
    
    const response = await axios.get(
      `${ip.address}/api/patient/notifications/unread-count/${userId}`, 
      config
    );
    
    if (response.data && typeof response.data.count === 'number') {
      updateUnreadNotificationsCount(response.data.count);
      console.log(`Updated unread notification count: ${response.data.count}`);
      return response.data.count;
    } else {
      // Fallback: Count unread notifications manually
      const patientResponse = await axios.get(
        `${ip.address}/api/patient/api/onepatient/${userId}`, 
        config
      );
      
      if (patientResponse.data?.thePatient?.notifications) {
        const unreadCount = patientResponse.data.thePatient.notifications.filter(
          n => !n.isRead
        ).length;
        
        updateUnreadNotificationsCount(unreadCount);
        console.log(`Manually counted unread notifications: ${unreadCount}`);
        return unreadCount;
      }
    }
    
    // Default fallback
    updateUnreadNotificationsCount(0);
    return 0;
  } catch (error) {
    console.error('Error fetching notification count:', error);
    return 0;
  }
};

// Add this helper function to get auth config
export const getAuthConfig = async () => {
  const token = await getData('authToken');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    }
  };
};

// Add other existing utility functions
export const markNotificationAsRead = async (notificationId) => {
  try {
    const config = await getAuthConfig();
    await axios.post(`${ip.address}/api/notifications/mark-read/${notificationId}`, {}, config);
    return true;
  } catch (error) {
    // console.error('Error marking notification as read:', error);
    return false;
  }
};

export const markChatNotificationsAsRead = async (senderId, receiverId, userRole, senderType = null) => {
  try {
    // If senderId is null, this is a patient talking to the medical secretary
    const endpoint = `/api/notifications/mark-chat-read`;
    
    await axios.post(`${ip.address}${endpoint}`, { 
      senderId: senderId || 'staff', // Use 'staff' as default when null
      receiverId,
      userRole,
      senderType
    });
    
    return true;
  } catch (error) {
    // console.error('Error marking chat notifications as read:', error);
    return false;
  }
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // Check if it's a full URL already
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Otherwise, prepend the base URL
  return `${ip.address}/${imagePath}`;
};

export const groupNotificationsByDate = (notifications) => {
  const groups = {};
  
  notifications.forEach(notification => {
    const date = new Date(notification.createdAt).toDateString();
    
    if (!groups[date]) {
      groups[date] = [];
    }
    
    groups[date].push(notification);
  });
  
  return groups;
};

export const enhanceNotifications = async (notifications) => {
  return notifications.map(notification => ({
    ...notification,
    // Add any enhancement logic here if needed
  }));
};