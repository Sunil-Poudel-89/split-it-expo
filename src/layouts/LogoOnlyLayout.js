import React from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useTheme } from 'react-native-paper';
import Logo from '../components/Logo';

export default function LogoOnlyLayout({ children }) {
  const theme = useTheme();
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Logo />
      </View>
      <View style={styles.content}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    padding: 24, // Equivalent to theme.spacing(3)
    zIndex: 10,
  },
  content: {
    flex: 1,
  }
});