import React from 'react';
import { Box, Typography, Container, useTheme, Skeleton } from '@mui/material';
import { Link } from 'react-router-dom';
import { commonApiAction } from '../../../store/redux/slices/commonApiSlice';
import SectionHeading from '../../../common/SectionHeading';

export default function CategoryStrip() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { data: categories = [], isLoading } = commonApiAction.useGetCategoriesQuery();

  const categoryIcons = {
    't-shirts': '👕',
    'polo': '👔',
    'apparel': '👗',
    'bags': '🎒',
    'backpacks': '🎒',
    'duffle': '🧳',
    'wooden-frames': '🪵',
    'photo-frames': '🖼️',
    'acrylic-lamps': '✨',
    'mugs': '☕',
    'wallets': '👛',
    'keychains': '🗝️',
    'corporate': '💼',
    'handicraft': '🏺',
  };

  const getCategoryIcon = (slug = '') => {
    for (const [key, icon] of Object.entries(categoryIcons)) {
      if (slug.toLowerCase().includes(key)) return icon;
    }
    return '🎁';
  };

  // If loading or empty, don't show demo fallback
  if (!isLoading && categories.length === 0) {
    return null;
  }

  return (
    <Box sx={{ py: { xs: 5, md: 7 }, borderBottom: `1px solid ${theme.palette.divider}` }}>
      <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 } }}>
        <SectionHeading
          eyebrow="Shop By Category"
          title="Gifts, Apparel &amp; More"
          description="Find the perfect gift for every occasion and every budget."
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
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    flex: { xs: '0 0 160px', sm: '0 0 190px', md: '0 0 210px' },
                    p: 2.5,
                    borderRadius: '20px',
                    border: `1.5px solid ${theme.palette.divider}`,
                    textAlign: 'center',
                  }}
                >
                  <Skeleton variant="rounded" width={64} height={64} sx={{ mx: 'auto', mb: 2, borderRadius: '18px' }} />
                  <Skeleton variant="text" width="80%" sx={{ mx: 'auto', mb: 1 }} />
                  <Skeleton variant="text" width="60%" sx={{ mx: 'auto' }} />
                </Box>
              ))
            : categories.map((cat) => (
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
