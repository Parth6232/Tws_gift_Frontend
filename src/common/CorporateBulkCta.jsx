import React from 'react';
import { Box, Card, Typography, useTheme } from '@mui/material';
import BusinessCenterRoundedIcon from '@mui/icons-material/BusinessCenterRounded';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Button from './Button';
import { appConstants } from '../constant/appConstants';

export default function CorporateBulkCta({ sx = {} }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const whatsappMessage = encodeURIComponent('Hello TWS Gifts! I need corporate / bulk gifting.');
  const whatsappUrl = `https://wa.me/${appConstants.whatsappNumber}?text=${whatsappMessage}`;

  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: 960,
        mx: 'auto',
        my: 4,
        p: { xs: 3, sm: 4 },
        borderRadius: '24px',
        position: 'relative',
        overflow: 'hidden',
        background: isDark
          ? 'linear-gradient(135deg, rgba(42, 27, 23, 0.95) 0%, rgba(28, 18, 16, 0.98) 100%)'
          : 'linear-gradient(135deg, #FFFDF8 0%, #FFF5F7 100%)',
        border: `1px solid ${isDark ? 'rgba(201, 162, 75, 0.3)' : 'rgba(201, 162, 75, 0.35)'}`,
        boxShadow: isDark
          ? '0 12px 32px rgba(0, 0, 0, 0.4)'
          : '0 12px 32px rgba(74, 33, 24, 0.08)',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 3,
        ...sx,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, textAlign: { xs: 'center', sm: 'left' }, flexDirection: { xs: 'column', sm: 'row' } }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '16px',
            background: isDark ? 'rgba(201, 162, 75, 0.18)' : '#FCEFD2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <BusinessCenterRoundedIcon sx={{ fontSize: 30, color: '#C9A24B' }} />
        </Box>
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontFamily: '"Fraunces", serif',
              fontWeight: 700,
              fontSize: { xs: '1.25rem', sm: '1.4rem' },
              color: theme.palette.text.primary,
              mb: 0.5,
            }}
          >
            Corporate &amp; Bulk Gifting?
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, maxWidth: 540 }}>
            WhatsApp us at {appConstants.phoneDisplay} for customized gifting solutions &amp; bulk orders.
          </Typography>
        </Box>
      </Box>

      <Button
        variant="contained"
        component="a"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        icon={<WhatsAppIcon />}
        sx={{
          flexShrink: 0,
          background: '#25D366',
          color: '#FFFFFF',
          px: 3,
          py: 1.25,
          fontWeight: 600,
          boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)',
          '&:hover': {
            background: '#1EBE5B',
            boxShadow: '0 6px 20px rgba(37, 211, 102, 0.45)',
          },
        }}
      >
        Chat on WhatsApp
      </Button>
    </Card>
  );
}
