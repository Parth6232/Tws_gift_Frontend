import React from 'react';
import { Box, Typography, Container, Card, useTheme, Link as MuiLink } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import SectionHeading from '../common/SectionHeading';
import PageTransition from '../common/PageTransition';
import RibbonDivider from '../common/RibbonDivider';
import GiftEquation from '../common/GiftEquation';
import CorporateBulkCta from '../common/CorporateBulkCta';
import { appConstants } from '../constant/appConstants';

const hindiTypographySx = {
  fontFamily: '"Noto Sans Devanagari", "DM Sans", sans-serif',
};

export default function AboutPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <PageTransition>
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="md">
          {/* Section 1: Intro */}
          <SectionHeading
            eyebrow="Our Story"
            title="One Gift. Two Smiles. One Bigger Purpose."
            description="Every TWS gift is more than a present - it's an opportunity to spread happiness, support education, and give back."
          />

          {/* Section 2: Meet the Founder */}
          <Box
            sx={{
              mt: { xs: 5, md: 7 },
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              gap: { xs: 4, md: 5 },
            }}
          >
            {/* Left Column: Founder Photo */}
            <Box
              sx={{
                flexShrink: 0,
                width: { xs: '100%', sm: 320, md: 340 },
                maxWidth: 360,
                mx: 'auto',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Box
                component="img"
                src="/assets/founder-photo.png"
                alt="Aniruddha Gupta, founder of TWS"
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: 440,
                  objectFit: 'cover',
                  borderRadius: '24px',
                  border: `2px solid ${isDark ? 'rgba(201, 162, 75, 0.4)' : '#F9D5DA'}`,
                  boxShadow: isDark
                    ? '0 16px 36px rgba(0,0,0,0.5)'
                    : '0 16px 36px rgba(74, 33, 24, 0.1)',
                }}
              />
            </Box>

            {/* Right Column: Founder Details & Story */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box>
                <Typography
                  variant="overline"
                  sx={{
                    color: '#C9A24B',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    fontSize: '0.8rem',
                  }}
                >
                  Meet the Founder
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: '"Fraunces", serif',
                    fontWeight: 700,
                    fontSize: { xs: '1.75rem', md: '2.1rem' },
                    color: theme.palette.text.primary,
                    mt: 0.5,
                  }}
                >
                  Aniruddha Gupta
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ color: theme.palette.primary.main, fontWeight: 600, mt: 0.25 }}
                >
                  Founder, TWS Personalized &amp; Corporate Gifting
                </Typography>
              </Box>

              {/* Quote Card */}
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: '18px',
                  backgroundColor: isDark ? 'rgba(217, 69, 107, 0.12)' : '#FDF0F3',
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: '"Fraunces", serif',
                    fontStyle: 'italic',
                    fontSize: '1.05rem',
                    lineHeight: 1.6,
                    color: theme.palette.text.primary,
                  }}
                >
                  &ldquo;Trendy, thoughtful gifts should be affordable for everyone, and every gift sold
                  should help someone else.&rdquo;
                </Typography>
              </Box>

              <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.8 }}>
                I started TWS in Indore in 2025 with two ideas. First, gifting should be affordable for all.
                Second, with every order we receive, we share one stationery set with a child in need, and
                the revenue TWS generates supports social work, especially child education.
              </Typography>

              <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.8 }}>
                {appConstants.instagramHandle ? (
                  <>
                    This work connects with our community initiative{' '}
                    <MuiLink
                      href={appConstants.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: theme.palette.primary.main, fontWeight: 600, textDecoration: 'underline' }}
                    >
                      @{appConstants.instagramHandle}
                    </MuiLink>
                    , where we bring smiles and opportunities to children who need them most.
                  </>
                ) : (
                  'This work connects with our community initiative, where we bring smiles and opportunities to children who need them most.'
                )}
              </Typography>
            </Box>
          </Box>

          <RibbonDivider sx={{ my: { xs: 5, md: 7 } }} />

          {/* Section 3: Gift with Purpose (Visual & Hindi copy) */}
          <Box sx={{ textAlign: 'center', my: { xs: 4, md: 6 } }}>
            <Typography
              lang="hi"
              variant="h4"
              sx={{
                ...hindiTypographySx,
                fontWeight: 700,
                fontSize: { xs: '1.4rem', sm: '1.75rem', md: '2rem' },
                color: theme.palette.text.primary,
                mb: 1.5,
              }}
            >
              आपका एक गिफ्ट, बच्चों के लिए एक स्टेशनरी किट!
            </Typography>

            <GiftEquation sx={{ my: 4 }} />

            <Typography
              lang="hi"
              variant="body1"
              sx={{
                ...hindiTypographySx,
                fontWeight: 500,
                color: theme.palette.primary.main,
                fontSize: { xs: '1rem', sm: '1.1rem' },
                mb: 1,
              }}
            >
              TWS Personalized &amp; Corporate Gifting की एक छोटी-सी पहल, बच्चों की शिक्षा के लिए ❤️
            </Typography>
            <Typography
              lang="hi"
              variant="body2"
              sx={{
                ...hindiTypographySx,
                color: theme.palette.text.secondary,
                fontSize: { xs: '0.95rem', sm: '1.05rem' },
              }}
            >
              आप जितने गिफ्ट खरीदेंगे, उतनी ही स्टेशनरी किट जरूरतमंद बच्चों को दी जाएगी।
            </Typography>
          </Box>

          {/* Section 4: Transparency Box */}
          <Card
            sx={{
              p: { xs: 3, sm: 4 },
              my: 5,
              borderRadius: '24px',
              backgroundColor: isDark ? 'rgba(37, 211, 102, 0.08)' : '#F2FAF5',
              border: `1.5px solid ${isDark ? 'rgba(37, 211, 102, 0.3)' : 'rgba(37, 211, 102, 0.35)'}`,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 2.5,
            }}
          >
            <Box
              sx={{
                width: 54,
                height: 54,
                borderRadius: '16px',
                background: '#25D366',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <WhatsAppIcon sx={{ fontSize: 32 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography
                  lang="hi"
                  sx={{
                    ...hindiTypographySx,
                    fontWeight: 700,
                    fontSize: { xs: '1.1rem', sm: '1.2rem' },
                    color: theme.palette.text.primary,
                  }}
                >
                  पारदर्शिता हमारी प्राथमिकता
                </Typography>
                <VerifiedRoundedIcon sx={{ fontSize: 20, color: '#25D366' }} />
              </Box>
              <Typography
                lang="hi"
                sx={{
                  ...hindiTypographySx,
                  color: theme.palette.text.secondary,
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  mb: 1,
                }}
              >
                आपको स्टेशनरी किट वितरण की जानकारी WhatsApp पर व्यक्तिगत रूप से (One-to-One) दी जाएगी।
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  fontStyle: 'italic',
                }}
              >
                Transparency is our priority. Details of your stationery kit distribution are shared with you
                personally, one-to-one, on WhatsApp.
              </Typography>
            </Box>
          </Card>

          {/* Section 5: Impact Callout */}
          <Box
            sx={{
              p: { xs: 3.5, sm: 4.5 },
              my: 5,
              borderRadius: '24px',
              backgroundColor: isDark ? 'rgba(242, 117, 143, 0.12)' : '#FDF0F3',
              border: `1.5px solid ${isDark ? 'rgba(242, 117, 143, 0.3)' : '#F9D5DA'}`,
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Fraunces", serif',
                fontWeight: 600,
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                lineHeight: 1.7,
                color: theme.palette.text.primary,
                maxWidth: 680,
                mx: 'auto',
              }}
            >
              &ldquo;When you order a gift from TWS, you are not only making someone smile. A child receives
              a stationery set too, and moves one step closer to the classroom.&rdquo;
            </Typography>
          </Box>

          {/* Section 6: Corporate & Bulk Gifting CTA */}
          <CorporateBulkCta sx={{ my: 5 }} />

          {/* Section 7: Closing */}
          <Box sx={{ textAlign: 'center', mt: 6, mb: 4 }}>
            <Typography
              lang="hi"
              variant="h6"
              sx={{
                ...hindiTypographySx,
                fontWeight: 700,
                fontSize: { xs: '1.15rem', sm: '1.35rem' },
                color: theme.palette.primary.main,
                mb: 1.5,
              }}
            >
              आइए, अपने हर गिफ्ट के साथ किसी बच्चे की पढ़ाई में योगदान दें। ❤️
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: '"Fraunces", serif',
                fontStyle: 'italic',
                fontSize: { xs: '1.05rem', sm: '1.2rem' },
                color: theme.palette.text.primary,
                mb: 1,
              }}
            >
              Gift with Purpose. Give a Child a Brighter Future.
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: '#C9A24B',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontSize: '0.85rem',
              }}
            >
              {appConstants.tagline}
            </Typography>
          </Box>

          <RibbonDivider sx={{ mt: 6 }} />
        </Container>
      </Box>
    </PageTransition>
  );
}
