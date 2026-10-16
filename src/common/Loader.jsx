import React from 'react';
import PropTypes from 'prop-types';
import { Stack, CircularProgress, useTheme, Typography } from '@mui/material';

const Loader = ({ position = 'fixed', loading = false, size = 'sm', message, sx = {} }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const sizes = {
    xs: 24,
    sm: 40,
    md: 56,
    lg: 72,
  };

  if (!loading) return null;

  return (
    <Stack
      sx={{
        background: isDark ? 'rgba(28, 18, 16, 0.75)' : 'rgba(255, 248, 236, 0.75)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        justifyContent: 'center',
        alignItems: 'center',
        position: position,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        zIndex: 99999,
        gap: 2,
        ...sx,
      }}
    >
      <CircularProgress
        sx={{
          color: theme.palette.primary.main,
        }}
        size={sizes[size]}
        thickness={3.5}
      />
      {message && (
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 500,
            letterSpacing: '0.02em',
          }}
        >
          {message}
        </Typography>
      )}
    </Stack>
  );
};

Loader.propTypes = {
  position: PropTypes.oneOf(['fixed', 'absolute']),
  loading: PropTypes.bool,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  message: PropTypes.string,
  sx: PropTypes.object,
};

export default Loader;
