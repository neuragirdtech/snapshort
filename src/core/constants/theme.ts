export const Colors = {
  primary: '#FF3B30', // Orange-Red
  secondary: '#FF9500', // Orange
  background: '#0F0F12',
  surface: '#1A1A1D',
  text: '#FFFFFF',
  textDim: '#A0A0A5',
  error: '#FF4C4C',
  success: '#00C853',
  processing: '#FFAB00',
  border: '#2C2C2E',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: Colors.text,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: Colors.text,
  },
  body: {
    fontSize: 16,
    color: Colors.text,
  },
  caption: {
    fontSize: 12,
    color: Colors.textDim,
  },
};
