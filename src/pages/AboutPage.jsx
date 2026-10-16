import React from 'react';
import { Box, Typography, Container, useTheme } from '@mui/material';
import SectionHeading from '../common/SectionHeading';
import PageTransition from '../common/PageTransition';
import RibbonDivider from '../common/RibbonDivider';

export default function AboutPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <PageTransition>
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="md">
          <SectionHeading
            eyebrow="Our Story"
            title="Crafting Memories That Last Forever"
            description="TWS Gifts was born from a belief that personalized and corporate gifts carry unmatched emotional weight — and that every brand moment deserves a touch of artisan craft."
          />

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              fontSize: '1.0625rem',
              lineHeight: 1.8,
              color: theme.palette.text.secondary,
            }}
          >
            <Typography variant="body1" sx={{ fontSize: 'inherit', lineHeight: 'inherit' }}>
              We started in a small artisan workshop with a laser engraver, fine Indian teak wood, and a
              passion for turning ordinary moments into extraordinary heirlooms. Whether it’s an anniversary
              portrait that glows in the dark or a personalized wooden message box tucked beside a bedside table,
              our creations are crafted to be touched, held, and cherished for generations.
            </Typography>

            <Box
              sx={{
                p: 4,
                borderRadius: '24px',
                backgroundColor: isDark ? '#231613' : '#FDF0F3',
                border: `1.5px solid ${isDark ? 'rgba(242, 117, 143, 0.3)' : '#F9D5DA'}`,
                textAlign: 'center',
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontFamily: '"Fraunces", serif',
                  fontStyle: 'italic',
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  mb: 1.5,
                }}
              >
                &ldquo;Thoughtful Wishes. Meaningful Moments.&rdquo;
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                The TWS Gifts Tagline
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ fontSize: 'inherit', lineHeight: 'inherit' }}>
              Unlike mass-manufactured gifts, every single piece ordered from TWS Gifts is reviewed by our
              design team, hand-sanded, meticulously engraved, and placed into our signature blush ribbon box.
              When someone unties that ribbon, they feel the care, intimacy, and thought you poured into it.
            </Typography>
          </Box>

          <RibbonDivider sx={{ mt: 8 }} />
        </Container>
      </Box>
    </PageTransition>
  );
}
