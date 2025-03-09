import palette from './palette';

// Helper function to create rgba strings
const alpha = (color, opacity) => {
  // Simple implementation for hex colors
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color; // Return original if not hex
};

// ----------------------------------------------------------------------

const LIGHT_MODE = palette.grey[500];

// Create shadows for React Native
// Note: React Native shadows work differently than CSS shadows
// This is a simplified adaptation
const createShadow = (color) => {
  const shadowColor = color;
  
  return [
    // Level 0 - no shadow
    {},
    // Level 1
    {
      shadowColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    // Level 2
    {
      shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.20,
      shadowRadius: 1.41,
      elevation: 2,
    },
    // Level 3
    {
      shadowColor,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    },
    // Level 4
    {
      shadowColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    // Level 5
    {
      shadowColor,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8,
    },
    // Level 6
    {
      shadowColor,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.34,
      shadowRadius: 6.27,
      elevation: 10,
    },
    // Level 7
    {
      shadowColor,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.38,
      shadowRadius: 7.49,
      elevation: 12,
    },
    // Level 8
    {
      shadowColor,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.42,
      shadowRadius: 8.30,
      elevation: 16,
    },
    // Level 9
    {
      shadowColor,
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: 0.45,
      shadowRadius: 10.0,
      elevation: 20,
    }
    // Note: React Native doesn't handle as many levels of shadow complexity
    // as Material UI, so we've limited to 10 levels here
  ];
};

// Create custom shadow styles for React Native
const createCustomShadow = (color) => {
  const transparent = alpha(color, 0.24);
  const shadowColor = color;

  return {
    z1: {
      shadowColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    z8: {
      shadowColor,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.24,
      shadowRadius: 8,
      elevation: 8,
    },
    z12: {
      shadowColor,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.24,
      shadowRadius: 12,
      elevation: 12,
    },
    z16: {
      shadowColor,
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.24,
      shadowRadius: 16,
      elevation: 16,
    },
    z20: {
      shadowColor,
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.24,
      shadowRadius: 20,
      elevation: 20,
    },
    z24: {
      shadowColor,
      shadowOffset: { width: 0, height: 24 },
      shadowOpacity: 0.24,
      shadowRadius: 24,
      elevation: 24,
    },
    primary: {
      shadowColor: palette.primary.main,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.24,
      shadowRadius: 8,
      elevation: 8,
    },
    secondary: {
      shadowColor: palette.secondary.main,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.24,
      shadowRadius: 8,
      elevation: 8,
    },
    info: {
      shadowColor: palette.info.main,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.24,
      shadowRadius: 8,
      elevation: 8,
    },
    success: {
      shadowColor: palette.success.main,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.24,
      shadowRadius: 8,
      elevation: 8,
    },
    warning: {
      shadowColor: palette.warning.main,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.24,
      shadowRadius: 8,
      elevation: 8,
    },
    error: {
      shadowColor: palette.error.main,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.24,
      shadowRadius: 8,
      elevation: 8,
    },
  };
};

export const customShadows = createCustomShadow(LIGHT_MODE);

const shadows = createShadow(LIGHT_MODE);

export default shadows;