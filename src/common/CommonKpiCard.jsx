import React from 'react';
import { Card, Box, useTheme, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const CommonKpiCard = ({
  icon,
  label,
  value,
  valuecolor,
  subtitle,
  onClick,
  sx = {},
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Card
      component={motion.div}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        display: 'flex',
        width: '100%',
        minWidth: 0,
        padding: { xs: '16px', md: '24px' },
        borderRadius: '16px',
        height: '100%',
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: isDark
          ? '0 4px 20px rgba(0, 0, 0, 0.3)'
          : '0 4px 20px rgba(74, 33, 24, 0.04)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        ...sx,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, width: '100%' }}>
        {icon && (
          <Box
            sx={{
              width: { xs: 44, md: 52 },
              height: { xs: 44, md: 52 },
              borderRadius: '14px',
              backgroundColor: isDark ? 'rgba(242, 117, 143, 0.12)' : 'rgba(217, 69, 107, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: theme.palette.primary.main,
            }}
          >
            {typeof icon === 'string' ? (
              <img
                style={{
                  height: '28px',
                  width: '28px',
                  objectFit: 'contain',
                }}
                src={icon}
                alt="kpi-icon"
              />
            ) : (
              icon
            )}
          </Box>
        )}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              lineHeight: 1.4,
              mb: '4px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: theme.palette.text.secondary,
              overflowWrap: 'anywhere',
              whiteSpace: 'normal',
            }}
          >
            {label}
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Fraunces", serif',
              lineHeight: 1.1,
              fontSize: { xs: 'clamp(1.5rem, 2.2vw, 2.25rem)', md: '2.25rem' },
              fontWeight: 600,
              color: valuecolor || theme.palette.text.primary,
            }}
          >
            {value}
          </Typography>
          {subtitle && (
            <Typography
              variant="caption"
              sx={{ color: theme.palette.text.secondary, mt: 0.5, display: 'block' }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
    </Card>
  );
};

export default CommonKpiCard;
