import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ThemeProvider from './src/theme/index';
import AppNavigation from './src/navigation';
import { StatusBar } from 'expo-status-bar';
import { registerForPushNotifications, notificationListener } from './src/services/pushNotificationService';

export default function App() {
  useEffect(() => {
    // Register for push notifications when app starts
    registerForPushNotifications();
    
    // Set up notification listeners
    const unsubscribe = notificationListener();
    
    // Clean up listeners on unmount
    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <ThemeProvider>
        <AppNavigation />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}