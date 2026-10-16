import React from 'react';
import { Button as MuiButton, CircularProgress, useTheme } from '@mui/material';

export default function Button({
  children,
  sx = {},
  icon,
  variant = 'contained',
  onClick,
  disabled = false,
  loading = false,
  size = 'medium',
  ...props
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  let typeStyles = {};

  switch (variant) {
    case 'contained':
      typeStyles = {
        background: theme.palette.primary.main,
        color: '#FFFFFF',
        boxShadow: isDark
          ? '0 4px 14px rgba(242, 117, 143, 0.25)'
          : '0 4px 14px rgba(217, 69, 107, 0.25)',
        '&:hover': {
          background: isDark ? '#E55E7A' : '#C4365A',
          boxShadow: isDark
            ? '0 6px 20px rgba(242, 117, 143, 0.35)'
            : '0 6px 20px rgba(217, 69, 107, 0.35)',
          transform: 'translateY(-1px)',
        },
        '&.Mui-disabled': {
          background: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(74, 33, 24, 0.12)',
          color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(74, 33, 24, 0.3)',
          boxShadow: 'none',
        },
      };
      break;

    case 'white':
    case 'surface':
      typeStyles = {
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[1],
        '&:hover': {
          background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFDF9',
          borderColor: theme.palette.primary.main,
          transform: 'translateY(-1px)',
        },
        '&.Mui-disabled': {
          background: theme.palette.background.paper,
          color: theme.palette.text.secondary,
          opacity: 0.5,
        },
      };
      break;

    case 'outline':
      typeStyles = {
        background: 'transparent',
        color: theme.palette.primary.main,
        border: `1.5px solid ${theme.palette.primary.main}`,
        '&:hover': {
          background: isDark ? 'rgba(242, 117, 143, 0.08)' : 'rgba(217, 69, 107, 0.05)',
          border: `1.5px solid ${theme.palette.primary.main}`,
          transform: 'translateY(-1px)',
        },
        '&.Mui-disabled': {
          color: theme.palette.text.secondary,
          borderColor: theme.palette.divider,
        },
      };
      break;

    case 'secondary':
      typeStyles = {
        background: isDark ? '#3D2721' : '#4A2118',
        color: '#FFFFFF',
        '&:hover': {
          background: isDark ? '#4D322B' : '#331610',
          transform: 'translateY(-1px)',
        },
      };
      break;

    case 'text':
      typeStyles = {
        background: 'transparent',
        color: theme.palette.text.primary,
        '&:hover': {
          background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(74, 33, 24, 0.05)',
          color: theme.palette.primary.main,
        },
      };
      break;

    default:
      typeStyles = {
        background: theme.palette.primary.main,
        color: '#FFFFFF',
      };
  }

  const height = size === 'small' ? 36 : size === 'large' ? 50 : 44;

  return (
    <MuiButton
      onClick={onClick}
      disabled={disabled || loading}
      sx={{
        height,
        minWidth: size === 'small' ? 100 : 160,
        borderRadius: '12px',
        textTransform: 'none',
        fontWeight: 600,
        fontSize: size === 'small' ? '0.875rem' : '0.9375rem',
        letterSpacing: '0.01em',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        cursor: 'pointer',
        ...typeStyles,
        ...sx,
      }}
      startIcon={!loading ? icon : undefined}
      {...props}
    >
      {loading ? (
        <CircularProgress
          size={20}
          sx={{
            color: variant === 'contained' || variant === 'secondary' ? '#fff' : theme.palette.primary.main,
          }}
        />
      ) : (
        children
      )}
    </MuiButton>
  );
}
