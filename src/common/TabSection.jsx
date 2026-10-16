import React from 'react';
import { Box, useTheme, Typography } from '@mui/material';

export default function TabSection({ tabList = [], activeTab, onTabChange }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        mt: 2,
        display: 'flex',
        gap: { xs: 2, md: 3 },
        borderBottom: `1px solid ${theme.palette.divider}`,
        overflowX: 'auto',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {tabList.map((tab) => {
        const isSelected = activeTab === tab;
        return (
          <Box
            key={tab}
            onClick={() => onTabChange(tab)}
            sx={{
              position: 'relative',
              cursor: 'pointer',
              py: 1.5,
              px: { xs: 1.5, md: 2 },
              transition: 'color 0.2s ease',
              whiteSpace: 'nowrap',
              '&::after': {
                content: '""',
                position: 'absolute',
                left: 0,
                bottom: -1,
                width: '100%',
                height: '3px',
                borderRadius: '3px 3px 0 0',
                backgroundColor: theme.palette.primary.main,
                transform: isSelected ? 'scaleX(1)' : 'scaleX(0)',
                transformOrigin: 'left',
                transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              },
            }}
          >
            <Typography
              sx={{
                fontWeight: isSelected ? 600 : 500,
                fontSize: '0.9375rem',
                color: isSelected ? theme.palette.primary.main : theme.palette.text.secondary,
                transition: 'color 0.2s ease',
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              {tab}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
