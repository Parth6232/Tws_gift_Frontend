import React from 'react';
import { Box, Typography, Container, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import LockRoundedIcon from '@mui/icons-material/LockRounded';

export default function UnauthorizedPage() {
  const theme = useTheme();

  return (
    <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center' }}>
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: '24px',
          backgroundColor:
            theme.palette.mode === 'dark' ? 'rgba(217, 69, 107, 0.2)' : '#FDF0F3',
          color: theme.palette.primary.main,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 3,
        }}
      >
        <LockRoundedIcon sx={{ fontSize: 36 }} />
      </Box>

      <Typography variant="h3" sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600, mb: 1.5 }}>
        Access Restricted
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
        You don’t have permission to access this area of TWS Gifts. If you believe this is in error,
        please contact your administrator to grant access.
      </Typography>

      <Button component={Link} to="/admin/products" variant="contained">
        Back to Products
      </Button>
    </Container>
  );
}
