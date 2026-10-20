import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Badge,
  useTheme,
  Container,
  Menu,
  MenuItem,
  Drawer,
  Divider,
  Tooltip,
} from '@mui/material';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import ThemeToggle from '../../common/ThemeToggle';
import CartDrawer from '../cart/component/CartDrawer';
import ChatbotContainer from '../chatbot/ChatbotContainer';
import SearchSuggest from '../../common/SearchSuggest';
import SocialLinks from '../../common/SocialLinks';
import { cartActions } from '../cart/cartSlice';
import { commonApiAction } from '../../store/redux/slices/commonApiSlice';
import { appConstants } from '../../constant/appConstants';

// TWS Gifts logo lockup used in multiple places
function TWSLogoLockup({ markHeight = 40, isDark, sx = {} }) {
  const logoBg = isDark
    ? { backgroundColor: '#FFF8EC', borderRadius: '12px', padding: '8px', display: 'inline-flex' }
    : {};
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, ...sx }}>
      <Box sx={isDark ? logoBg : {}}>
        <Box
          component="img"
          src="/assets/tws-logo-mark.png"
          alt="TWS Gifts"
          sx={{ height: typeof markHeight === 'object' ? markHeight : `${markHeight}px`, width: 'auto', display: 'block' }}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
        <Typography
          sx={{
            fontFamily: '"Fraunces", serif',
            fontWeight: 700,
            fontSize: markHeight >= 40 ? { xs: '1.45rem', md: '1.65rem' } : '1.25rem',
            color: isDark ? '#FFF8EC' : '#0A291E',
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          TWS
        </Typography>
        <Typography
          sx={{
            fontFamily: '"Fraunces", serif',
            fontWeight: 700,
            fontSize: markHeight >= 40 ? { xs: '1.45rem', md: '1.65rem' } : '1.25rem',
            color: '#CC9425',
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          &nbsp;Gifts
        </Typography>
      </Box>
    </Box>
  );
}

export default function PublicLayoutContainer() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isDark = theme.palette.mode === 'dark';

  const cartItems = useSelector((state) => state.cart?.items || []);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const { data: categories = [] } = commonApiAction.useGetCategoriesQuery();

  const isAuthenticated = useSelector((s) => s.toast?.isAuthenticated);
  const user = useSelector((s) => s.toast?.userProfile);

  // Derive staff icon destination & tooltip
  const staffTooltip = isAuthenticated
    ? 'Dashboard'
    : 'Staff Login';
  const staffLink = isAuthenticated
    ? user?.role === 'admin'
      ? '/admin/dashboard'
      : '/admin/products'
    : '/admin/login';

  const [categoryAnchor, setCategoryAnchor] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const totalCartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const totalWishlistCount = wishlistItems.length;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop All', path: '/shop' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <Box sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Banner */}
      <Box
        sx={{
          py: 0.75,
          px: 2,
          backgroundColor: isDark ? '#3D251F' : '#FDF0F3',
          borderBottom: `1px solid ${isDark ? 'rgba(242, 117, 143, 0.2)' : '#F9D5DA'}`,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            fontSize: '0.78rem',
            color: theme.palette.primary.main,
            letterSpacing: '0.03em',
          }}
        >
          🎁 Complimentary Gift-Box Packaging &amp; Free Shipping Across India on orders above ₹999
        </Typography>
      </Box>

      {/* Main Sticky Navbar */}
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1050,
          backgroundColor: isDark ? 'rgba(28, 18, 16, 0.88)' : 'rgba(255, 248, 236, 0.88)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          transition: 'all 0.2s ease',
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
          <Box
            sx={{
              height: 72,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            {/* Mobile Menu Button */}
            <IconButton
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              sx={{ display: { xs: 'flex', md: 'none' }, color: theme.palette.text.primary }}
            >
              <MenuRoundedIcon />
            </IconButton>

            {/* Brand Logo Lockup: TWS mark + "TWS Gifts" in Fraunces */}
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
              }}
            >
              <TWSLogoLockup markHeight={{ xs: 34, md: 40 }} isDark={isDark} />
            </Box>

            {/* Desktop Navigation Links */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 3.5,
              }}
            >
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Typography
                    key={link.path}
                    component={Link}
                    to={link.path}
                    sx={{
                      fontSize: '0.9375rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
                      textDecoration: 'none',
                      transition: 'color 0.15s ease',
                      position: 'relative',
                      '&:hover': {
                        color: theme.palette.primary.main,
                      },
                      ...(isActive && {
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: -6,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 16,
                          height: 2,
                          borderRadius: 2,
                          backgroundColor: theme.palette.primary.main,
                        },
                      }),
                    }}
                  >
                    {link.name}
                  </Typography>
                );
              })}

              {/* Categories Mega Dropdown Trigger */}
              <Box
                onClick={(e) => setCategoryAnchor(e.currentTarget)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  cursor: 'pointer',
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                  '&:hover': { color: theme.palette.primary.main },
                }}
              >
                <span>Categories</span>
                <ExpandMoreRoundedIcon sx={{ fontSize: 18 }} />
              </Box>

              {/* Category Dropdown Menu */}
              <Menu
                anchorEl={categoryAnchor}
                open={Boolean(categoryAnchor)}
                onClose={() => setCategoryAnchor(null)}
                PaperProps={{
                  sx: {
                    borderRadius: '16px',
                    p: 1,
                    minWidth: 200,
                    boxShadow: theme.shadows[3],
                    border: `1px solid ${theme.palette.divider}`,
                  },
                }}
              >
                <MenuItem
                  component={Link}
                  to="/shop"
                  onClick={() => setCategoryAnchor(null)}
                  sx={{ borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600 }}
                >
                  All Categories
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                {categories.map((cat) => (
                  <MenuItem
                    key={cat._id || cat.slug}
                    component={Link}
                    to={`/shop?category=${cat.slug}`}
                    onClick={() => setCategoryAnchor(null)}
                    sx={{ borderRadius: '8px', fontSize: '0.875rem' }}
                  >
                    {cat.name}
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Right Action Icons: Search, Wishlist, Cart, ThemeToggle */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
              {/* Search Toggle - hide on mobile, available in drawer */}
              <IconButton
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search products"
                sx={{
                  display: { xs: 'none', sm: 'inline-flex' },
                  color: theme.palette.text.primary,
                  '&:hover': { color: theme.palette.primary.main },
                }}
              >
                <SearchRoundedIcon />
              </IconButton>

              {/* Wishlist Icon - hide on mobile, available in drawer */}
              <IconButton
                component={Link}
                to="/wishlist"
                aria-label="View wishlist"
                sx={{
                  display: { xs: 'none', sm: 'inline-flex' },
                  color: theme.palette.text.primary,
                  '&:hover': { color: theme.palette.primary.main },
                }}
              >
                <Badge
                  badgeContent={totalWishlistCount}
                  color="primary"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.6875rem',
                      height: 18,
                      minWidth: 18,
                      fontWeight: 700,
                    },
                  }}
                >
                  <FavoriteBorderRoundedIcon />
                </Badge>
              </IconButton>

              {/* Cart Drawer Trigger */}
              <IconButton
                onClick={() => dispatch(cartActions.setCartDrawerOpen(true))}
                aria-label="View cart"
                sx={{
                  color: theme.palette.text.primary,
                  '&:hover': { color: theme.palette.primary.main },
                }}
              >
                <Badge
                  badgeContent={totalCartCount}
                  color="primary"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.6875rem',
                      height: 18,
                      minWidth: 18,
                      fontWeight: 700,
                    },
                  }}
                >
                  <ShoppingBagOutlinedIcon />
                </Badge>
              </IconButton>

              {/* Staff Login / Dashboard - hide on mobile, available in drawer */}
              <Tooltip title={staffTooltip} arrow>
                <IconButton
                  component={Link}
                  to={staffLink}
                  aria-label={staffTooltip}
                  sx={{
                    display: { xs: 'none', sm: 'inline-flex' },
                    color: theme.palette.text.primary,
                    '&:hover': { color: theme.palette.primary.main },
                  }}
                >
                  <PersonOutlineRoundedIcon />
                </IconButton>
              </Tooltip>

              <ThemeToggle />
            </Box>
          </Box>

          {/* Animated Expandable Search Bar */}
          {searchOpen && (
            <Box
              sx={{
                pb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <SearchSuggest
                placeholder="Search gifts, polos, bags, jackets..."
                autoFocus
                onClose={() => setSearchOpen(false)}
                inputSx={{ flex: 1 }}
              />
              <IconButton onClick={() => setSearchOpen(false)}>
                <CloseRoundedIcon />
              </IconButton>
            </Box>
          )}
        </Container>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: 'min(280px, 85vw)', sm: 280 },
            p: 3,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box
            component={Link}
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            sx={{ textDecoration: 'none' }}
          >
            <TWSLogoLockup markHeight={34} isDark={isDark} />
          </Box>
          <IconButton onClick={() => setMobileMenuOpen(false)}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {/* Drawer Search Input */}
          <Box sx={{ mb: 1 }}>
            <SearchSuggest
              placeholder="Search gifts, polos, bags..."
              onClose={() => setMobileMenuOpen(false)}
              inputSx={{ width: '100%' }}
            />
          </Box>
          {navLinks.map((link) => (
            <Typography
              key={link.path}
              component={Link}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              sx={{
                py: 1,
                fontSize: '1rem',
                fontWeight: 600,
                color: theme.palette.text.primary,
                textDecoration: 'none',
              }}
            >
              {link.name}
            </Typography>
          ))}

          {/* Mobile Wishlist Link */}
          <Typography
            component={Link}
            to="/wishlist"
            onClick={() => setMobileMenuOpen(false)}
            sx={{
              py: 1,
              fontSize: '1rem',
              fontWeight: 600,
              color: theme.palette.text.primary,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
            }}
          >
            <FavoriteBorderRoundedIcon sx={{ fontSize: 20, color: theme.palette.primary.main }} />
            <span>Wishlist ({totalWishlistCount})</span>
          </Typography>

          <Divider sx={{ my: 1 }} />
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 700 }}>
            CATEGORIES
          </Typography>
          {categories.map((cat) => (
            <Typography
              key={cat._id || cat.slug}
              component={Link}
              to={`/shop?category=${cat.slug}`}
              onClick={() => setMobileMenuOpen(false)}
              sx={{
                py: 0.5,
                fontSize: '0.9rem',
                color: theme.palette.text.secondary,
                textDecoration: 'none',
              }}
            >
              {cat.name}
            </Typography>
          ))}

          <Divider sx={{ my: 1.5 }} />
          <Typography
            component={Link}
            to={staffLink}
            onClick={() => setMobileMenuOpen(false)}
            sx={{
              py: 1,
              fontSize: '0.9rem',
              fontWeight: 600,
              color: theme.palette.primary.main,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <PersonOutlineRoundedIcon sx={{ fontSize: 18 }} />
            {staffTooltip}
          </Typography>
        </Box>
      </Drawer>

      {/* Main Page Content */}
      <Box component="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Chatbot Assistant */}
      <ChatbotContainer />

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          backgroundColor: isDark ? '#160E0C' : '#FAF1E3',
          borderTop: `1px solid ${theme.palette.divider}`,
          pt: { xs: 6, md: 8 },
          pb: 4,
          mt: 'auto',
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 } }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '2fr 1fr 1fr 1.5fr' },
              gap: { xs: 4, md: 6 },
              mb: 6,
            }}
          >
            {/* Col 1: Brand Info */}
            <Box>
              <Box sx={{ mb: 1 }}>
                <Box sx={isDark ? { backgroundColor: '#FFF8EC', borderRadius: '12px', padding: '8px', display: 'inline-flex' } : {}}>
                  <img
                    src="/assets/tws-logo-no-tagline.png"
                    alt="TWS Gifts"
                    style={{ maxWidth: 220, width: '100%', height: 'auto', display: 'block' }}
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

              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  lineHeight: 1.7,
                  maxWidth: 320,
                  mb: 2.5,
                }}
              >
                {appConstants.tagline} {appConstants.subTagline} 1 gift purchased = 1 stationery kit donated.
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: theme.palette.text.secondary,
                  mb: 1,
                }}
              >
                Follow Us
              </Typography>
              <SocialLinks sx={{ mb: 2.5 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                  Made with love in India 🇮🇳
                </Typography>
              </Box>
            </Box>

            {/* Col 2: Quick Links */}
            <Box>
              <Typography
                sx={{
                  fontFamily: '"Fraunces", serif',
                  fontWeight: 600,
                  fontSize: '1.0625rem',
                  mb: 2,
                  color: theme.palette.text.primary,
                }}
              >
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                <Link to="/" style={{ color: theme.palette.text.secondary, textDecoration: 'none', fontSize: '0.875rem' }}>
                  Home
                </Link>
                <Link to="/shop" style={{ color: theme.palette.text.secondary, textDecoration: 'none', fontSize: '0.875rem' }}>
                  Shop All Gifts
                </Link>
                <Link to="/about" style={{ color: theme.palette.text.secondary, textDecoration: 'none', fontSize: '0.875rem' }}>
                  Our Story
                </Link>
                <Link to="/wishlist" style={{ color: theme.palette.text.secondary, textDecoration: 'none', fontSize: '0.875rem' }}>
                  My Wishlist
                </Link>
                <Link to="/cart" style={{ color: theme.palette.text.secondary, textDecoration: 'none', fontSize: '0.875rem' }}>
                  Gift Bag
                </Link>
              </Box>
            </Box>

            {/* Col 3: Categories */}
            <Box>
              <Typography
                sx={{
                  fontFamily: '"Fraunces", serif',
                  fontWeight: 600,
                  fontSize: '1.0625rem',
                  mb: 2,
                  color: theme.palette.text.primary,
                }}
              >
                Popular Categories
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                {categories.slice(0, 5).map((cat) => (
                  <Link
                    key={cat._id || cat.slug}
                    to={`/shop?category=${cat.slug}`}
                    style={{ color: theme.palette.text.secondary, textDecoration: 'none', fontSize: '0.875rem' }}
                  >
                    {cat.name}
                  </Link>
                ))}
                <Link to="/shop" style={{ color: theme.palette.primary.main, textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
                  View All →
                </Link>
              </Box>
            </Box>

            {/* Col 4: Contact & WhatsApp */}
            <Box>
              <Typography
                sx={{
                  fontFamily: '"Fraunces", serif',
                  fontWeight: 600,
                  fontSize: '1.0625rem',
                  mb: 2,
                  color: theme.palette.text.primary,
                }}
              >
                Need Help Gifting?
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2, lineHeight: 1.6 }}>
                Chat with our team for custom designs, corporate &amp; bulk orders, or delivery queries.
              </Typography>

              <Box
                component="a"
                href={`https://wa.me/${appConstants.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1.25,
                  p: 1.5,
                  borderRadius: '12px',
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  transition: 'background-color 0.2s',
                  '&:hover': { backgroundColor: '#1EBE5D' },
                  mb: 2,
                }}
              >
                <WhatsAppIcon sx={{ fontSize: 20 }} />
                <span>Chat on WhatsApp</span>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mt: 1 }}>
                <Typography variant="caption" sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
                  Phone: {appConstants.phoneDisplay}
                </Typography>
                <Typography
                  component="a"
                  href={`mailto:${appConstants.contactEmail}`}
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Email: {appConstants.contactEmail}
                </Typography>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, lineHeight: 1.5, maxWidth: 280 }}>
                  {appConstants.fullAddress}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ borderColor: theme.palette.divider, mb: 3 }} />

          {/* Bottom Bar */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              flexWrap: 'wrap',
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              © {new Date().getFullYear()} TWS Gifts. All rights reserved. Personalized &amp; Corporate Gifting.
            </Typography>

            <Link
              to="/admin/login"
              style={{
                color: theme.palette.text.secondary,
                fontSize: '0.75rem',
                textDecoration: 'none',
                opacity: 0.7,
              }}
            >
              Staff &amp; Admin Login
            </Link>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
