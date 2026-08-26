export interface ThemeColors {
  background: string;
  surface: string;
  surfaceSecondary: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  danger: string;
  statusBarStyle: 'light' | 'dark';
  /** A raised, always-light card used for an "active" alarm — same idea in both themes. */
  cardActive: string;
  cardActiveText: string;
  cardActiveTextMuted: string;
  /** A muted card used for a disabled/inactive alarm. */
  cardInactive: string;
  cardInactiveText: string;
}

export const darkColors: ThemeColors = {
  background: '#0F0F0F',
  surface: '#1C1C1E',
  surfaceSecondary: '#2C2C2E',
  border: '#3A3A3C',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  accent: '#FFFFFF',
  danger: '#FF453A',
  statusBarStyle: 'light',
  cardActive: '#F0F0F0',
  cardActiveText: '#1C1C1E',
  cardActiveTextMuted: '#6B6B6B',
  cardInactive: '#212121',
  cardInactiveText: '#FFFFFF',
};

export const lightColors: ThemeColors = {
  background: '#F8F9FA',        
  surface: '#FFFFFF',            
  surfaceSecondary: '#EEEEEE',   
  border: '#E0E0E0',            
  textPrimary: '#1C1C1E',       
  textSecondary: '#5F6368',     
  accent: '#1C1C1E',             
  danger: '#D93025',             
  statusBarStyle: 'dark',
  cardActive: '#FFFFFF',
  cardActiveText: '#1C1C1E',
  cardActiveTextMuted: '#6B6B6B',
  cardInactive: '#EEEEEE',
  cardInactiveText: '#1C1C1E',   
};
