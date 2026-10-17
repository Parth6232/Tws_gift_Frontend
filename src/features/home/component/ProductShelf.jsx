import React from 'react';
import { Box, Typography, Container, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import ProductCard from '../../../common/ProductCard';
import SectionHeading from '../../../common/SectionHeading';
import { ProductCardSkeleton } from '../../../common/Skeleton';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

export default function ProductShelf({
  title,
  eyebrow,
  description,
  products = [],
  isLoading = false,
  viewAllLink = '/shop',
  isDarkBand = false,
}) {
  const theme = useTheme();
  const isDarkTheme = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        py: { xs: 6, md: 9 },
        backgroundColor: isDarkBand
          ? isDarkTheme
            ? '#140D0B'
            : '#2A1713'
          : 'transparent',
        color: isDarkBand ? '#F8EBDD' : 'inherit',
        borderTop: isDarkBand ? `1px solid ${theme.palette.divider}` : 'none',
        borderBottom: isDarkBand ? `1px solid ${theme.palette.divider}` : 'none',
        position: 'relative',
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: { xs: 'flex-start', sm: 'flex-end' },
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
            mb: { xs: 3, md: 4 },
            gap: 2,
          }}
        >
          <Box sx={{ maxWidth: 640 }}>
            {eyebrow && (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '999px',
                  backgroundColor: isDarkBand
                    ? 'rgba(201, 162, 75, 0.2)'
                    : isDarkTheme
                    ? 'rgba(242, 117, 143, 0.15)'
                    : '#FDF0F3',
                  mb: 1.25,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: isDarkBand ? '#C9A24B' : theme.palette.primary.main,
                  }}
                >
                  {eyebrow}
                </Typography>
              </Box>
            )}

            <Typography
              variant="h2"
              sx={{
                fontFamily: '"Fraunces", serif',
                fontWeight: 600,
                fontSize: { xs: '1.75rem', md: '2.35rem' },
                color: isDarkBand ? '#FFFFFF' : theme.palette.text.primary,
                lineHeight: 1.2,
                mb: 1,
              }}
            >
              {title}
            </Typography>

            {description && (
              <Typography
                variant="body2"
                sx={{
                  color: isDarkBand ? '#C9B1A5' : theme.palette.text.secondary,
                  lineHeight: 1.6,
                }}
              >
                {description}
              </Typography>
            )}
          </Box>

          <Box
            component={Link}
            to={viewAllLink}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              fontWeight: 600,
              fontSize: '0.9375rem',
              color: isDarkBand ? '#C9A24B' : theme.palette.primary.main,
              textDecoration: 'none',
              transition: 'transform 0.2s ease',
              '&:hover': { transform: 'translateX(4px)' },
            }}
          >
            <span>View All</span>
            <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
          </Box>
        </Box>

        {/* Shelf Items Grid: 2 cols xs / 3 sm / 4 md+ */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: { xs: 2, sm: 2.5, md: 3 },
          }}
        >
          {isLoading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <Box key={idx} sx={{ minWidth: 0 }}>
                <ProductCardSkeleton />
              </Box>
            ))
          ) : products.length > 0 ? (
            products.map((product) => (
              <Box
                key={product._id || product.slug}
                sx={{
                  minWidth: 0,
                  height: '100%',
                }}
              >
                <ProductCard product={product} />
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
              New gifts arriving soon!
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
}
