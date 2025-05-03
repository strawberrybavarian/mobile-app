import React, { useState, useEffect } from 'react';
import { View, Button, Text, Alert, StyleSheet } from 'react-native';
import { useNotifications } from '../hooks/useNotifications';
import { requestNotificationPermissions } from '../services/PermissionsService';
import * as Notifications from 'expo-notifications';

export default function TestNotifications() {
  const { scheduleLocalNotification, expoPushToken } = useNotifications();
  const [sending, setSending] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('unknown');
  
  // Check current permission status on mount
  useEffect(() => {
    checkPermissions();
  }, []);
  
  const checkPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setPermissionStatus(status);
    console.log("Current notification permission status:", status);
  };
  
  // Explicitly request permissions with button
  const requestPermissions = async () => {
    try {
      const granted = await requestNotificationPermissions();
      console.log("Permission request result:", granted);
      
      if (granted) {
        Alert.alert("Success", "Notification permissions granted!");
      } else {
        Alert.alert("Failed", "Could not get notification permissions");
      }
      
      // Refresh status after request
      checkPermissions();
    } catch (error) {
      console.error("Error requesting permissions:", error);
      Alert.alert("Error", "Failed to request permissions");
    }
  };
  
  // Test local notifications
  const sendTestLocalNotification = async () => {
    await scheduleLocalNotification({
      title: 'Local Test Notification',
      body: 'This is a test local notification',
      data: { type: 'general' }
    });
    Alert.alert('Local notification sent');
  };
  
  // Test direct push via Expo API
  const sendDirectPushNotification = async () => {
    if (!expoPushToken) {
      Alert.alert('No push token', 'Cannot send push notification without a token');
      return;
    }
    
    setSending(true);
    
    try {
      const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Direct Push Test',
        body: 'This is a test sent directly via the Expo push API',
        data: { testData: 'test' },
      };

      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
      
      const result = await response.json();
      console.log('Push notification result:', result);
      Alert.alert('Direct push notification sent');
    } catch (error) {
      console.error('Error sending direct push:', error);
      Alert.alert('Error', 'Failed to send direct push notification');
    } finally {
      setSending(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.statusText}>Permission Status: {permissionStatus}</Text>
      <Text style={styles.tokenText}>Push Token: {expoPushToken || 'None'}</Text>
      
      <View style={styles.buttonSection}>
        <Text style={styles.sectionTitle}>Step 1: Request Permissions</Text>
        <Button 
          title="Request Notification Permissions" 
          onPress={requestPermissions}
          color="#4CAF50"
        />
      </View>
      
      <View style={styles.buttonSection}>
        <Text style={styles.sectionTitle}>Step 2: Test Notifications</Text>
        <Button 
          title="Send Local Notification" 
          onPress={sendTestLocalNotification}
          disabled={permissionStatus !== 'granted'}
        />
        
        <Button 
          title="Send Direct Push Notification" 
          onPress={sendDirectPushNotification}
          disabled={sending || !expoPushToken}
        />
        
        {sending && <Text>Sending push notification...</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  tokenText: {
    fontSize: 14,
    marginBottom: 20,
  },
  buttonSection: {
    marginVertical: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  }
});