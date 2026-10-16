import React from 'react';
import { Alert, Box, useTheme, Typography } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';

export default function InfoAlert({ type = 'warning', title, messages = [] }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const ALERT_CONFIG = {
    warning: {
      bg: isDark ? 'rgba(201, 162, 75, 0.15)' : '#FFF9EC',
      text: isDark ? '#E5C07B' : '#8A5800',
      border: isDark ? 'rgba(201, 162, 75, 0.3)' : '#FFE3A3',
      icon: <WarningAmberIcon sx={{ color: isDark ? '#E5C07B' : '#C9A24B' }} />,
    },
    info: {
      bg: isDark ? 'rgba(242, 117, 143, 0.12)' : '#FDF0F3',
      text: isDark ? '#F2758F' : '#D9456B',
      border: isDark ? 'rgba(242, 117, 143, 0.25)' : '#F9D5DA',
      icon: <InfoOutlinedIcon sx={{ color: isDark ? '#F2758F' : '#D9456B' }} />,
    },
    success: {
      bg: isDark ? 'rgba(46, 125, 50, 0.15)' : '#EDF7ED',
      text: isDark ? '#81C784' : '#1E4620',
      border: isDark ? 'rgba(76, 175, 80, 0.3)' : '#C8E6C9',
      icon: <CheckCircleOutlineRoundedIcon sx={{ color: isDark ? '#81C784' : '#2E7D32' }} />,
    },
    error: {
      bg: isDark ? 'rgba(211, 47, 47, 0.15)' : '#FDECEA',
      text: isDark ? '#E57373' : '#5F2120',
      border: isDark ? 'rgba(211, 47, 47, 0.3)' : '#FFCDD2',
      icon: <ErrorOutlineRoundedIcon sx={{ color: isDark ? '#E57373' : '#D32F2F' }} />,
    },
    default: {
      bg: theme.palette.background.paper,
      text: theme.palette.text.primary,
      border: theme.palette.divider,
      icon: null,
    },
  };

  const current = ALERT_CONFIG[type] || ALERT_CONFIG.default;

  return (
    <Alert
      icon={current.icon}
      sx={{
        mt: 2,
        borderRadius: '12px',
        alignItems: 'flex-start',
        background: current.bg,
        border: `1px solid ${current.border}`,
        '& .MuiAlert-message': {
          width: '100%',
        },
      }}
    >
      <Box>
        {title && (
          <Typography
            sx={{
              fontWeight: 600,
              mb: messages.length ? '6px' : 0,
              color: current.text,
              fontSize: '0.875rem',
            }}
          >
            {title}
          </Typography>
        )}

        {messages.map((msg, index) => (
          <Typography
            key={index}
            sx={{
              color: current.text,
              fontSize: '0.84rem',
              lineHeight: 1.45,
            }}
          >
            {msg}
          </Typography>
        ))}
      </Box>
    </Alert>
  );
}
