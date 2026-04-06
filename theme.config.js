/** @type {const} */
const themeColors = {
  // Primary colors - Pastel Yellow and Pastel Orange from Mindsync logo
  primary: { light: '#FFD580', dark: '#FFD580' }, // Pastel Yellow
  secondary: { light: '#FFB366', dark: '#FFB366' }, // Pastel Orange
  
  // Background and surface colors
  background: { light: '#FFFBF5', dark: '#0F1419' }, // Warm off-white / Dark navy
  surface: { light: '#FFF8F0', dark: '#1A2332' }, // Light warm / Dark surface
  
  // Text colors
  foreground: { light: '#1A1A2E', dark: '#F5F5F5' }, // Dark text / Light text
  muted: { light: '#8B8B9E', dark: '#A0A0B0' }, // Muted gray
  
  // Accents and states
  border: { light: '#FFE5CC', dark: '#2A3A4A' }, // Pastel orange border / Dark border
  success: { light: '#A8D5BA', dark: '#7EC69F' }, // Soft green
  warning: { light: '#FFD580', dark: '#FFC966' }, // Pastel yellow (warning)
  error: { light: '#FF9999', dark: '#FF7777' }, // Soft red
};

module.exports = { themeColors };
