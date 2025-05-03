import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function setupNotificationChannels() {
  if (Platform.OS === 'android') {
    // Just one channel for everything
    await Notifications.setNotificationChannelAsync('default', {
      name: 'MolinoCare Notifications',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#0066CC',
      enableVibrate: true,
      enableLights: true,
    });
  }
}