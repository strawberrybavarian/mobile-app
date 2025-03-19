import * as SecureStore from 'expo-secure-store';
import localForage from 'localforage';
import { Platform } from 'react-native';

// In storageUtility.js, improve error handling for SecureStore:

const storeData = async (key, value) => {
  if (Platform.OS === 'web') {
    try {
      await localForage.setItem(key, value);
    } catch (error) {
      console.error("Error storing data to web:", error);
    }
  } else {
    try {
      // For null or undefined values, store empty string
      const safeValue = value === null || value === undefined ? '' : String(value);
      await SecureStore.setItemAsync(key, safeValue);
      
      // Verify storage worked
      const verifyValue = await SecureStore.getItemAsync(key);
      if (verifyValue !== safeValue) {
        console.error("Storage verification failed for key:", key);
      }
    } catch (error) {
      console.error("Error storing data in SecureStore:", error);
    }
  }
};

const getData = async (key) => {
  let value = null;

  if (Platform.OS === 'web') {
    try {
      value = await localForage.getItem(key);
    } catch (error) {
      console.error("Error getting data from web: ", error);
    }
  } else {
    try {
      value = await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error("Error getting data from mobile: ", error);
    }
  }

  return value;
};

const deleteData = async (key) => {
  if (Platform.OS === 'web') {
    try {
      await localForage.removeItem(key);
    } catch (error) {
      console.error("Error deleting data from web: ", error);
    }
  } else {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error("Error deleting data from mobile: ", error);
    }
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


export { storeData , getData , deleteData , storeTheme, getStoredTheme};
