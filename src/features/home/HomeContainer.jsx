import React from 'react';
import { Box, Typography, Container, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import Hero from './component/Hero';
import CategoryStrip from './component/CategoryStrip';
import ProductShelf from './component/ProductShelf';
import PersonalizationSteps from './component/PersonalizationSteps';
import WhyUs from './component/WhyUs';
import GiftWithPurpose from './component/GiftWithPurpose';

import RibbonDivider from '../../common/RibbonDivider';
import Button from '../../common/Button';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { productApiAction } from '../product/productApiSlice';
import { appConstants } from '../../constant/appConstants';

export default function HomeContainer() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Fetch Best Sellers
  const { data: bestSellersData, isLoading: loadingBestSellers } =
    productApiAction.useGetProductsQuery({ bestSeller: 'true', limit: 4 });

  // Fetch New Arrivals
  const { data: newArrivalsData, isLoading: loadingNewArrivals } =
    productApiAction.useGetProductsQuery({ newArrival: 'true', limit: 4 });

  // Fetch Premium Collection
  const { data: premiumData, isLoading: loadingPremium } =
    productApiAction.useGetProductsQuery({ premium: 'true', limit: 4 });

  const bestSellers = bestSellersData?.items || [];
  const newArrivals = newArrivalsData?.items || [];
  const premiumProducts = premiumData?.items || [];

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden' }}>
      {/* 1. Hero Section */}
      <Hero />

      {/* Ribbon Divider Motif */}
      <RibbonDivider />

      {/* 2. Category Strip */}
      <CategoryStrip />

      {/* 3. Best Sellers Shelf */}
      <ProductShelf
        eyebrow="Most Loved"
        title="Best Sellers"
        description="Our most loved gifts and everyday picks."
        products={bestSellers}
        isLoading={loadingBestSellers}
        viewAllLink="/shop?bestSeller=true"
      />

      {/* 4. How Personalization Works */}
      <PersonalizationSteps />

      {/* 5. New Arrivals Shelf */}
      <ProductShelf
        eyebrow="Fresh Additions"
        title="New Arrivals"
        description="Our latest gifts, apparel and accessories."
        products={newArrivals}
        isLoading={loadingNewArrivals}
        viewAllLink="/shop?newArrival=true"
      />

      {/* 6. Premium Collection (Visually Distinct Dark Band) */}
      <ProductShelf
        eyebrow="Special Occasions"
        title="The Premium Collection"
        description="Premium picks for special occasions and corporate gifting."
        products={premiumProducts}
        isLoading={loadingPremium}
        viewAllLink="/shop?premium=true"
        isDarkBand={true}
      />

      {/* 7. Why TWS Gifts */}
      <WhyUs />

      {/* 8. Gift with Purpose (Replaces Testimonials) */}
      <GiftWithPurpose />

      {/* 9. Final CTA Band */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          px: 3,
          backgroundColor: isDark ? '#231613' : '#FDF0F3',
          borderTop: `1px solid ${theme.palette.divider}`,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{
              fontFamily: '"Fraunces", serif',
              fontWeight: 600,
              fontSize: { xs: '2rem', sm: '2.75rem', md: '3.5rem' },
              color: theme.palette.text.primary,
              mb: 2,
              lineHeight: 1.15,
            }}
          >
            Ready to find the perfect gift?
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: { xs: '1rem', md: '1.125rem' },
              lineHeight: 1.7,
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Browse our full shop or talk to our team for custom, corporate or bulk gifting.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Button
              component={Link}
              to="/shop"
              size="large"
              variant="contained"
              icon={<ArrowForwardRoundedIcon sx={{ fontSize: 20 }} />}
              sx={{ px: 4, height: 52 }}
            >
              Explore Shop
            </Button>

            <Button
              component="a"
              href={`https://wa.me/${appConstants.whatsappNumber}?text=${encodeURIComponent(
                'Hello TWS Gifts! I would like to inquire about gifts.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              size="large"
              variant="white"
              icon={<WhatsAppIcon sx={{ color: '#25D366', fontSize: 20 }} />}
              sx={{ px: 3.5, height: 52 }}
            >
              Order on WhatsApp
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
