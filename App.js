import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ThemeProvider from './src/theme/index';
import AppNavigation from './src/navigation';
import { StatusBar } from 'expo-status-bar';
import { getExpoPushToken, notificationListener } from './src/services/pushNotificationService';

export default function App() {
  useEffect(() => {
    // Get push token but don't register it yet (we'll do that after login)
    getExpoPushToken();
    
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