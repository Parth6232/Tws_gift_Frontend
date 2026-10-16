import React from 'react';
import { Box, useTheme } from '@mui/material';

export default function Badge({
  label,
  variant = 'default',
  size = 'medium',
  icon,
  sx = {},
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const badgeStyles = {
    bestSeller: {
      bg: isDark ? 'rgba(201, 162, 75, 0.2)' : '#FFF3D6',
      color: isDark ? '#F5D580' : '#8A5800',
      border: '1px solid rgba(201, 162, 75, 0.4)',
    },
    new: {
      bg: isDark ? 'rgba(242, 117, 143, 0.2)' : '#FDF0F3',
      color: theme.palette.primary.main,
      border: `1px solid ${isDark ? 'rgba(242, 117, 143, 0.3)' : '#F9D5DA'}`,
    },
    premium: {
      bg: isDark ? '#3D251F' : '#4A2118',
      color: isDark ? '#F8EBDD' : '#FFFFFF',
      border: '1px solid rgba(201, 162, 75, 0.5)',
    },
    soldOut: {
      bg: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(74, 33, 24, 0.08)',
      color: theme.palette.text.secondary,
      border: `1px solid ${theme.palette.divider}`,
    },
    freeShipping: {
      bg: isDark ? 'rgba(76, 175, 80, 0.15)' : '#EDF7ED',
      color: isDark ? '#A5D6A7' : '#1E4620',
      border: '1px solid rgba(76, 175, 80, 0.3)',
    },
    default: {
      bg: theme.palette.background.paper,
      color: theme.palette.text.primary,
      border: `1px solid ${theme.palette.divider}`,
    },
  };

  const current = badgeStyles[variant] || badgeStyles.default;
  const isSmall = size === 'small';

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        px: isSmall ? 1 : 1.25,
        py: isSmall ? 0.25 : 0.4,
        borderRadius: '999px',
        fontSize: isSmall ? '0.6875rem' : '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
        backgroundColor: current.bg,
        color: current.color,
        border: current.border,
        boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
        ...sx,
      }}
    >
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      <span>{label}</span>
    </Box>
  );
}
