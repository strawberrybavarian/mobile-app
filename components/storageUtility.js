import * as SecureStore from 'expo-secure-store';
import localForage from 'localforage';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (key, value) => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error("Error storing data: ", error);
  }
};

const getData = async (key) => {
  try {
    const value = await SecureStore.getItemAsync(key);
    return value;
  } catch (error) {
    console.error("Error getting data: ", error);
    return null;
  }
};

const deleteData = async (key) => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error("Error deleting data: ", error);
  }
};

const storeTheme = async (isDarkMode) => {
  const themeValue = isDarkMode ? 'dark' : 'light';
  await storeData('theme', themeValue);
};

// Function to get the stored theme preference
const getStoredTheme = async () => {
  const storedTheme = await getData('theme');
  return storedTheme ? storedTheme : 'light'; // Default to light theme if none is set
};

export const clearAllData = async () => {
  try {
    // List of all keys to clear
    const keysToRemove = [
      'userId', 
      'userRole', 
      'token', 
      'firstName', 
      'lastName',
      'email',
      'profileImage',
      'passwordChanged',
      'user'
      // Add any other keys your app might be using
    ];
    
    await AsyncStorage.multiRemove(keysToRemove);
    console.log('All user data cleared from storage');
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
};

// At the top of your logout function
let isLogoutInProgress = false;

export const logout = async () => {
  if (isLogoutInProgress) {
    return true; // Prevent multiple simultaneous logout attempts
  }
  
  isLogoutInProgress = true;
  
  try {
    // existing logout code
  } catch (error) {
    // existing error handling
  } finally {
    isLogoutInProgress = false;
  }
};

// In the handleLogout success handler
export const handleLogoutSuccess = (success, navigation) => {
  if (success) {
    // Clear navigation history and any cached screens
    navigation.reset({
      index: 0,
      routes: [{ name: 'landingpage' }],
    });
    
    // Force any mounted components to refresh
    // You can use DevSettings if debugging in dev mode
    if (__DEV__) {
      const DevSettings = require('react-native').DevSettings;
      if (DevSettings.reload) DevSettings.reload();
    }
  }
};

export { storeData , getData , deleteData , storeTheme, getStoredTheme };
