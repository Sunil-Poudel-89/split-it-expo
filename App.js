import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ThemeProvider from './src/theme/index';
import AppNavigation from './src/navigation';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <ThemeProvider>
        <AppNavigation />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}