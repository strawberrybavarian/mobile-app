// theme.js
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

const primaryColor = '#20A0D8';
const secondaryColor = '#2EBB6D';
const tertiaryColor = '#D5B054';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: primaryColor,
    secondary: secondaryColor,
    tertiary: tertiaryColor,
    background: '#f5feff',
    surface: '#fff',
    text: '#212a37',
    // Customize other colors as needed
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: primaryColor,
    secondary: secondaryColor,
    tertiary: tertiaryColor,
    background: '#121212',
    surface: '#1F1F1F',
    text: '#FFFFFF',
    // Customize other colors as needed
  },
};
