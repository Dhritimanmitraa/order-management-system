import { Theme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface CustomTheme {
    shadows: {
      light: string;
      medium: string;
      dark: string;
    };
    gradients: {
      primary: string;
      secondary: string;
    };
    textShadow: string;
  }

  // Allow configuration using `createTheme`
  interface CustomThemeOptions {
    shadows?: {
      light?: string;
      medium?: string;
      dark?: string;
    };
    gradients?: {
      primary?: string;
      secondary?: string;
    };
    textShadow?: string;
  }
  interface Theme extends CustomTheme {}
  interface ThemeOptions extends CustomThemeOptions {}
}

export {};