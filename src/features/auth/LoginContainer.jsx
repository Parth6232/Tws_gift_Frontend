import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  useTheme,
  Alert,
} from '@mui/material';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import Button from '../../common/Button';
import Textfield from '../../common/Textfield';
import { authApiAction } from './authApiSlice';
import { toastActions } from '../../store/redux/slices/toastSlice';
import ThemeToggle from '../../common/ThemeToggle';
import { appConstants } from '../../constant/appConstants';

export default function LoginContainer() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isDark = theme.palette.mode === 'dark';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [loginMutation, { isLoading }] = authApiAction.useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setErrorMsg('');

    try {
      const res = await loginMutation({
        email: email.trim(),
        password,
      }).unwrap();

      if (res?.user) {
        dispatch(toastActions.setProfileData(res.user));
        const redirectPath =
          location.state?.from?.pathname ||
          (res.user.role === 'admin' ? '/admin/dashboard' : '/admin/products');
        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      setErrorMsg(err?.data?.message || err?.message || 'Invalid email or password.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isDark ? '#1C1210' : '#FFF8EC',
        p: { xs: 2, md: 4 },
        position: 'relative',
      }}
    >
      <Box sx={{ position: 'absolute', top: 20, right: 24, zIndex: 10 }}>
        <ThemeToggle />
      </Box>

      {/* Split Layout Container */}
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 1040,
          minHeight: 580,
          borderRadius: '32px',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.05fr 1fr' },
          border: `1.5px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          boxShadow: isDark
            ? '0 24px 64px rgba(0, 0, 0, 0.6)'
            : '0 24px 64px rgba(74, 33, 24, 0.1)',
        }}
      >
        {/* Left Side: Branded Illustration / Story */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 6,
            background: isDark
              ? 'linear-gradient(135deg, #2A1713 0%, #1A0D0B 100%)'
              : 'linear-gradient(135deg, #FDF0F3 0%, #FFF3E8 100%)',
            borderRight: `1px solid ${theme.palette.divider}`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top Brand Logo */}
          <Box>
            <Box sx={isDark ? { backgroundColor: '#FFF8EC', borderRadius: '12px', padding: '8px', display: 'inline-flex' } : {}}>
              <img
                src="/assets/tws-logo-no-tagline.png"
                alt="TWS Gifts"
                style={{ maxWidth: 220, width: '100%', height: 'auto', objectFit: 'contain' }}
              />
            </Box>
            <Typography
              sx={{
                fontFamily: '"Fraunces", serif',
                fontStyle: 'italic',
                color: '#CC9425',
                fontSize: '0.9375rem',
                fontWeight: 600,
                mt: 1,
              }}
            >
              {appConstants.tagline}
            </Typography>
          </Box>

          {/* Center Graphic & Quotes */}
          <Box sx={{ my: 'auto', textAlign: 'center', py: 4 }}>
            <Box
              sx={{
                width: 140,
                height: 140,
                borderRadius: '32px',
                mx: 'auto',
                mb: 3,
                p: 2,
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[3],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box sx={isDark ? { backgroundColor: '#FFF8EC', borderRadius: '16px', padding: '12px', display: 'inline-flex' } : {}}>
                <img
                  src="/assets/tws-logo-mark.png"
                  alt="TWS Gifts"
                  style={{ width: '100%', height: '100%', maxWidth: 90, objectFit: 'contain' }}
                />
              </Box>
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Fraunces", serif',
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 1.5,
              }}
            >
              Gifting Control Center
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary, maxWidth: 360, mx: 'auto', lineHeight: 1.6 }}
            >
              Manage products, categories, team access and activity for TWS Gifts.
            </Typography>
          </Box>

          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, textAlign: 'center' }}>
            © {new Date().getFullYear()} TWS Gifts. Secure cookie-based staff authentication.
          </Typography>
        </Box>

        {/* Right Side: Login Form */}
        <Box
          sx={{
            p: { xs: 4, sm: 6 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {/* Mobile Logo Lockup */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: { xs: 'flex', md: 'none' },
              alignItems: 'center',
              gap: 1.5,
              textDecoration: 'none',
              mb: 3,
            }}
          >
            <Box sx={isDark ? { backgroundColor: '#FFF8EC', borderRadius: '8px', padding: '4px', display: 'inline-flex' } : {}}>
              <img src="/assets/tws-logo-mark.png" alt="TWS Gifts" style={{ height: 36, width: 'auto' }} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
              <Typography sx={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: '1.25rem', color: isDark ? '#FFF8EC' : '#0A291E' }}>TWS</Typography>
              <Typography sx={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: '1.25rem', color: '#CC9425' }}>&nbsp;Gifts</Typography>
            </Box>
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Fraunces", serif',
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: 1,
            }}
          >
            Sign In to Staff Panel
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3.5 }}>
            Enter your authorized administrator or manager credentials to continue.
          </Typography>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
              {errorMsg}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Textfield
              label="Staff Email Address"
              placeholder="Enter your email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              startIcon={<EmailOutlinedIcon sx={{ color: theme.palette.text.secondary }} />}
            />

            <Textfield
              label="Password"
              placeholder="Enter your password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              startIcon={<LockOutlinedIcon sx={{ color: theme.palette.text.secondary }} />}
              endIcon={
                <IconButton
                  size="small"
                  onClick={() => setShowPassword(!showPassword)}
                  sx={{ color: theme.palette.text.secondary }}
                >
                  {showPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                </IconButton>
              }
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              loading={isLoading}
              sx={{ mt: 1.5, height: 48, fontSize: '1rem' }}
            >
              Sign In to Workspace
            </Button>
          </Box>

          <Box sx={{ mt: 4, pt: 3, borderTop: `1px dashed ${theme.palette.divider}`, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Looking for our customer store?{' '}
              <Link to="/" style={{ color: theme.palette.primary.main, fontWeight: 600, textDecoration: 'none' }}>
                Visit Storefront →
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
