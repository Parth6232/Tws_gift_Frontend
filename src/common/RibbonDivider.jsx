import React from 'react';
import { Box, useTheme } from '@mui/material';

export default function RibbonDivider({
  flip = false,
  color,
  showBow = true,
  sx = {},
}) {
  const theme = useTheme();
  const strokeColor = color || (theme.palette.mode === 'dark' ? 'rgba(242, 117, 143, 0.3)' : 'rgba(217, 69, 107, 0.25)');
  const fillColor = theme.palette.mode === 'dark' ? '#2A1B17' : '#FFFFFF';

  return (
    <Box
      sx={{
        width: '100%',
        overflow: 'hidden',
        lineHeight: 0,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: flip ? 'rotate(180deg)' : 'none',
        my: { xs: 2, md: 4 },
        ...sx,
      }}
    >
      <svg
        viewBox="0 0 1200 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto', maxHeight: '32px' }}
      >
        <path
          d="M0 20 C 300 0, 450 38, 600 20 C 750 2, 900 40, 1200 20"
          stroke={strokeColor}
          strokeWidth="2"
          strokeDasharray="6 6"
          strokeLinecap="round"
        />
      </svg>

      {showBow && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: fillColor,
            border: `1.5px solid ${theme.palette.primary.main}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: theme.shadows[1],
            zIndex: 1,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={theme.palette.primary.main}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </Box>
      )}
    </Box>
  );
}
