import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerDeviceToken } from '../api/index';

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Get the push token without registering it with the server
export const getExpoPushToken = async () => {
  if (!Device.isDevice) {
    console.log('Push Notifications require a physical device');
    return null;
  }

  try {
    // Request permission
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return null;
    }

    // Get token
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    
    // Store token locally
    await AsyncStorage.setItem('expoPushToken', token);
    
    // Set up device-specific settings (required for Android)
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    
    return token;
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
};

// Register the token with the server (call this after user logs in)
export const registerPushToken = async (email) => {
  try {
    // Get the stored token
    let token = await AsyncStorage.getItem('expoPushToken');
    
    // If no token exists, try to get one
    if (!token) {
      token = await getExpoPushToken();
    }
    
    if (token && email) {
      // Register token on the server
      await registerDeviceToken(email, token, Platform.OS);
      console.log('Push token registered for user:', email);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error registering push token with server:', error);
    return false;
  }
};

export const notificationListener = () => {
  // Handle notification received while app is open
  const receivedSubscription = Notifications.addNotificationReceivedListener(notification => {
    console.log('Notification received while app is open:', notification);
  });
  
  // Handle notification user interactions
  const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('User interacted with notification:', response);
    // You can navigate to specific screens based on notification data here
  });
  
  // Return cleanup function
  return () => {
    Notifications.removeNotificationSubscription(receivedSubscription);
    Notifications.removeNotificationSubscription(responseSubscription);
  };
};