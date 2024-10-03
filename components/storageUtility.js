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

  // If the value doesn't exist, set a test value
  if (value === null) {
    const testValues = {
      userId: '66cf343bdf339bc59f0b7985',  // patient
      //userId: '66d14c4109ed9419b7f76b89',  // doctor
    };

    if (testValues[key]) {
      await storeData(key, testValues[key]);
      value = testValues[key];
      console.log(`Set test data for ${key}: ${value}`);
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

export { storeData, getData, deleteData };
