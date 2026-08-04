// SMCII-inspired palette: deep blue -> sky blue gradient on white surfaces
export const colors = {
  primaryDark: '#0B3D91',   // deep navy blue
  primary: '#1565C0',       // core SMCII blue
  primaryLight: '#4FA6E8',  // lighter accent blue
  gradientStart: '#0B3D91',
  gradientEnd: '#4FA6E8',
  white: '#FFFFFF',
  offWhite: '#F4F8FC',
  cardBg: '#FFFFFF',
  textDark: '#0B1B33',
  textMuted: '#5A6B85',
  border: '#E1EAF5',
  gold: '#F2B705', // subtle accent for highlights
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 22,
  pill: 999,
};

export const shadow = {
  card: {
    shadowColor: '#0B3D91',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
};
