// ----------------------------------------------------------------------

// In React Native, we work with numeric font sizes directly
// rather than rem values
function pxToSize(value) {
    return value;
  }
  
  // React Native doesn't use media queries the same way
  // Instead, we'll create a function that can be used with
  // react-native-responsive-fontsize or similar libraries if needed
  function createResponsiveSizes(sizes) {
    return {
      small: sizes.sm,
      medium: sizes.md,
      large: sizes.lg,
    };
  }
  
  // Note: In React Native, you'd typically use a font loading solution
  // such as expo-font to load custom fonts
  const FONT_PRIMARY = 'System'; // Default system font for now
  
  const typography = {
    fontFamily: FONT_PRIMARY,
    fontWeightRegular: '400',
    fontWeightMedium: '600',
    fontWeightBold: '700',
    h1: {
      fontWeight: '700',
      lineHeight: 1.25, // React Native uses multipliers for line height
      fontSize: pxToSize(40),
      responsiveSizes: createResponsiveSizes({ sm: 52, md: 58, lg: 64 }),
    },
    h2: {
      fontWeight: '700',
      lineHeight: 1.33,
      fontSize: pxToSize(32),
      responsiveSizes: createResponsiveSizes({ sm: 40, md: 44, lg: 48 }),
    },
    h3: {
      fontWeight: '700',
      lineHeight: 1.5,
      fontSize: pxToSize(24),
      responsiveSizes: createResponsiveSizes({ sm: 26, md: 30, lg: 32 }),
    },
    h4: {
      fontWeight: '700',
      lineHeight: 1.5,
      fontSize: pxToSize(20),
      responsiveSizes: createResponsiveSizes({ sm: 20, md: 24, lg: 24 }),
    },
    h5: {
      fontWeight: '700',
      lineHeight: 1.5,
      fontSize: pxToSize(18),
      responsiveSizes: createResponsiveSizes({ sm: 19, md: 20, lg: 20 }),
    },
    h6: {
      fontWeight: '700',
      lineHeight: 1.56,
      fontSize: pxToSize(17),
      responsiveSizes: createResponsiveSizes({ sm: 18, md: 18, lg: 18 }),
    },
    subtitle1: {
      fontWeight: '600',
      lineHeight: 1.5,
      fontSize: pxToSize(16),
    },
    subtitle2: {
      fontWeight: '600',
      lineHeight: 1.57,
      fontSize: pxToSize(14),
    },
    body1: {
      lineHeight: 1.5,
      fontSize: pxToSize(16),
    },
    body2: {
      lineHeight: 1.57,
      fontSize: pxToSize(14),
    },
    caption: {
      lineHeight: 1.5,
      fontSize: pxToSize(12),
    },
    overline: {
      fontWeight: '700',
      lineHeight: 1.5,
      fontSize: pxToSize(12),
      letterSpacing: 1.1,
      textTransform: 'uppercase',
    },
    button: {
      fontWeight: '700',
      lineHeight: 1.71,
      fontSize: pxToSize(14),
      textTransform: 'capitalize',
    },
  };
  
  export default typography;