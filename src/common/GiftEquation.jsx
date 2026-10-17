import React from 'react';
import { Box, Card, Typography, useTheme, useMediaQuery } from '@mui/material';
import CardGiftcardRoundedIcon from '@mui/icons-material/CardGiftcardRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import EastRoundedIcon from '@mui/icons-material/EastRounded';
import SouthRoundedIcon from '@mui/icons-material/SouthRounded';

export default function GiftEquation({ sx = {} }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const steps = [
    {
      icon: <CardGiftcardRoundedIcon sx={{ fontSize: 36, color: '#D9456B' }} />,
      count: '1 Gift Purchased',
      sub: 'Thoughtful selection',
      badge: 'Step 1',
    },
    {
      operator: '=',
      label: 'equals',
    },
    {
      icon: <MenuBookRoundedIcon sx={{ fontSize: 36, color: '#C9A24B' }} />,
      count: '1 Stationery Kit Donated',
      sub: 'Notebooks, pens & supplies',
      badge: 'Step 2',
    },
    {
      operator: 'arrow',
      label: 'leads to',
    },
    {
      icon: <SchoolRoundedIcon sx={{ fontSize: 36, color: isDark ? '#F2758F' : '#4A2118' }} />,
      count: 'A Brighter Future',
      sub: 'Education & opportunity',
      badge: 'Outcome',
    },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 960,
        mx: 'auto',
        my: 3,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: 'center',
        gap: { xs: 1.5, md: 2 },
        ...sx,
      }}
    >
      {/* Step 1: 1 Gift Purchased */}
      <Card
        sx={{
          flex: 1,
          width: { xs: '100%', md: 'auto' },
          p: { xs: 2.5, sm: 3 },
          borderRadius: '20px',
          textAlign: 'center',
          background: isDark
            ? 'linear-gradient(135deg, rgba(217, 69, 107, 0.12) 0%, rgba(42, 27, 23, 0.8) 100%)'
            : 'linear-gradient(135deg, #FFF5F7 0%, #FFFFFF 100%)',
          border: `1px solid ${isDark ? 'rgba(217, 69, 107, 0.3)' : 'rgba(217, 69, 107, 0.2)'}`,
          boxShadow: isDark
            ? '0 8px 24px rgba(0,0,0,0.3)'
            : '0 8px 24px rgba(217, 69, 107, 0.08)',
          transition: 'transform 0.2s ease',
          '&:hover': { transform: 'translateY(-2px)' },
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            mx: 'auto',
            mb: 1.5,
            borderRadius: '16px',
            background: isDark ? 'rgba(217, 69, 107, 0.2)' : '#F9D5DA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CardGiftcardRoundedIcon sx={{ fontSize: 32, color: '#D9456B' }} />
        </Box>
        <Typography
          sx={{
            fontFamily: '"Fraunces", serif',
            fontWeight: 700,
            fontSize: { xs: '1.15rem', sm: '1.25rem' },
            color: theme.palette.text.primary,
            mb: 0.5,
          }}
        >
          1 Gift Purchased
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: '0.85rem' }}>
          By you for someone special
        </Typography>
      </Card>

      {/* Operator: = */}
      <Box
        sx={{
          width: { xs: 40, md: 44 },
          height: { xs: 40, md: 44 },
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(74, 33, 24, 0.06)',
          border: `1px solid ${theme.palette.divider}`,
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#C9A24B',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          =
        </Typography>
      </Box>

      {/* Step 2: 1 Stationery Kit Donated */}
      <Card
        sx={{
          flex: 1,
          width: { xs: '100%', md: 'auto' },
          p: { xs: 2.5, sm: 3 },
          borderRadius: '20px',
          textAlign: 'center',
          background: isDark
            ? 'linear-gradient(135deg, rgba(201, 162, 75, 0.12) 0%, rgba(42, 27, 23, 0.8) 100%)'
            : 'linear-gradient(135deg, #FFFDF5 0%, #FFFFFF 100%)',
          border: `1px solid ${isDark ? 'rgba(201, 162, 75, 0.3)' : 'rgba(201, 162, 75, 0.25)'}`,
          boxShadow: isDark
            ? '0 8px 24px rgba(0,0,0,0.3)'
            : '0 8px 24px rgba(201, 162, 75, 0.1)',
          transition: 'transform 0.2s ease',
          '&:hover': { transform: 'translateY(-2px)' },
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            mx: 'auto',
            mb: 1.5,
            borderRadius: '16px',
            background: isDark ? 'rgba(201, 162, 75, 0.2)' : 'rgba(201, 162, 75, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MenuBookRoundedIcon sx={{ fontSize: 32, color: '#C9A24B' }} />
        </Box>
        <Typography
          sx={{
            fontFamily: '"Fraunces", serif',
            fontWeight: 700,
            fontSize: { xs: '1.15rem', sm: '1.25rem' },
            color: theme.palette.text.primary,
            mb: 0.5,
          }}
        >
          1 Stationery Kit Donated
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: '0.85rem' }}>
          Notebooks, pens &amp; supplies for a child
        </Typography>
      </Card>

      {/* Operator: -> */}
      <Box
        sx={{
          width: { xs: 40, md: 44 },
          height: { xs: 40, md: 44 },
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(74, 33, 24, 0.06)',
          border: `1px solid ${theme.palette.divider}`,
          flexShrink: 0,
        }}
      >
        {isMobile ? (
          <SouthRoundedIcon sx={{ fontSize: 20, color: '#D9456B' }} />
        ) : (
          <EastRoundedIcon sx={{ fontSize: 20, color: '#D9456B' }} />
        )}
      </Box>

      {/* Step 3: A Brighter Future */}
      <Card
        sx={{
          flex: 1,
          width: { xs: '100%', md: 'auto' },
          p: { xs: 2.5, sm: 3 },
          borderRadius: '20px',
          textAlign: 'center',
          background: isDark
            ? 'linear-gradient(135deg, rgba(242, 117, 143, 0.12) 0%, rgba(42, 27, 23, 0.8) 100%)'
            : 'linear-gradient(135deg, #FFF8EC 0%, #FFFFFF 100%)',
          border: `1px solid ${isDark ? 'rgba(242, 117, 143, 0.25)' : 'rgba(74, 33, 24, 0.15)'}`,
          boxShadow: isDark
            ? '0 8px 24px rgba(0,0,0,0.3)'
            : '0 8px 24px rgba(74, 33, 24, 0.06)',
          transition: 'transform 0.2s ease',
          '&:hover': { transform: 'translateY(-2px)' },
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            mx: 'auto',
            mb: 1.5,
            borderRadius: '16px',
            background: isDark ? 'rgba(242, 117, 143, 0.2)' : 'rgba(217, 69, 107, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SchoolRoundedIcon sx={{ fontSize: 32, color: isDark ? '#F2758F' : '#D9456B' }} />
        </Box>
        <Typography
          sx={{
            fontFamily: '"Fraunces", serif',
            fontWeight: 700,
            fontSize: { xs: '1.15rem', sm: '1.25rem' },
            color: theme.palette.text.primary,
            mb: 0.5,
          }}
        >
          A Brighter Future
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: '0.85rem' }}>
          Moving one step closer to the classroom
        </Typography>
      </Card>
    </Box>
  );
}
