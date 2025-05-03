import { getData, storeData, deleteData } from '../components/storageUtility';

// Save user data for background tasks
export const storeUserData = async (userData) => {
  if (!userData) return;
  
  try {
    // Store user data as JSON string
    await storeData('user', JSON.stringify(userData));
    
    // Also store individual fields for easier access
    if (userData._id) await storeData('userId', userData._id);
    if (userData.email) await storeData('email', userData.email);
    if (userData.firstName) await storeData('firstName', userData.firstName);
    if (userData.lastName) await storeData('lastName', userData.lastName);
    if (userData.profileImage) await storeData('profileImage', userData.profileImage);
    
    console.log("User data stored successfully");
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

// Clear user data on logout
export const clearUserData = async () => {
  try {
    // Remove user data
    await deleteData('user');
    
    // Remove notification timestamps to reset notification tracking
    await deleteData('lastNotificationTimestamp');
    await deleteData('lastProcessedNotificationTimestamp');
    
    console.log("User data cleared successfully");
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};

// Get stored user data
export const getUserData = async () => {
  try {
    const userData = await getData('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};