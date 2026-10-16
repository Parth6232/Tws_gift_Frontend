import React from 'react';
import { Box, Typography, Container, useTheme, Paper } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import SectionHeading from '../common/SectionHeading';
import Button from '../common/Button';
import PageTransition from '../common/PageTransition';
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
            description="Have questions about photo resolutions, custom sizes, corporate gifting, or rush orders? We are just a message away."
          />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
              gap: 3,
              mb: 6,
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
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Instant response from our artisans
              </Typography>
              <Button
                component="a"
                href={`https://wa.me/${appConstants.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                variant="white"
                sx={{ mt: 'auto', color: '#25D366' }}
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
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {appConstants.contactEmail}
              </Typography>
              <Button
                component="a"
                href={`mailto:${appConstants.contactEmail}`}
                size="small"
                variant="white"
                sx={{ mt: 'auto' }}
              >
                Send Email
              </Button>
            </Paper>

            {/* Studio Workshop */}
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
                Studio Workshop
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Artisan Lane, New Delhi, India
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.primary.main, fontWeight: 600, mt: 'auto' }}>
                Mon – Sat, 10 AM – 7 PM
              </Typography>
            </Paper>
          </Box>
        </Container>
      </Box>
    </PageTransition>
  );
}
