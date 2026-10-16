import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, useTheme } from '@mui/material';
import Loader from './Loader';

const DataRenderer = ({
  isLoading,
  isCalled = true,
  hasData,
  message = 'No records found',
  dataComponent,
  sx = {},
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '200px',
        width: '100%',
        ...sx,
      }}
    >
      {isLoading ? (
        <Loader loading position="absolute" />
      ) : !hasData && isCalled ? (
        <Box
          sx={{
            py: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            color: theme.palette.text.secondary,
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(74,33,24,0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
            }}
          >
            🎁
          </Box>
          <Typography variant="body1" fontWeight={500} color="text.secondary">
            {message}
          </Typography>
        </Box>
      ) : (
        dataComponent
      )}
    </Box>
  );
};

DataRenderer.propTypes = {
  isLoading: PropTypes.bool,
  isCalled: PropTypes.bool,
  hasData: PropTypes.bool,
  message: PropTypes.string,
  dataComponent: PropTypes.node.isRequired,
  sx: PropTypes.object,
};

export default DataRenderer;
