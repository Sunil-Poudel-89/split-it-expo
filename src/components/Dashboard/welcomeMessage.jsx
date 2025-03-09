import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const WelcomeMessage = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Hello there, Welcome back!</Text>
        <Text style={styles.subtitle}>
          Keep track of shared expenses and settle your corresponding balances in a convenient and personalized way.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Groups')} // Replace with your screen name
        >
          <Text style={styles.buttonText}>View Groups</Text>
        </TouchableOpacity>
      </View>
      <Image
        source={require('../../../assets/dashboard-card.png')} // Adjust the path as needed
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E1F5FE', // Replace with your theme's lighter primary color
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0D47A1', // Replace with your theme's darker primary color
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    color: '#1565C0', // Replace with your theme's dark primary color
  },
  button: {
    backgroundColor: '#1976D2', // Replace with your theme's primary color
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  image: {
    width: 120,
    height: 120,
  },
});