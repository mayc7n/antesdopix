import { colors } from './colors';
import { spacing } from './spacing';

export const theme = {
  colors,
  spacing,
  radius: {
    sm: 12,
    md: 20,
    lg: 28,
    pill: 999,
  },
  typography: {
    eyebrow: 12,
    body: 16,
    bodyLarge: 19,
    title: 34,
    display: 46,
  },
} as const;
