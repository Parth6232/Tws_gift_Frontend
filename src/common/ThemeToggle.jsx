import React from 'react';
import { IconButton, Tooltip, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import { themeActions } from '../store/redux/slices/themeSlice';

export default function ThemeToggle({ sx = {} }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const mode = useSelector((state) => state.theme?.mode || 'light');
  const isDark = mode === 'dark';

  const handleToggle = () => {
    dispatch(themeActions.toggleTheme());
  };

  return (
    <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton
        onClick={handleToggle}
        aria-label="Toggle color theme"
        sx={{
          width: 40,
          height: 40,
          borderRadius: '12px',
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(74, 33, 24, 0.04)',
          color: isDark ? '#F5D580' : theme.palette.primary.main,
          overflow: 'hidden',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(74, 33, 24, 0.08)',
            transform: 'scale(1.05)',
          },
          ...sx,
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="dark"
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <LightModeRoundedIcon sx={{ fontSize: 20 }} />
            </motion.div>
          ) : (
            <motion.div
              key="light"
              initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <DarkModeRoundedIcon sx={{ fontSize: 20 }} />
            </motion.div>
          )}
        </AnimatePresence>
      </IconButton>
    </Tooltip>
  );
}
