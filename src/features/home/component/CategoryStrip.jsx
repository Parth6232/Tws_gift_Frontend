import React from 'react';
import { Box, Typography, Container, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { commonApiAction } from '../../../store/redux/slices/commonApiSlice';
import SectionHeading from '../../../common/SectionHeading';

export default function CategoryStrip() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { data: categories = [], isLoading } = commonApiAction.useGetCategoriesQuery();

  // Category visual icons map for premium touch
  const categoryIcons = {
    'wooden-frames': '🪵',
    'photo-frames': '🖼️',
    'acrylic-lamps': '✨',
    'mugs': '☕',
    'wallets': '👛',
    'keychains': '🗝️',
    'anniversary': '💍',
    'birthday': '🎂',
    'couples': '💖',
  };

  const getCategoryIcon = (slug = '') => {
    for (const [key, icon] of Object.entries(categoryIcons)) {
      if (slug.includes(key)) return icon;
    }
    return '🎁';
  };

  // Fallback demo categories if backend has not seeded any yet
  const displayCategories = categories.length > 0 ? categories : [
    { name: 'Photo Frames', slug: 'photo-frames' },
    { name: 'Acrylic Lamps', slug: 'acrylic-lamps' },
    { name: 'Wooden Keepsakes', slug: 'wooden-keepsakes' },
    { name: 'Custom Mugs', slug: 'custom-mugs' },
    { name: 'Engraved Accessories', slug: 'engraved-accessories' },
    { name: 'Anniversary Specials', slug: 'anniversary-specials' },
  ];

  return (
    <Box sx={{ py: { xs: 5, md: 7 }, borderBottom: `1px solid ${theme.palette.divider}` }}>
      <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 } }}>
        <SectionHeading
          eyebrow="Browse By Collection"
          title="Curated Keepsakes for Every Occasion"
          description="Find the perfect customized touch crafted with heirloom quality and detail."
        />

        <Box
          sx={{
            display: 'flex',
            gap: { xs: 2, md: 2.5 },
            overflowX: 'auto',
            py: 2,
            px: 0.5,
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {displayCategories.map((cat) => (
            <Box
              key={cat._id || cat.slug}
              component={Link}
              to={`/shop?category=${cat.slug}`}
              sx={{
                scrollSnapAlign: 'start',
                flex: { xs: '0 0 160px', sm: '0 0 190px', md: '0 0 210px' },
                p: { xs: 2.5, md: 3 },
                borderRadius: '20px',
                backgroundColor: theme.palette.background.paper,
                border: `1.5px solid ${theme.palette.divider}`,
                boxShadow: theme.shadows[1],
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  transform: 'translateY(-4px)',
                  boxShadow: isDark
                    ? '0 12px 30px rgba(0, 0, 0, 0.4)'
                    : '0 12px 30px rgba(74, 33, 24, 0.08)',
                },
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '18px',
                  backgroundColor: isDark ? 'rgba(242, 117, 143, 0.12)' : '#FDF0F3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  mb: 2,
                  transition: 'transform 0.2s ease',
                  '&:hover': { transform: 'scale(1.1)' },
                }}
              >
                {getCategoryIcon(cat.slug)}
              </Box>

              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  color: theme.palette.text.primary,
                  mb: 0.5,
                }}
              >
                {cat.name}
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              >
                Explore Collection →
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
