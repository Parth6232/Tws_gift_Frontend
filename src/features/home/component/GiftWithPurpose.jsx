import React from 'react';
import { Box, Container, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import SectionHeading from '../../../common/SectionHeading';
import GiftEquation from '../../../common/GiftEquation';
import CorporateBulkCta from '../../../common/CorporateBulkCta';
import Button from '../../../common/Button';

export default function GiftWithPurpose() {
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 7, md: 9 },
        position: 'relative',
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(180deg, rgba(28, 18, 16, 0.4) 0%, rgba(42, 27, 23, 0.6) 100%)'
            : 'linear-gradient(180deg, rgba(255, 248, 236, 0.4) 0%, rgba(249, 213, 218, 0.25) 100%)',
      }}
    >
      <Container maxWidth="lg">
        <SectionHeading
          eyebrow="Gift with Purpose"
          eyebrowIcon={<AutoAwesomeRoundedIcon sx={{ fontSize: 16 }} />}
          title="One Gift. Two Smiles."
          description="Every TWS order shares a stationery kit with a child in need."
        />

        {/* 3-Step Visual Equation */}
        <GiftEquation sx={{ mt: 3, mb: 4 }} />

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            flexWrap: 'wrap',
            mb: 4,
          }}
        >
          <Button
            variant="contained"
            component={Link}
            to="/about"
            icon={<MenuBookRoundedIcon />}
            sx={{ px: 3.5, py: 1.25 }}
          >
            Read Our Story
          </Button>
          <Button
            variant="surface"
            component={Link}
            to="/shop"
            icon={<ShoppingBagRoundedIcon />}
            sx={{ px: 3.5, py: 1.25 }}
          >
            Shop Gifts
          </Button>
        </Box>

        {/* Corporate & Bulk CTA */}
        <CorporateBulkCta sx={{ mt: 2 }} />
      </Container>
    </Box>
  );
}
