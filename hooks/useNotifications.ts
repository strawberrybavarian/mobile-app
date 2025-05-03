import { useNotification } from "../contexts/NotificationContext";
import * as Notifications from "expo-notifications";
import { useState, useCallback } from "react";
import { Platform } from "react-native";
import { useUser } from "../UserContext";
import axios from "axios";
import { ip } from "../ContentExport";

export interface NotificationContent {
  title: string;
  body: string;
  data?: Record<string, any>;
}

export function useNotifications() {
  const { expoPushToken, notification, error, lastNotificationResponse } = useNotification();
  const { user, role } = useUser();
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<Error | null>(null);

  // Schedule a local notification (appears on the device it's called from)
  const scheduleLocalNotification = useCallback(
    async (content: NotificationContent, trigger?: Notifications.NotificationTriggerInput) => {
      setSending(true);
      setSendError(null);

      try {
        // Determine the notification category/type
        const category = content.data?.type || 'default';

        const notificationContent: Notifications.NotificationContentInput = {
          title: content.title,
          body: content.body,
          data: content.data || {},
          sound: 'default',
          badge: 1,
          // Use the specific channel for Android based on category
          ...(Platform.OS === 'android' && { 
            channelId: category === 'appointment' ? 'appointment' :
                       category === 'message' ? 'message' :
                       category === 'reminder' ? 'reminder' :
                       category === 'health' ? 'health' : 'default'
          }),
        };

        const identifier = await Notifications.scheduleNotificationAsync({
          content: notificationContent,
          trigger: trigger || null, // Immediate notification if no trigger
        });

        console.log(`Scheduled notification with ID: ${identifier}`);
        return identifier;
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        console.error("Error scheduling notification:", error);
        setSendError(error);
        return null;
      } finally {
        setSending(false);
      }
    },
    []
  );

  // Send a push notification to a specific user using your backend API
  const sendNotificationToUser = useCallback(
    async (userId: string, userRole: 'Doctor' | 'Patient', content: NotificationContent) => {
      if (!user) {
        setSendError(new Error("You must be logged in to send notifications"));
        return false;
      }

      setSending(true);
      setSendError(null);

      try {
        // Format request to match your existing notification system
        const notificationData = {
          recipient: userId,
          recipientRole: userRole,
          sender: user._id,
          senderRole: role,
          title: content.title,
          message: content.body,
          content: content.body,
          type: content.data?.type || "general",
          data: content.data || {},
        };

        // Call your backend API to create a notification
        const response = await axios.post(
          `${ip.address}/api/notifications/create`, 
          notificationData
        );

        console.log("Notification sent via backend:", response.data);
        return true;
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        console.error("Error sending notification:", error);
        setSendError(error);
        return false;
      } finally {
        setSending(false);
      }
    },
    [user, role]
  );

  // Send a direct push notification using Expo's push API
  // This is for testing purposes - in production, use sendNotificationToUser
  const sendPushNotification = useCallback(
    async (targetExpoPushToken: string, content: NotificationContent) => {
      if (!targetExpoPushToken) {
        const error = new Error("No target push token provided");
        setSendError(error);
        return false;
      }

      setSending(true);
      setSendError(null);

      try {
        const message = {
          to: targetExpoPushToken,
          sound: "default",
          title: content.title,
          body: content.body,
          data: content.data || {},
        };

        const response = await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
        });

        const result = await response.json();
        console.log("Push notification sent:", result);
        return true;
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        console.error("Error sending push notification:", error);
        setSendError(error);
        return false;
      } finally {
        setSending(false);
      }
    },
    []
  );

  // Get all delivered notifications
  const getDeliveredNotifications = useCallback(async () => {
    try {
      return await Notifications.getPresentedNotificationsAsync();
    } catch (e) {
      console.error("Error getting delivered notifications:", e);
      return [];
    }
  }, []);

  // Dismiss a specific notification
  const dismissNotification = useCallback(async (identifier: string) => {
    try {
      await Notifications.dismissNotificationAsync(identifier);
      return true;
    } catch (e) {
      console.error("Error dismissing notification:", e);
      return false;
    }
  }, []);

  // Dismiss all notifications
  const dismissAllNotifications = useCallback(async () => {
    try {
      await Notifications.dismissAllNotificationsAsync();
      return true;
    } catch (e) {
      console.error("Error dismissing all notifications:", e);
      return false;
    }
  }, []);

  // Set notification badge count
  const setBadgeCount = useCallback(async (count: number) => {
    try {
      await Notifications.setBadgeCountAsync(count);
      return true;
    } catch (e) {
      console.error("Error setting badge count:", e);
      return false;
    }
  }, []);

  return {
    // Context values
    expoPushToken,
    notification,
    error: error || sendError,
    lastNotificationResponse,
    
    // Status
    sending,
    
    // Actions
    scheduleLocalNotification,
    sendNotificationToUser,  // New function that ties into your backend
    sendPushNotification,    // Direct push for testing
    getDeliveredNotifications,
    dismissNotification,
    dismissAllNotifications,
    setBadgeCount,
    
    // Helper to check if we have notification permissions
    hasPermissions: !!expoPushToken,
  };
}