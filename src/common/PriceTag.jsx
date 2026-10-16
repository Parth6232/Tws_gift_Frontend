import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { formatCurrency, calculateDiscount } from '../utils/helper';

export default function PriceTag({
  price,
  comparePrice,
  size = 'medium',
  showDiscount = true,
  sx = {},
}) {
  const theme = useTheme();
  const discount = calculateDiscount(price, comparePrice);

  const fontSizes = {
    small: { price: '1rem', compare: '0.8125rem', badge: '0.6875rem' },
    medium: { price: '1.25rem', compare: '0.9375rem', badge: '0.75rem' },
    large: { price: '1.75rem', compare: '1.125rem', badge: '0.8125rem' },
    xlarge: { price: '2.25rem', compare: '1.25rem', badge: '0.875rem' },
  };

  const currentSize = fontSizes[size] || fontSizes.medium;

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', ...sx }}>
      <Typography
        sx={{
          fontFamily: '"Fraunces", serif',
          fontWeight: 700,
          fontSize: currentSize.price,
          color: theme.palette.text.primary,
          letterSpacing: '-0.01em',
        }}
      >
        {formatCurrency(price)}
      </Typography>

      {comparePrice && comparePrice > price && (
        <Typography
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: currentSize.compare,
            color: theme.palette.text.secondary,
            textDecoration: 'line-through',
            opacity: 0.7,
          }}
        >
          {formatCurrency(comparePrice)}
        </Typography>
      )}

      {showDiscount && discount > 0 && (
        <Box
          sx={{
            px: 0.9,
            py: 0.25,
            borderRadius: '6px',
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(242, 117, 143, 0.2)' : '#F9D5DA',
            color: theme.palette.primary.main,
            fontWeight: 700,
            fontSize: currentSize.badge,
            letterSpacing: '0.02em',
          }}
        >
          {discount}% OFF
        </Box>
      )}
    </Box>
  );
}
