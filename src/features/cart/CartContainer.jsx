import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Divider,
  useTheme,
  TextField,
  Paper,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SectionHeading from '../../common/SectionHeading';
import Button from '../../common/Button';
import EmptyState from '../../common/EmptyState';
import { cartActions } from './cartSlice';
import { formatCurrency, generateCartWhatsAppUrl } from '../../utils/helper';
import { optimizeImage } from '../../utils/imageUrl';
import { appConstants } from '../../constant/appConstants';

export default function CartContainer() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isDark = theme.palette.mode === 'dark';

  const items = useSelector((state) => state.cart?.items || []);
  const [customerNote, setCustomerNote] = useState('');

  const subtotal = items.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );

  const handleCheckoutWhatsApp = () => {
    if (!items.length) return;
    const url = generateCartWhatsAppUrl(items, customerNote);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Box sx={{ py: { xs: 4, md: 8 } }}>
      <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 } }}>
        <SectionHeading
          eyebrow="Review Your Selection"
          title="Your Gifting Bag"
          description="Review your selected gifts before confirming order and details on WhatsApp."
        />

        {items.length === 0 ? (
          <EmptyState
            title="Your bag is waiting for memories"
            description="Explore our personalized gifts, apparel, bags and accessories to begin."
            actionText="Start Shopping"
            onAction={() => (window.location.href = '/shop')}
          />
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '2fr 1.1fr' },
              gap: { xs: 4, md: 6 },
              alignItems: 'flex-start',
            }}
          >
            {/* Items List Column */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {items.map((item) => (
                <Paper
                  key={item._id}
                  elevation={0}
                  sx={{
                    p: { xs: 2, md: 3 },
                    borderRadius: '20px',
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.background.paper,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2.5,
                    alignItems: { xs: 'flex-start', sm: 'center' },
                  }}
                >
                  {/* Thumbnail */}
                  <Box
                    component={Link}
                    to={`/product/${item.slug}`}
                    sx={{
                      width: { xs: '100%', sm: 100 },
                      height: 100,
                      borderRadius: '14px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      backgroundColor: isDark ? '#231613' : '#FDF7EE',
                      display: 'block',
                    }}
                  >
                    <img
                      src={optimizeImage(item.image, 200)}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>

                  {/* Info */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      component={Link}
                      to={`/product/${item.slug}`}
                      sx={{
                        fontFamily: '"Fraunces", serif',
                        fontWeight: 600,
                        fontSize: '1.0625rem',
                        color: theme.palette.text.primary,
                        textDecoration: 'none',
                        lineHeight: 1.3,
                        mb: 0.5,
                        display: 'block',
                        '&:hover': { color: theme.palette.primary.main },
                      }}
                    >
                      {item.title}
                    </Typography>

                    <Typography
                      sx={{
                        fontFamily: '"Fraunces", serif',
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                        fontSize: '1rem',
                        mb: item.personalizationNote ? 1 : 0,
                      }}
                    >
                      {formatCurrency(item.price)}
                      <Box
                        component="span"
                        sx={{
                          fontSize: '0.7rem',
                          fontWeight: 500,
                          color: theme.palette.text.secondary,
                          ml: 0.75,
                        }}
                      >
                        each • min. {appConstants.minOrderQty} pcs
                      </Box>
                    </Typography>

                    {item.personalizationNote && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.text.secondary,
                          display: 'block',
                          fontStyle: 'italic',
                        }}
                      >
                        Note: &ldquo;{item.personalizationNote}&rdquo;
                      </Typography>
                    )}
                  </Box>

                  {/* Quantity Stepper & Subtotal */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      width: { xs: '100%', sm: 'auto' },
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: '10px',
                        border: `1.5px solid ${theme.palette.divider}`,
                        backgroundColor: theme.palette.background.paper,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() =>
                          dispatch(cartActions.updateQuantity({ id: item._id, quantity: item.quantity - 1 }))
                        }
                        disabled={item.quantity <= appConstants.minOrderQty}
                        sx={{ p: 0.75 }}
                      >
                        <RemoveRoundedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                      <Typography sx={{ px: 1.5, fontWeight: 700, fontSize: '0.875rem' }}>
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() =>
                          dispatch(cartActions.updateQuantity({ id: item._id, quantity: item.quantity + 1 }))
                        }
                        sx={{ p: 0.75 }}
                      >
                        <AddRoundedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>

                    <Typography
                      sx={{
                        fontFamily: '"Fraunces", serif',
                        fontWeight: 700,
                        fontSize: '1.125rem',
                        color: theme.palette.text.primary,
                        minWidth: 80,
                        textAlign: 'right',
                      }}
                    >
                      {formatCurrency(item.price * item.quantity)}
                    </Typography>

                    <IconButton
                      onClick={() => dispatch(cartActions.removeFromCart(item._id))}
                      sx={{
                        color: theme.palette.text.secondary,
                        '&:hover': { color: '#D32F2F' },
                      }}
                    >
                      <DeleteOutlineRoundedIcon />
                    </IconButton>
                  </Box>
                </Paper>
              ))}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
                <Button component={Link} to="/shop" variant="outline" size="small">
                  ← Continue Shopping
                </Button>
                <Button
                  variant="white"
                  size="small"
                  onClick={() => dispatch(cartActions.clearCart())}
                  sx={{ color: '#D32F2F', borderColor: 'rgba(211,47,47,0.3)' }}
                >
                  Empty Bag
                </Button>
              </Box>
            </Box>

            {/* Order Summary & WhatsApp Checkout Column */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: '24px',
                border: `1.5px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[2],
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600, mb: 3 }}
              >
                Order Summary
              </Typography>

              {/* Cost rows */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Items
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {items.reduce((acc, i) => acc + (i.quantity || 1), 0)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Subtotal
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatCurrency(subtotal)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Complimentary Gift Wrapping
                  </Typography>
                  <Typography variant="body2" color="primary" fontWeight={600}>
                    FREE
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Doorstep Delivery
                  </Typography>
                  <Typography variant="body2" color="primary" fontWeight={600}>
                    FREE (Above ₹999)
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 3, borderColor: theme.palette.divider }} />

              {/* Total Row */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={700}>
                  Estimated Total
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Fraunces", serif',
                    fontWeight: 700,
                    fontSize: '1.75rem',
                    color: theme.palette.primary.main,
                  }}
                >
                  {formatCurrency(subtotal)}
                </Typography>
              </Box>

              {/* Custom Instructions */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: 'block', color: theme.palette.text.secondary }}>
                  Special Instructions or Delivery Notes
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="e.g. Please engrave names in cursive, deliver before anniversary..."
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                    },
                  }}
                />
              </Box>

              {/* WhatsApp CTA Button */}
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleCheckoutWhatsApp}
                icon={<WhatsAppIcon sx={{ fontSize: 22 }} />}
                sx={{
                  backgroundColor: '#25D366',
                  height: 52,
                  fontSize: '1rem',
                  fontWeight: 700,
                  '&:hover': {
                    backgroundColor: '#1EBE5D',
                  },
                }}
              >
                Order on WhatsApp
              </Button>

              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  textAlign: 'center',
                  mt: 2,
                  color: theme.palette.text.secondary,
                  lineHeight: 1.5,
                }}
              >
                Opens a pre-filled WhatsApp chat with your complete gift list, quantities, and personalization notes. No online payment needed now!
              </Typography>
            </Paper>
          </Box>
        )}
      </Container>
    </Box>
  );
}
