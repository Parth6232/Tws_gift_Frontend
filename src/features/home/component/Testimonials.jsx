import React from 'react';
import { Box, Typography, Container, useTheme } from '@mui/material';
import Rating from '../../../common/Rating';
import SectionHeading from '../../../common/SectionHeading';
import { appConstants } from '../../../constant/appConstants';
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded';

export default function Testimonials() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        py: { xs: 7, md: 10 },
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.015)' : 'rgba(74, 33, 24, 0.015)',
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 } }}>
        <SectionHeading
          eyebrow="Words from the Heart"
          title="Stories of Unwrapped Joy"
          description="Read genuine reactions from customers who celebrated their love and milestones with TWS Gifts."
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 3.5,
          }}
        >
          {appConstants.testimonials.map((t) => (
            <Box
              key={t.id}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: '24px',
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.shadows[1],
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <FormatQuoteRoundedIcon
                sx={{
                  fontSize: 42,
                  color: isDark ? 'rgba(242, 117, 143, 0.2)' : 'rgba(217, 69, 107, 0.15)',
                  mb: 1,
                }}
              />

              <Rating value={t.rating} size={20} sx={{ mb: 2 }} />

              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.primary,
                  lineHeight: 1.7,
                  fontStyle: 'italic',
                  mb: 3,
                  flex: 1,
                }}
              >
                “{t.quote}”
              </Typography>

              <Box sx={{ pt: 2, borderTop: `1px dashed ${theme.palette.divider}` }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', color: theme.palette.text.primary }}>
                  {t.name}
                </Typography>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                  {t.city} • Purchased {t.product}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
