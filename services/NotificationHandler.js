// Create a unified NotificationHandler.jsx
import React, { useEffect, useRef } from 'react';
import { AppState, Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useUser } from '../UserContext';
import { registerForPushNotificationsAsync } from '../utils/registerForPushNotificationsAsync';
import { navigationRef } from '../navigation/navigationRef';
import { requestNotificationPermissions } from './PermissionsService';

export default function NotificationHandler() {
  const { user, role } = useUser();
  const appState = useRef(AppState.currentState);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Only run this effect if there's a logged-in user
    if (!user) return;

    let isMounted = true;

    // Make sure notification handler is configured
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Function to request permissions and register for push notifications
    const setupNotifications = async () => {
      try {
        // Don't automatically request permissions in dev builds
        // Just check current status
        const { status } = await Notifications.getPermissionsAsync();
        console.log("Current notification permission status:", status);
        
        if (status === 'granted') {
          // Only register for push notifications if we already have permission
          const token = await registerForPushNotificationsAsync();
          if (token) {
            console.log("Token registered:", token);
          } else {
            console.log("Failed to get push token");
          }
        } else {
          console.log("Notification permissions not granted yet");
        }
      } catch (error) {
        console.error("Error in setupNotifications:", error);
      }
    };

    // Check notification permissions and register device
    setupNotifications();

    // Set up notification received listener
    notificationListener.current = Notifications.addNotificationReceivedListener(
      notification => {
        console.log("Notification received in foreground:", notification);
      }
    );

    // Set up notification response listener (when user taps notification)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      response => {
        console.log("Notification response received:", response);
        
        const { data } = response.notification.request.content;
        
        // Handle navigation based on notification data
        if (data && data.screen) {
          // Add delay to ensure navigation is ready
          setTimeout(() => {
            if (navigationRef.isReady()) {
              if (data.params) {
                navigationRef.navigate(data.screen, data.params);
              } else {
                navigationRef.navigate(data.screen);
              }
            }
          }, 500);
        }
      }
    );

    // Listen for app state changes (background to foreground)
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) && 
        nextAppState === 'active'
      ) {
        console.log("App came to foreground, checking for notifications");
      }
      
      appState.current = nextAppState;
    });

    // Cleanup listeners when component unmounts
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
      subscription.remove();
    };
  }, [user]);

  // This component doesn't render anything
  return null;
}