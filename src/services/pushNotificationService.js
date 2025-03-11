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

export const registerForPushNotifications = async () => {
  if (!Device.isDevice) {
    alert('Push Notifications require a physical device');
    return;
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
      alert('Failed to get push token for push notification!');
      return;
    }

    // Get token
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    
    // Store token locally
    const storedToken = await AsyncStorage.getItem('expoPushToken');
    if (token !== storedToken) {
      await AsyncStorage.setItem('expoPushToken', token);
      
      // Get user's email
      const profileString = await AsyncStorage.getItem('profile');
      if (profileString) {
        const profile = JSON.parse(profileString);
        const email = profile?.emailId;
        
        if (email) {
          // Register token on server
          await registerDeviceToken(email, token, Platform.OS);
        }
      }
    }
    
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
    console.error('Error setting up notifications:', error);
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