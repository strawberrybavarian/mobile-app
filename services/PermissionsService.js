import { Alert, Platform, Linking } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

/**
 * Request notification permissions with a custom explanation dialog
 * @returns {Promise<boolean>} Whether permission was granted
 */
export async function requestNotificationPermissions() {
  // Only proceed on physical devices
  if (!Device.isDevice) {
    Alert.alert(
      "Notifications not available", 
      "Notifications require a physical device to function."
    );
    return false;
  }

  // Check current permission status
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  
  // If permission already granted, return true
  if (existingStatus === 'granted') {
    return true;
  }
  
  // If denied previously, show custom explanation before requesting again
  if (existingStatus === 'denied') {
    if (Platform.OS === 'ios') {
      Alert.alert(
        "Enable Notifications",
        "To receive important updates about your appointments and care, please enable notifications in your device settings.",
        [
          { 
            text: "Cancel", 
            style: "cancel" 
          },
          { 
            text: "Open Settings", 
            onPress: () => Linking.openSettings() 
          }
        ]
      );
      return false;
    }
    
    // Android can show system dialog multiple times
    Alert.alert(
      "Notifications Permission",
      "MolinoCare needs notification permissions to alert you about appointments and important healthcare updates.",
      [
        { text: "No Thanks", style: "cancel" },
        { text: "Continue", onPress: async () => await requestPermission() }
      ]
    );
    return false;
  }
  return await requestPermission();
}

async function requestPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}