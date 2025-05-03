import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import * as Notifications from "expo-notifications";
import { useUser } from "../UserContext";
import { registerForPushNotificationsAsync } from "../utils/registerForPushNotificationsAsync";
import { getNavigationRef } from "@/navigation/navigationRef";

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  error: Error | null;
  lastNotificationResponse: Notifications.NotificationResponse | null;
  isReady: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const { user, updateUnreadNotificationsCount } = useUser();
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = 
    useState<Notifications.Notification | null>(null);
  const [lastNotificationResponse, setLastNotificationResponse] = 
    useState<Notifications.NotificationResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  // Set up notification handler - this happens regardless of user login
  useEffect(() => {
    console.log("Setting up notification handler");
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }, []);

  // Register for push notifications and set up listeners - only when user is available
  useEffect(() => {
    let isMounted = true;
    let tempNotificationListener: Notifications.Subscription | null = null;
    let tempResponseListener: Notifications.Subscription | null = null;

    const setupNotifications = async () => {
      // Only proceed if user is logged in
      if (!user) {
        console.log("User not logged in, skipping notification setup");
        setIsReady(true); // We're ready, just not registered
        return;
      }

      console.log("User logged in, setting up notifications");
      
      try {
        // Register for push notifications
        const token = await registerForPushNotificationsAsync();
        if (isMounted) {
          console.log("Token registered:", token);
          setExpoPushToken(token);
        }
        
        // Listen for incoming notifications
        tempNotificationListener = Notifications.addNotificationReceivedListener((notification) => {
          if (!isMounted) return;
          
          console.log("🔔 Notification Received: ", notification);
          setNotification(notification);
          
          // If user is logged in, increment the unread count
          if (user && typeof updateUnreadNotificationsCount === 'function') {
            updateUnreadNotificationsCount((prev: number) => prev + 1);
          }
        });
        
        // Listen for user interaction with notifications
        tempResponseListener = Notifications.addNotificationResponseReceivedListener((response) => {
          if (!isMounted) return;
          
          console.log(
            "🔔 User interacted with notification: ",
            JSON.stringify(response.notification.request.content.data, null, 2)
          );
          
          setLastNotificationResponse(response);
          
          // Extract navigation data from notification
          const data = response.notification.request.content.data;
          
          // Navigate to the appropriate screen if needed
          if (data?.screen) {
            try {
              // Get navigation reference - you'll need to set this up
              const navigationRef = getNavigationRef();
              
              if (navigationRef && navigationRef.isReady()) {
                // Navigate with parameters if we have an entity ID
                if (data.entityId) {
                  navigationRef.navigate(data.screen, { id: data.entityId });
                } else {
                  navigationRef.navigate(data.screen);
                }
              }
            } catch (err) {
              console.error('Error navigating from notification:', err);
            }
          }
        });
        
        // Save references for cleanup
        if (isMounted) {
          notificationListener.current = tempNotificationListener;
          responseListener.current = tempResponseListener;
          setIsReady(true);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error setting up notifications:", err);
          setError(err instanceof Error ? err : new Error(String(err)));
          setIsReady(true); // We're ready even if there was an error
        }
      }
    };

    setupNotifications();

    // Clean up on unmount or when user changes
    return () => {
      isMounted = false;
      
      // Clean up listeners
      if (tempNotificationListener) {
        Notifications.removeNotificationSubscription(tempNotificationListener);
      }
      
      if (tempResponseListener) {
        Notifications.removeNotificationSubscription(tempResponseListener);
      }
      
      // Reset our refs
      notificationListener.current = null;
      responseListener.current = null;
    };
  }, [user]); // Only re-run when user changes

  return (
    <NotificationContext.Provider
      value={{ 
        expoPushToken, 
        notification, 
        error,
        lastNotificationResponse,
        isReady
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};