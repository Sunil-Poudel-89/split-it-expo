import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Provider as PaperProvider, DefaultTheme, configureFonts } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import palette from './palette';
import typography from './typography';
import { customShadows } from './shadows';

ThemeProvider.propTypes = {
  children: PropTypes.node,
};

export default function ThemeProvider({ children }) {
  const fontConfig = {
    web: {
      regular: {
        fontFamily: 'sans-serif',
        fontWeight: 'normal',
      },
      medium: {
        fontFamily: 'sans-serif-medium',
        fontWeight: 'normal',
      },
      light: {
        fontFamily: 'sans-serif-light',
        fontWeight: 'normal',
      },
      thin: {
        fontFamily: 'sans-serif-thin',
        fontWeight: 'normal',
      },
    },
    ios: {
      regular: {
        fontFamily: 'System',
        fontWeight: '400',
      },
      medium: {
        fontFamily: 'System',
        fontWeight: '500',
      },
      light: {
        fontFamily: 'System',
        fontWeight: '300',
      },
      thin: {
        fontFamily: 'System',
        fontWeight: '100',
      },
    },
    android: {
      regular: {
        fontFamily: 'sans-serif',
        fontWeight: 'normal',
      },
      medium: {
        fontFamily: 'sans-serif-medium',
        fontWeight: 'normal',
      },
      light: {
        fontFamily: 'sans-serif-light',
        fontWeight: 'normal',
      },
      thin: {
        fontFamily: 'sans-serif-thin',
        fontWeight: 'normal',
      },
    }
  };

  const fonts = configureFonts({
    config: {
      ...fontConfig,
    },
  });

  const theme = useMemo(
    () => ({
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        primary: palette.primary.main,
        background: palette.background.default,
        surface: palette.background.paper,
        text: palette.text.primary,
        disabled: palette.text.disabled,
        placeholder: palette.text.secondary,
        backdrop: palette.action.disabledBackground,
        notification: palette.error.main,
      },
      roundness: 8,
      fonts,
      animation: {
        scale: 1.0,
      },
      // Include shadows but make sure they're in the correct format for React Native Paper
    }),
    []
  );

  return (
    <PaperProvider theme={theme}>
      {children}
    </PaperProvider>
  );
}