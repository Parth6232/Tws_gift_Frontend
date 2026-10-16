import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StarHalfRoundedIcon from '@mui/icons-material/StarHalfRounded';
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded';

export default function Rating({ value = 5, count, size = 18, showScore = false, sx = {} }) {
  const theme = useTheme();
  const gold = '#C9A24B';

  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (value >= i) {
      stars.push(
        <StarRoundedIcon key={i} sx={{ color: gold, fontSize: size }} />
      );
    } else if (value >= i - 0.5) {
      stars.push(
        <StarHalfRoundedIcon key={i} sx={{ color: gold, fontSize: size }} />
      );
    } else {
      stars.push(
        <StarOutlineRoundedIcon
          key={i}
          sx={{ color: theme.palette.divider, fontSize: size }}
        />
      );
    }
  }

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, ...sx }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>{stars}</Box>
      {showScore && (
        <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.text.primary, ml: 0.5 }}>
          {value.toFixed(1)}
        </Typography>
      )}
      {count !== undefined && (
        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, ml: 0.25 }}>
          ({count})
        </Typography>
      )}
    </Box>
  );
}
