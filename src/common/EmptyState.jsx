import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import CardGiftcardRoundedIcon from '@mui/icons-material/CardGiftcardRounded';
import Button from './Button';

export default function EmptyState({
  icon,
  title = 'No items found',
  description = 'There are no items to display at this moment.',
  actionText,
  onAction,
  sx = {},
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        px: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        maxWidth: 460,
        mx: 'auto',
        ...sx,
      }}
    >
      <Box
        sx={{
          width: 76,
          height: 76,
          borderRadius: '24px',
          backgroundColor: isDark ? 'rgba(242, 117, 143, 0.12)' : '#FDF0F3',
          border: `1.5px dashed ${isDark ? 'rgba(242, 117, 143, 0.3)' : '#F9D5DA'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2.5,
          color: theme.palette.primary.main,
        }}
      >
        {icon || <CardGiftcardRoundedIcon sx={{ fontSize: 38 }} />}
      </Box>

      <Typography
        variant="h5"
        sx={{
          fontFamily: '"Fraunces", serif',
          fontWeight: 600,
          color: theme.palette.text.primary,
          mb: 1,
        }}
      >
        {title}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: theme.palette.text.secondary,
          lineHeight: 1.6,
          mb: actionText ? 3 : 0,
        }}
      >
        {description}
      </Typography>

      {actionText && (
        <Button variant="contained" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </Box>
  );
}
