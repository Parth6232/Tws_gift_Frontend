import React from 'react';
import { Box, Typography, Container, useTheme, Paper } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import NavigationRoundedIcon from '@mui/icons-material/NavigationRounded';
import SectionHeading from '../common/SectionHeading';
import Button from '../common/Button';
import PageTransition from '../common/PageTransition';
import CorporateBulkCta from '../common/CorporateBulkCta';
import { appConstants } from '../constant/appConstants';

export default function ContactPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <PageTransition>
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="md">
          <SectionHeading
            eyebrow="We’d Love to Help"
            title="Get in Touch"
            description="Have questions about orders, custom designs, corporate gifting, or bulk inquiries? We are just a message away."
          />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
              gap: 3,
              mb: 4,
            }}
          >
            {/* WhatsApp */}
            <Paper
              elevation={0}
              sx={{
                p: 3.5,
                borderRadius: '20px',
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '16px',
                  backgroundColor: '#E8F5E9',
                  color: '#25D366',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <WhatsAppIcon sx={{ fontSize: 28 }} />
              </Box>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
                WhatsApp Direct
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.primary.main, fontWeight: 700, mb: 1 }}>
                {appConstants.phoneDisplay}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.5, fontSize: '0.85rem' }}>
                Chat with our team for orders, custom designs and bulk gifting
              </Typography>
              <Button
                component="a"
                href={`https://wa.me/${appConstants.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                variant="white"
                sx={{ mt: 'auto', color: '#25D366', width: '100%' }}
              >
                Chat Now
              </Button>
            </Paper>

            {/* Email */}
            <Paper
              elevation={0}
              sx={{
                p: 3.5,
                borderRadius: '20px',
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
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
                  mb: 2,
                }}
              >
                <EmailOutlinedIcon sx={{ fontSize: 28 }} />
              </Box>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
                Email Support
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: theme.palette.primary.main, fontWeight: 700, mb: 1, wordBreak: 'break-all' }}
              >
                {appConstants.contactEmail}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.5, fontSize: '0.85rem' }}>
                Write to us with your requirements or questions
              </Typography>
              <Button
                component="a"
                href={`mailto:${appConstants.contactEmail}`}
                size="small"
                variant="white"
                sx={{ mt: 'auto', width: '100%' }}
              >
                Send Email
              </Button>
            </Paper>

            {/* Based in Indore */}
            <Paper
              elevation={0}
              sx={{
                p: 3.5,
                borderRadius: '20px',
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '16px',
                  backgroundColor: isDark ? 'rgba(201, 162, 75, 0.2)' : '#FFF3D6',
                  color: '#C9A24B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <LocationOnOutlinedIcon sx={{ fontSize: 28 }} />
              </Box>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
                Based in Indore
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5, fontSize: '0.825rem' }}>
                {appConstants.fullAddress}
              </Typography>
              {appConstants.businessHours && (
                <Typography variant="caption" sx={{ color: theme.palette.primary.main, fontWeight: 600, mb: 1.5 }}>
                  {appConstants.businessHours}
                </Typography>
              )}
              {appConstants.mapsUrl && (
                <Button
                  component="a"
                  href={appConstants.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  variant="white"
                  icon={<NavigationRoundedIcon sx={{ fontSize: 16 }} />}
                  sx={{ mt: 'auto', width: '100%', color: '#C9A24B' }}
                >
                  Get Directions
                </Button>
              )}
            </Paper>
          </Box>

          {/* Corporate & Bulk CTA */}
          <CorporateBulkCta sx={{ mt: 5 }} />
        </Container>
      </Box>
    </PageTransition>
  );
}
