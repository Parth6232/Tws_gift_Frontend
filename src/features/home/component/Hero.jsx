import React, { useEffect, useRef } from 'react';
import { Box, Typography, Container, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import Button from '../../../common/Button';
import SparklesIcon from '@mui/icons-material/AutoAwesomeRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { appConstants } from '../../../constant/appConstants';

export default function Hero() {
  const theme = useTheme();
  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const subheadRef = useRef(null);
  const ctaRef = useRef(null);
  const imageRef = useRef(null);
  const isDark = theme.palette.mode === 'dark';

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(headlineRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.9,
      })
        .from(
          subheadRef.current,
          {
            y: 30,
            opacity: 0,
            duration: 0.7,
          },
          '-=0.5'
        )
        .from(
          ctaRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
          },
          '-=0.4'
        )
        .from(
          imageRef.current,
          {
            scale: 0.92,
            opacity: 0,
            duration: 1.1,
            ease: 'back.out(1.4)',
          },
          '-=0.8'
        );

      // Subtle float animation for hero image
      gsap.to(imageRef.current, {
        y: -10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <Box
      ref={heroRef}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 4, md: 8 },
        pb: { xs: 6, md: 10 },
        background: isDark
          ? 'radial-gradient(ellipse at 50% 20%, rgba(242, 117, 143, 0.08) 0%, #1C1210 70%)'
          : 'radial-gradient(ellipse at 50% 20%, rgba(249, 213, 218, 0.5) 0%, #FFF8EC 70%)',
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1.1fr 0.9fr' },
            gap: { xs: 5, md: 8 },
            alignItems: 'center',
          }}
        >
          {/* Left Text Column */}
          <Box>
            {/* Tagline Pill */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 0.75,
                borderRadius: '999px',
                backgroundColor: isDark ? 'rgba(242, 117, 143, 0.15)' : '#FDF0F3',
                border: `1px solid ${isDark ? 'rgba(242, 117, 143, 0.3)' : '#F9D5DA'}`,
                color: theme.palette.primary.main,
                mb: 3,
              }}
            >
              <SparklesIcon sx={{ fontSize: 16 }} />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  fontSize: '0.8125rem',
                  textTransform: 'uppercase',
                }}
              >
                {appConstants.tagline}
              </Typography>
            </Box>

            {/* Headline */}
            <Typography
              ref={headlineRef}
              variant="h1"
              sx={{
                fontFamily: '"Fraunces", serif',
                fontWeight: 600,
                fontSize: { xs: 'clamp(2rem, 5.5vw, 2.5rem)', sm: 'clamp(2.5rem, 6vw, 3.25rem)', md: '4.25rem' },
                lineHeight: { xs: 1.15, md: 1.1 },
                letterSpacing: '-0.025em',
                color: theme.palette.text.primary,
                mb: 2.5,
              }}
            >
              One Gift. Two Smiles.{' '}
              <span
                style={{
                  color: isDark ? '#F2758F' : '#D9456B',
                  fontStyle: 'italic',
                }}
              >
                One Bigger Purpose.
              </span>
            </Typography>

            {/* Subheading */}
            <Typography
              ref={subheadRef}
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.1875rem' },
                lineHeight: 1.7,
                color: theme.palette.text.secondary,
                maxWidth: 580,
                mb: 4,
              }}
            >
              Personalized gifts, corporate &amp; bulk gifting, branded apparel, bags and handicraft pieces,
              gift-wrapped with care. Every order also gifts a stationery kit to a child in need.
            </Typography>

            {/* CTA Buttons */}
            <Box
              ref={ctaRef}
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
                mb: 5,
              }}
            >
              <Button
                component={Link}
                to="/shop"
                size="large"
                variant="contained"
                icon={<ArrowForwardRoundedIcon sx={{ fontSize: 20 }} />}
                sx={{
                  height: 52,
                  px: 3.5,
                  fontSize: '1rem',
                }}
              >
                Shop Gifts
              </Button>

              <Button
                component="a"
                href={`https://wa.me/${appConstants.whatsappNumber}?text=${encodeURIComponent(
                  'Hi TWS Gifts! I would like to personalize a special gift for an upcoming occasion.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                size="large"
                variant="white"
                icon={<WhatsAppIcon sx={{ color: '#25D366', fontSize: 20 }} />}
                sx={{
                  height: 52,
                  px: 3,
                  fontSize: '0.9375rem',
                }}
              >
                Personalize on WhatsApp
              </Button>
            </Box>

            {/* Truthful Highlights */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 3, sm: 5 },
                pt: 3,
                borderTop: `1px dashed ${theme.palette.divider}`,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontFamily: '"Fraunces", serif',
                    fontWeight: 700,
                    fontSize: '1.4rem',
                    color: theme.palette.text.primary,
                  }}
                >
                  1 Gift = 1 Kit
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Stationery kit donated
                </Typography>
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontFamily: '"Fraunces", serif',
                    fontWeight: 700,
                    fontSize: '1.4rem',
                    color: theme.palette.text.primary,
                  }}
                >
                  ₹999+
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Free shipping
                </Typography>
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontFamily: '"Fraunces", serif',
                    fontWeight: 700,
                    fontSize: '1.4rem',
                    color: theme.palette.text.primary,
                  }}
                >
                  Bulk
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Corporate orders welcome
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right Visual Column */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {/* Soft decorative glow background */}
            <Box
              sx={{
                position: 'absolute',
                width: { xs: 260, md: 440 },
                height: { xs: 260, md: 440 },
                borderRadius: '50%',
                backgroundColor: isDark ? 'rgba(242, 117, 143, 0.12)' : 'rgba(249, 213, 218, 0.6)',
                filter: 'blur(60px)',
                zIndex: 0,
              }}
            />

            {/* Logo Showcase */}
            <Box
              ref={imageRef}
              sx={{
                position: 'relative',
                zIndex: 1,
                maxWidth: { xs: 320, sm: 420, md: 480 },
                width: '100%',
                borderRadius: '32px',
                p: { xs: 2, md: 3 },
                backgroundColor: isDark ? '#2A1B17' : '#FFFFFF',
                border: `1.5px solid ${theme.palette.divider}`,
                boxShadow: isDark
                  ? '0 24px 60px rgba(0, 0, 0, 0.5)'
                  : '0 24px 60px rgba(74, 33, 24, 0.12)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box sx={isDark ? { backgroundColor: '#FFF8EC', borderRadius: '16px', padding: '16px', width: '100%', display: 'flex', justifyContent: 'center' } : { width: '100%', padding: '8px', display: 'flex', justifyContent: 'center' }}>
                <img
                  src="/assets/tws-logo-no-tagline.png"
                  alt="TWS Gifts"
                  style={{
                    width: '100%',
                    maxWidth: 320,
                    height: 'auto',
                    borderRadius: '12px',
                    objectFit: 'contain',
                    maxHeight: 260,
                  }}
                />
              </Box>

              {/* Floating Chip */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -16,
                  px: 3,
                  py: 1,
                  borderRadius: '999px',
                  backgroundColor: isDark ? '#3D251F' : '#FFFFFF',
                  border: `1.5px solid ${theme.palette.primary.main}`,
                  boxShadow: '0 8px 24px rgba(217, 69, 107, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: '"Fraunces", serif',
                    fontWeight: 600,
                    fontSize: '0.9375rem',
                    color: theme.palette.primary.main,
                  }}
                >
                  Gift with Purpose 💛
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
