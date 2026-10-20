import React from 'react';
import { Box, Tooltip, Typography, useTheme } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GoogleIcon from '@mui/icons-material/Google';
import { appConstants } from '../constant/appConstants';

// Brand palette for each platform
const PLATFORMS = [
  {
    key: 'instagram',
    label: 'Instagram',
    Icon: InstagramIcon,
    color: '#E1306C',
  },
  {
    key: 'facebook',
    label: 'Facebook',
    Icon: FacebookIcon,
    color: '#1877F2',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    Icon: LinkedInIcon,
    color: '#0A66C2',
  },
  {
    key: 'google',
    label: 'Google',
    Icon: GoogleIcon,
    color: '#4285F4',
  },
];

/**
 * SocialLinks — renders social platform icon-buttons or pill-buttons.
 *
 * Props:
 *  variant  'icons' | 'pills'   default 'icons'
 *  align    CSS justify-content  default 'flex-start'
 *  size     icon button size px  default 40
 *  sx       extra MUI sx prop
 */
export default function SocialLinks({
  variant = 'icons',
  align = 'flex-start',
  size = 40,
  sx = {},
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const links = appConstants.socialLinks || {};
  const activePlatforms = PLATFORMS.filter((p) => !!links[p.key]);

  if (!activePlatforms.length) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: variant === 'pills' ? 1.25 : 1,
        justifyContent: align,
        ...sx,
      }}
    >
      {activePlatforms.map(({ key, label, Icon, color }) => {
        const href = links[key];

        const bgLight = `${color}14`; // ~8% opacity
        const bgDark = `${color}26`;  // ~15% opacity
        const borderLight = `${color}30`;
        const borderDark = `${color}45`;

        const baseSx = {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.75,
          textDecoration: 'none',
          cursor: 'pointer',
          border: `1.5px solid ${isDark ? borderDark : borderLight}`,
          backgroundColor: isDark ? bgDark : bgLight,
          color: color,
          transition: 'background-color 0.2s ease, color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            backgroundColor: color,
            color: '#fff',
            transform: 'translateY(-3px)',
            boxShadow: `0 6px 18px ${color}55`,
          },
          '&:focus-visible': {
            outline: `2px solid ${color}`,
            outlineOffset: '3px',
          },
        };

        if (variant === 'pills') {
          return (
            <Box
              key={key}
              component="a"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`TWS Gifts on ${label}`}
              sx={{
                ...baseSx,
                borderRadius: '999px',
                px: 1.75,
                py: 0.75,
                minHeight: 36,
              }}
            >
              <Icon sx={{ fontSize: 18, flexShrink: 0 }} />
              <Typography
                component="span"
                sx={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  letterSpacing: '0.01em',
                  lineHeight: 1,
                  color: 'inherit',
                }}
              >
                {label}
              </Typography>
            </Box>
          );
        }

        // variant === 'icons'
        return (
          <Tooltip key={key} title={`TWS Gifts on ${label}`} arrow>
            <Box
              component="a"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`TWS Gifts on ${label}`}
              sx={{
                ...baseSx,
                borderRadius: '12px',
                width: size,
                height: size,
              }}
            >
              <Icon sx={{ fontSize: size * 0.48 }} />
            </Box>
          </Tooltip>
        );
      })}
    </Box>
  );
}
