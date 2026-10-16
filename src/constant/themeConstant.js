import { createTheme } from '@mui/material/styles';
import { appConstants } from './appConstants';

export const buildTheme = (mode = 'light') => {
  const isDark = mode === 'dark';
  const tokens = isDark ? appConstants.colors.dark : appConstants.colors.light;

  return createTheme({
    palette: {
      mode,
      primary: {
        main: tokens.accent,
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: tokens.textPrimary,
        contrastText: isDark ? '#1C1210' : '#FFFFFF',
      },
      background: {
        default: tokens.background,
        paper: tokens.surface,
      },
      text: {
        primary: tokens.textPrimary,
        secondary: tokens.textSecondary,
      },
      divider: tokens.border,
      brand: {
        background: tokens.background,
        surface: tokens.surface,
        textPrimary: tokens.textPrimary,
        textSecondary: tokens.textSecondary,
        accent: tokens.accent,
        softAccent: tokens.softAccent,
        detailGold: tokens.detailGold,
        border: tokens.border,
        shadow: tokens.cardShadow,
      },
      action: {
        hover: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(74, 33, 24, 0.04)',
        selected: isDark ? 'rgba(242, 117, 143, 0.12)' : 'rgba(217, 69, 107, 0.08)',
      },
    },
    typography: {
      fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h1: {
        fontFamily: '"Fraunces", serif',
        fontWeight: 600,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontFamily: '"Fraunces", serif',
        fontWeight: 600,
        letterSpacing: '-0.015em',
      },
      h3: {
        fontFamily: '"Fraunces", serif',
        fontWeight: 600,
      },
      h4: {
        fontFamily: '"Fraunces", serif',
        fontWeight: 600,
      },
      h5: {
        fontFamily: '"Fraunces", serif',
        fontWeight: 600,
      },
      h6: {
        fontFamily: '"Fraunces", serif',
        fontWeight: 600,
      },
      subtitle1: {
        fontWeight: 500,
      },
      subtitle2: {
        fontWeight: 500,
      },
      button: {
        fontFamily: '"DM Sans", sans-serif',
        fontWeight: 600,
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 16,
    },
    shadows: [
      'none',
      tokens.cardShadow,
      '0 4px 12px rgba(0,0,0,0.06)',
      '0 8px 24px rgba(0,0,0,0.08)',
      '0 12px 32px rgba(0,0,0,0.10)',
      '0 16px 40px rgba(0,0,0,0.12)',
      ...Array(19).fill(tokens.cardShadow),
    ],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          img: {
            maxWidth: '100%',
          },
          '#root': {
            overflowX: 'clip',
          },
          body: {
            backgroundColor: tokens.background,
            color: tokens.textPrimary,
            transition: 'background-color 0.25s ease, color 0.25s ease',
            minHeight: '100dvh',
            fontSize: '15px',
            overflowWrap: 'anywhere',
            fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
          },
          '::selection': {
            backgroundColor: tokens.softAccent,
            color: tokens.textPrimary,
          },
          '::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '::-webkit-scrollbar-thumb': {
            backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(74,33,24,0.15)',
            borderRadius: '999px',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: tokens.surface,
            backgroundImage: 'none',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            padding: '10px 24px',
            fontSize: '0.9375rem',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
            borderRadius: 8,
          },
        },
      },
    },
  });
};
