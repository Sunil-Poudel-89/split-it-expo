import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

Iconify.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  style: PropTypes.object,
  size: PropTypes.number,
  color: PropTypes.string,
};

export default function Iconify({ icon, style, size = 24, color = "#000", ...other }) {
  // For elements passed directly
  if (typeof icon !== 'string') {
    return <View style={[styles.container, style]} {...other}>{icon}</View>;
  }
  
  // Try to map icon string to Ionicons
  // This is a simplified approach - you may need a more complex mapping system
  // depending on your iconify icon names
  return (
    <View style={[styles.container, style]} {...other}>
      <Ionicons 
        name={mapIconifyToIonicons(icon)} 
        size={size} 
        color={color}
      />
    </View>
  );
}

// Helper function to map iconify icon names to Ionicons
// You'll need to expand this mapping based on icons you use
function mapIconifyToIonicons(iconName) {
  // Map common iconify prefixes to Ionicons names
  // This is just an example - you'll need to customize based on your icons
  const iconMap = {
    'eva:menu-2-fill': 'menu',
    'eva:home-fill': 'home',
    'eva:person-fill': 'person',
    'eva:settings-2-fill': 'settings',
    'eva:bell-fill': 'notifications',
    // Add more mappings as needed
  };
  
  return iconMap[iconName] || 'help-circle'; // Fallback icon
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});