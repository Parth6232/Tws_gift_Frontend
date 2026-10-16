import React from 'react';
import { Box, Typography, Container, useTheme } from '@mui/material';
import SectionHeading from '../../../common/SectionHeading';
import { appConstants } from '../../../constant/appConstants';

export default function PersonalizationSteps() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const stepIcons = ['✨', '💬', '📦'];

  return (
    <Box
      sx={{
        py: { xs: 7, md: 10 },
        position: 'relative',
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.015)' : 'rgba(74, 33, 24, 0.015)',
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 } }}>
        <SectionHeading
          eyebrow="Simple & Thoughtful"
          title="How Personalization Works"
          description="We take away all the complexity of online customization. Here is how your memory comes alive in three easy steps."
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: { xs: 3, md: 4 },
            position: 'relative',
          }}
        >
          {appConstants.personalizationSteps.map((item, index) => (
            <Box
              key={item.step}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: '24px',
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.shadows[1],
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.25s ease',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  borderColor: theme.palette.primary.main,
                  boxShadow: isDark
                    ? '0 16px 36px rgba(0, 0, 0, 0.4)'
                    : '0 16px 36px rgba(74, 33, 24, 0.08)',
                },
              }}
            >
              {/* Step Badge */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: '16px',
                    backgroundColor: isDark ? 'rgba(242, 117, 143, 0.12)' : '#FDF0F3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                  }}
                >
                  {stepIcons[index]}
                </Box>

                <Typography
                  sx={{
                    fontFamily: '"Fraunces", serif',
                    fontWeight: 700,
                    fontSize: '1.75rem',
                    color: isDark ? 'rgba(242, 117, 143, 0.3)' : 'rgba(217, 69, 107, 0.2)',
                  }}
                >
                  {item.step}
                </Typography>
              </Box>

              <Typography
                variant="h5"
                sx={{
                  fontFamily: '"Fraunces", serif',
                  fontWeight: 600,
                  fontSize: '1.25rem',
                  color: theme.palette.text.primary,
                  mb: 1.5,
                }}
              >
                {item.title}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  lineHeight: 1.65,
                }}
              >
                {item.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
