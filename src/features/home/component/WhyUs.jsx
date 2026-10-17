import React from 'react';
import { Box, Typography, Container, useTheme } from '@mui/material';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import CardGiftcardRoundedIcon from '@mui/icons-material/CardGiftcardRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import SectionHeading from '../../../common/SectionHeading';
import { appConstants } from '../../../constant/appConstants';

export default function WhyUs() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const iconMap = {
    LocalShippingRounded: <LocalShippingRoundedIcon sx={{ fontSize: 28 }} />,
    FavoriteRounded: <FavoriteRoundedIcon sx={{ fontSize: 28 }} />,
    CardGiftcardRounded: <CardGiftcardRoundedIcon sx={{ fontSize: 28 }} />,
    SupportAgentRounded: <SupportAgentRoundedIcon sx={{ fontSize: 28 }} />,
  };

  return (
    <Box sx={{ py: { xs: 7, md: 10 } }}>
      <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 } }}>
        <SectionHeading
          eyebrow="The TWS Gifts Promise"
          title="Why Gifting With Us Feels Different"
          description="Every order receives careful packing, gift-ready presentation, and dedicated human support."
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 3,
          }}
        >
          {appConstants.whyUs.map((item, index) => (
            <Box
              key={index}
              sx={{
                p: 3.5,
                borderRadius: '20px',
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.shadows[1],
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '16px',
                  backgroundColor: isDark ? 'rgba(242, 117, 143, 0.12)' : '#FDF0F3',
                  color: theme.palette.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2.5,
                }}
              >
                {iconMap[item.icon] || <CardGiftcardRoundedIcon />}
              </Box>

              <Typography
                sx={{
                  fontFamily: '"Fraunces", serif',
                  fontWeight: 600,
                  fontSize: '1.125rem',
                  color: theme.palette.text.primary,
                  mb: 1,
                  lineHeight: 1.3,
                }}
              >
                {item.title}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  lineHeight: 1.6,
                }}
              >
                {item.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
