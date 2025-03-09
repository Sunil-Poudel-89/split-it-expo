import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const EndMessage = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/dashboard-card.png')} // Adjust the path as needed
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.subtitle}>
        Keep track of shared expenses and settle your corresponding balances in a convenient and personalized way.
      </Text>
      {/* <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('UserGroupsPage')} // Replace with your screen name
      >
        <Text style={styles.buttonText}>View Groups</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8F5E9', // Replace with your theme's light success color
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    color: '#388E3C', // Replace with your theme's dark success color
  },
  button: {
    borderWidth: 1,
    borderColor: '#388E3C', // Replace with your theme's dark success color
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  buttonText: {
    color: '#388E3C', // Replace with your theme's dark success color
    fontSize: 16,
    textAlign: 'center',
  },
});