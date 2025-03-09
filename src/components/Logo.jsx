import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import configData from '../config.json';

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  style: PropTypes.object,
};

export default function Logo({ disabledLink = false, style }) {
  const navigation = useNavigation();

  const logo = (
    <View style={[styles.container, style]}>
      <Image 
        source={require('../../assets/icon.png')} 
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <TouchableOpacity 
      onPress={() => navigation.navigate("")}
    >
      {logo}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
  },
  image: {
    width: '100%',
    height: '100%',
  }
});