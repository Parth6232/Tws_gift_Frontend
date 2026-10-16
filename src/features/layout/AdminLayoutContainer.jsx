import React, { useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Header from '../../common/Header';
import Sidebar from '../../common/Sidebar';
import Loader from '../../common/Loader';

export default function AdminLayoutContainer() {
  const theme = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toast = useSelector((state) => state.toast);
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        backgroundColor: isDark ? '#1C1210' : '#F9F4EC',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      <Header setIsMenuOpen={setIsMenuOpen} />

      <Box
        sx={{
          display: 'flex',
          height: '100dvh',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

        {isMenuOpen && (
          <Box
            sx={{
              position: 'fixed',
              width: '100vw',
              height: '100dvh',
              background: 'rgba(0, 0, 0, 0.45)',
              backdropFilter: 'blur(3px)',
              zIndex: 1150,
            }}
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        <Box
          component="main"
          sx={{
            marginTop: '72px',
            width: '100%',
            overflowY: 'auto',
            flex: 1,
            minWidth: 0,
            p: { xs: 2.5, md: 4 },
            position: 'relative',
          }}
        >
          <Outlet />

          {toast.isLoading && (
            <Loader
              loading
              position="absolute"
              sx={{
                width: '100%',
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
