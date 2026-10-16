import React from 'react';
import { Box, IconButton, Typography, useTheme, Chip, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toastActions } from '../store/redux/slices/toastSlice';
import { authApiAction } from '../features/auth/authApiSlice';
import ThemeToggle from './ThemeToggle';

export default function Header({ setIsMenuOpen }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.toast?.userProfile);
  const [logoutMutation] = authApiAction.useLogoutMutation();
  const isDark = theme.palette.mode === 'dark';
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isMd = useMediaQuery(theme.breakpoints.up('md'));

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch {
      // ignore
    } finally {
      dispatch(toastActions.resetProfileData());
      navigate('/admin/login', { replace: true });
    }
  };

  return (
    <Box
      sx={{
        height: '72px',
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: { xs: 2, md: 3 },
        position: 'fixed',
        top: 0,
        // On md+ leave room for sidebar (260px wide)
        left: { xs: 0, md: '260px' },
        right: 0,
        zIndex: 1100,
        boxShadow: theme.shadows[1],
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
        <IconButton
          onClick={() => setIsMenuOpen(true)}
          sx={{ display: { xs: 'flex', md: 'none' }, color: theme.palette.text.primary, flexShrink: 0 }}
          aria-label="Open sidebar"
        >
          <MenuIcon />
        </IconButton>

        {/* Brand lockup — only on xs/sm (md+ sidebar already shows it) */}
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            alignItems: 'center',
            gap: 0.75,
            minWidth: 0,
          }}
        >
          <Box sx={isDark ? { backgroundColor: '#FFF8EC', borderRadius: '8px', padding: '4px', display: 'inline-flex' } : {}}>
            <img
              src="/assets/tws-logo-mark.png"
              alt="TWS Gifts"
              style={{ height: 32, width: 'auto', display: 'block' }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
            <Typography
              sx={{
                fontFamily: '"Fraunces", serif',
                fontWeight: 700,
                fontSize: '1.1rem',
                color: isDark ? '#FFF8EC' : '#0A291E',
                letterSpacing: '-0.02em',
              }}
            >
              TWS
            </Typography>
            <Typography
              sx={{
                fontFamily: '"Fraunces", serif',
                fontWeight: 700,
                fontSize: '1.1rem',
                color: '#CC9425',
                letterSpacing: '-0.02em',
              }}
            >
              &nbsp;Gifts
            </Typography>
          </Box>
        </Box>

        {/* Control Center chip — hide on xs */}
        <Typography
          variant="caption"
          sx={{
            display: { xs: 'none', sm: 'inline-block' },
            ml: { xs: 0, md: 0 },
            px: 1,
            py: 0.25,
            borderRadius: '6px',
            backgroundColor:
              theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(74,33,24,0.06)',
            color: theme.palette.text.secondary,
            fontWeight: 600,
            fontSize: '0.6875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Control Center
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
        <ThemeToggle />

        {/* User pill — hidden on xs (avatar only) */}
        {user && !isXs && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              py: 0.5,
              px: 1.5,
              borderRadius: '12px',
              backgroundColor:
                theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(74,33,24,0.03)',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: theme.palette.primary.main,
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '0.8125rem',
                flexShrink: 0,
              }}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : <PersonOutlineRoundedIcon sx={{ fontSize: 18 }} />}
            </Box>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2, color: theme.palette.text.primary }}>
                {user.name}
              </Typography>
              <Chip
                label={user.role === 'admin' ? 'Administrator' : 'Manager'}
                size="small"
                sx={{
                  height: 18,
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  backgroundColor:
                    user.role === 'admin'
                      ? theme.palette.mode === 'dark'
                        ? 'rgba(201, 162, 75, 0.2)'
                        : '#FFF3D6'
                      : theme.palette.mode === 'dark'
                      ? 'rgba(242, 117, 143, 0.2)'
                      : '#FDF0F3',
                  color:
                    user.role === 'admin'
                      ? theme.palette.mode === 'dark'
                        ? '#F5D580'
                        : '#8A5800'
                      : theme.palette.primary.main,
                }}
              />
            </Box>
          </Box>
        )}

        {/* Avatar only on xs when user exists */}
        {user && isXs && (
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              backgroundColor: theme.palette.primary.main,
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '0.875rem',
              flexShrink: 0,
            }}
          >
            {user.name ? user.name.charAt(0).toUpperCase() : <PersonOutlineRoundedIcon sx={{ fontSize: 18 }} />}
          </Box>
        )}

        <IconButton
          onClick={handleLogout}
          title="Sign out"
          aria-label="Logout"
          sx={{
            width: 40,
            height: 40,
            borderRadius: '12px',
            border: `1px solid ${theme.palette.divider}`,
            color: theme.palette.text.secondary,
            flexShrink: 0,
            '&:hover': {
              backgroundColor: '#D32F2F',
              color: '#FFFFFF',
              borderColor: '#D32F2F',
            },
          }}
        >
          <LogoutRoundedIcon sx={{ fontSize: 19 }} />
        </IconButton>
      </Box>
    </Box>
  );
}
