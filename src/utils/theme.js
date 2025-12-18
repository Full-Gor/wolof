// Senegal Flag Colors Theme
// Green: #00853F - Represents Islam and hope
// Yellow: #FDEF42 - Represents wealth and the sun
// Red: #E31B23 - Represents sacrifice and the blood of the martyrs

export const colors = {
  // Primary colors from Senegal flag
  green: '#00853F',
  yellow: '#FDEF42',
  red: '#E31B23',

  // Extended palette
  greenDark: '#006B32',
  greenLight: '#00A34D',
  yellowDark: '#E5D63B',
  yellowLight: '#FFF176',
  redDark: '#B71C1C',
  redLight: '#EF5350',

  // Neutral colors
  white: '#FFFFFF',
  black: '#1A1A1A',
  gray: '#757575',
  grayLight: '#E0E0E0',
  grayDark: '#424242',
  background: '#F5F5F5',

  // Semantic colors
  success: '#00853F',
  warning: '#FDEF42',
  error: '#E31B23',
  info: '#2196F3',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const fontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

export default {
  colors,
  spacing,
  fontSizes,
  borderRadius,
  shadows,
};
