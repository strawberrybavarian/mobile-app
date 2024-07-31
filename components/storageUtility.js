// storageUtility.js

import * as SecureStore from 'expo-secure-store';
import localForage from 'localforage';
import { Platform } from 'react-native';

const storeData = async (key, value) => {
  if (Platform.OS === 'web') {
    try {
      await localForage.setItem(key, value);
    } catch (error) {
      console.error("Error storing data on web: ", error);
    }
  } else {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error("Error storing data on mobile: ", error);
    }
  }
};

const getData = async (key) => {
  if (Platform.OS === 'web') {
    try {
      return await localForage.getItem(key);
    } catch (error) {
      console.error("Error getting data from web: ", error);
    }
  } else {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error("Error getting data from mobile: ", error);
    }
  }
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

export { storeData, getData, deleteData };
