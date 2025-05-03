import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { getData } from '../components/storageUtility';
import { ip } from '../ContentExport';

export async function registerForPushNotificationsAsync() {
  let token = null;
  
// First, configure notification handler
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  if (Device.isDevice) {
    // Check existing permission status
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    
    console.log("Current notification permission status:", existingStatus);
    
    let finalStatus = existingStatus;
    
    // If not granted, request permission
    if (existingStatus !== 'granted') {
      console.log("Requesting notification permissions...");
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
      console.log("New permission status:", status);
    }
    
    // If permission was not granted, return null
    if (finalStatus !== 'granted') {
      console.log("Permission not granted for push notifications");
      return null;
    }
    
    try {
      console.log("Getting push token...");
      
      // Get project ID from Constants - VERY IMPORTANT
      // This is the projectId from your EAS configuration in app.json
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      
      if (!projectId) {
        console.warn("No project ID found in Constants, using hardcoded value");
      }
      
      // Get token using your Expo project ID - this is critical
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: projectId || "e74098e5-867e-49ba-855b-b38ea1f5105c",
      });
      
      token = tokenData.data;
      console.log("Push token:", token);
      
      // Save token to your server
      if (token) {
        try {
          await saveTokenToServer(token);
        } catch (error) {
          console.error("Error saving token to server:", error);
        }
      }
      
      // Configure Android channel
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    } catch (error) {
      console.error("Error getting push token:", error);
    }
  } else {
    console.log("Must use physical device for Push Notifications");
  }

  return token;
}

// Add this function to save the token to your backend
async function saveTokenToServer(token) {
  try {
    // Wait a moment to ensure user data has loaded
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get user data from storage
    const userId = await getData("userId");
    const userRole = await getData("userRole");
    const authToken = await getData("authToken");
    
    // Log exact values for debugging
    console.log("Token registration data:", {
      userId,
      userRole,
      tokenLength: authToken ? authToken.length : 0
    });
    
    // Validate user data exists
    if (!userId || !userRole) {
      console.error("⚠️ USER ID OR ROLE MISSING - Cannot register push token");
      return false;
    }
    
    // Make the API request with explicit JSON stringify of values
    const response = await fetch(`${ip.address}/api/notifications/register-token`, {
      method: 'POST',
      headers: {
        'Authorization': authToken ? `Bearer ${authToken}` : '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: String(userId),
        userType: String(userRole),
        pushToken: token,
        deviceInfo: {
          platform: Platform.OS,
          deviceName: Device.deviceName || 'Unknown Device',
          osVersion: Platform.Version
        }
      })
    });
    
    // Parse response carefully
    let resultText = "";
    try {
      resultText = await response.text();
      console.log("Raw token registration response:", resultText);
      
      const result = JSON.parse(resultText);
      console.log("Parsed token registration response:", result);
    } catch (parseError) {
      console.error("Failed to parse response:", parseError, resultText);
    }
    
    return response.ok;
  } catch (error) {
    console.error("Error saving token to server:", error);
    return false;
  }
}