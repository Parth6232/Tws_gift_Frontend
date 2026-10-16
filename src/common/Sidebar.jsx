import React from 'react';
import { Box, Typography, IconButton, useTheme, Divider } from '@mui/material';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';

export default function Sidebar({ isMenuOpen, setIsMenuOpen }) {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === 'dark';

  const user = useSelector((state) => state.toast?.userProfile);
  const isAdmin = user?.role === 'admin';
  const hasProductCreate = user?.permissions?.includes('product:create') || isAdmin;

  // Build menu list according to role & permissions
  const menuItems = [];

  if (isAdmin) {
    menuItems.push({
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: <DashboardRoundedIcon sx={{ fontSize: 20 }} />,
    });
  }

  if (hasProductCreate) {
    menuItems.push({
      name: isAdmin ? 'Products' : 'My Products',
      path: '/admin/products',
      icon: <Inventory2RoundedIcon sx={{ fontSize: 20 }} />,
    });
  }

  if (isAdmin) {
    menuItems.push(
      {
        name: 'Categories',
        path: '/admin/categories',
        icon: <CategoryRoundedIcon sx={{ fontSize: 20 }} />,
      },
      {
        name: 'Team & Access',
        path: '/admin/team',
        icon: <GroupRoundedIcon sx={{ fontSize: 20 }} />,
      },
      {
        name: 'Activity Log',
        path: '/admin/activity',
        icon: <HistoryRoundedIcon sx={{ fontSize: 20 }} />,
      }
    );
  }

  const isActive = (path) => {
    if (path === '/admin/dashboard') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <Box
      sx={{
        width: '260px',
        minWidth: '260px',
        height: '100dvh',
        backgroundColor: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
        zIndex: 1200,
        position: { xs: 'fixed', md: 'relative' },
        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        left: { xs: isMenuOpen ? 0 : 'min(-260px, -85vw)', md: 0 },
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: { xs: theme.shadows[4], md: 'none' },
        // On xs ensure it doesn't exceed 85vw
        maxWidth: { xs: '85vw', md: '260px' },
      }}
    >
      {/* Sidebar Header */}
      <Box
        sx={{
          height: '72px',
          px: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${theme.palette.divider}`,
          flexShrink: 0,
        }}
      >
        <Box
          component={Link}
          to="/admin/dashboard"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            textDecoration: 'none',
            minWidth: 0,
          }}
        >
          <Box sx={isDark ? { backgroundColor: '#FFF8EC', borderRadius: '8px', padding: '6px', display: 'inline-flex', flexShrink: 0 } : { flexShrink: 0 }}>
            <img
              src="/assets/tws-logo-mark.png"
              alt="TWS Gifts"
              style={{ height: 34, width: 'auto', display: 'block' }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'baseline', minWidth: 0 }}>
            <Typography
              sx={{
                fontFamily: '"Fraunces", serif',
                fontWeight: 700,
                fontSize: '1.125rem',
                color: isDark ? '#FFF8EC' : '#0A291E',
                whiteSpace: 'nowrap',
              }}
            >
              TWS
            </Typography>
            <Typography
              sx={{
                fontFamily: '"Fraunces", serif',
                fontWeight: 700,
                fontSize: '1.125rem',
                color: '#CC9425',
                whiteSpace: 'nowrap',
              }}
            >
              &nbsp;Gifts
            </Typography>
          </Box>
        </Box>

        <IconButton
          sx={{ display: { xs: 'flex', md: 'none' }, color: theme.palette.text.primary, flexShrink: 0 }}
          onClick={() => setIsMenuOpen(false)}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Navigation Links — scrollable */}
      <Box sx={{ p: 2, flex: 1, overflowY: 'auto', minHeight: 0 }}>
        <Typography
          variant="caption"
          sx={{
            px: 1.5,
            mb: 1.5,
            display: 'block',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: theme.palette.text.secondary,
            fontSize: '0.6875rem',
          }}
        >
          Navigation
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Box
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2,
                  py: 1.25,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  backgroundColor: active
                    ? isDark
                      ? 'rgba(242, 117, 143, 0.15)'
                      : '#FDF0F3'
                    : 'transparent',
                  color: active ? theme.palette.primary.main : theme.palette.text.primary,
                  fontWeight: active ? 600 : 500,
                  fontSize: '0.9rem',
                  transition: 'all 0.15s ease',
                  border: active
                    ? `1px solid ${isDark ? 'rgba(242, 117, 143, 0.3)' : '#F9D5DA'}`
                    : '1px solid transparent',
                  '&:hover': {
                    backgroundColor: active
                      ? isDark
                        ? 'rgba(242, 117, 143, 0.2)'
                        : '#FDF0F3'
                      : isDark
                      ? 'rgba(255, 255, 255, 0.04)'
                      : 'rgba(74, 33, 24, 0.04)',
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <Box
                  sx={{
                    color: active ? theme.palette.primary.main : theme.palette.text.secondary,
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </Box>
                <span>{item.name}</span>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Divider sx={{ borderColor: theme.palette.divider, flexShrink: 0 }} />

      {/* Switch to Storefront Link — pinned at bottom */}
      <Box sx={{ p: 2, flexShrink: 0 }}>
        <Box
          component={Link}
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2,
            py: 1.25,
            borderRadius: '12px',
            textDecoration: 'none',
            color: theme.palette.text.secondary,
            fontSize: '0.875rem',
            fontWeight: 500,
            border: `1px solid ${theme.palette.divider}`,
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              backgroundColor: isDark ? 'rgba(242, 117, 143, 0.08)' : '#FDF0F3',
            },
          }}
        >
          <StorefrontRoundedIcon sx={{ fontSize: 18, flexShrink: 0 }} />
          <span>View Live Storefront</span>
        </Box>
      </Box>
    </Box>
  );
}
