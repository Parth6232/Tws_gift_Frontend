import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

export default function SectionHeading({
  eyebrow,
  title,
  description,
  centered = true,
  action,
  sx = {},
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        textAlign: centered ? 'center' : 'left',
        maxWidth: centered ? 720 : '100%',
        mx: centered ? 'auto' : 0,
        mb: { xs: 4, md: 5 },
        ...sx,
      }}
    >
      {eyebrow && (
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            mb: 1.25,
            px: 1.5,
            py: 0.5,
            borderRadius: '999px',
            backgroundColor:
              theme.palette.mode === 'dark' ? 'rgba(242, 117, 143, 0.15)' : 'rgba(217, 69, 107, 0.08)',
          }}
        >
          <span style={{ color: theme.palette.primary.main, fontSize: '12px' }}>✦</span>
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: theme.palette.primary.main,
            }}
          >
            {eyebrow}
          </Typography>
          <span style={{ color: theme.palette.primary.main, fontSize: '12px' }}>✦</span>
        </Box>
      )}

      {title && (
        <Typography
          variant="h2"
          sx={{
            fontFamily: '"Fraunces", serif',
            fontWeight: 600,
            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
            color: theme.palette.text.primary,
            lineHeight: 1.2,
            letterSpacing: '-0.015em',
            mb: description ? 1.5 : 0,
          }}
        >
          {title}
        </Typography>
      )}

      {description && (
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: { xs: '0.9375rem', md: '1.0625rem' },
            lineHeight: 1.6,
            maxWidth: 600,
            mx: centered ? 'auto' : 0,
          }}
        >
          {description}
        </Typography>
      )}

      {action && (
        <Box sx={{ mt: 2.5, display: 'flex', justifyContent: centered ? 'center' : 'flex-start' }}>
          {action}
        </Box>
      )}
    </Box>
  );
}
