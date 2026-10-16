import React from 'react';
import { Box, Typography, Container, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

export default function NotFoundPage() {
  const theme = useTheme();

  return (
    <Container maxWidth="sm" sx={{ py: 14, textAlign: 'center' }}>
      <Typography
        sx={{
          fontFamily: '"Fraunces", serif',
          fontWeight: 700,
          fontSize: { xs: '5rem', md: '7rem' },
          color: theme.palette.primary.main,
          lineHeight: 1,
          mb: 1,
        }}
      >
        404
      </Typography>

      <Typography variant="h4" sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600, mb: 2 }}>
        Keepsake Not Found
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
        The memory or page you are looking for may have moved or no longer exists. Let’s take you back
        to our collection.
      </Typography>

      <Button component={Link} to="/" variant="contained">
        Return Home
      </Button>
    </Container>
  );
}
