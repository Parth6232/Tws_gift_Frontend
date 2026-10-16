import React from 'react';
import { Typography, useTheme } from '@mui/material';

export default function Text({ sx = {}, children, type, ...props }) {
  const theme = useTheme();

  let typeStyles = {};

  switch (type) {
    case 'heading':
      typeStyles = {
        fontFamily: '"Fraunces", serif',
        fontSize: { xs: '20px', md: '24px' },
        fontWeight: 600,
        color: theme.palette.text.primary,
        lineHeight: 1.3,
      };
      break;
    case 'display':
      typeStyles = {
        fontFamily: '"Fraunces", serif',
        fontSize: { xs: '28px', md: '38px', lg: '46px' },
        fontWeight: 600,
        color: theme.palette.text.primary,
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
      };
      break;
    case 'subheading':
      typeStyles = {
        fontSize: '16px',
        fontWeight: 500,
        color: theme.palette.text.secondary,
        lineHeight: 1.5,
      };
      break;
    case 'title':
      typeStyles = {
        fontSize: '16px',
        fontWeight: 600,
        color: theme.palette.text.primary,
        lineHeight: 1.4,
      };
      break;
    case 'label':
      typeStyles = {
        fontSize: '14px',
        fontWeight: 500,
        color: theme.palette.text.secondary,
        lineHeight: '20px',
        display: 'block',
        mb: '6px',
      };
      break;
    case 'caption':
      typeStyles = {
        fontSize: '12px',
        fontWeight: 400,
        color: theme.palette.text.secondary,
        lineHeight: '16px',
      };
      break;
    default:
      typeStyles = {
        color: theme.palette.text.primary,
      };
  }

  return (
    <Typography sx={{ ...typeStyles, ...sx }} {...props}>
      {children}
    </Typography>
  );
}
