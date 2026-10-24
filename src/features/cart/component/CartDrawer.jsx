import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  useTheme,
  TextField,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { cartActions } from '../cartSlice';
import { formatCurrency, generateCartWhatsAppUrl } from '../../../utils/helper';
import { optimizeImage } from '../../../utils/imageUrl';
import { appConstants } from '../../../constant/appConstants';
import Button from '../../../common/Button';
import EmptyState from '../../../common/EmptyState';

export default function CartDrawer() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isDark = theme.palette.mode === 'dark';

  const isOpen = useSelector((state) => state.cart?.isDrawerOpen);
  const items = useSelector((state) => state.cart?.items || []);
  const [customerNote, setCustomerNote] = useState('');

  const subtotal = items.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );

  const handleClose = () => {
    dispatch(cartActions.setCartDrawerOpen(false));
  };

  const handleWhatsAppCheckout = () => {
    if (!items.length) return;
    const url = generateCartWhatsAppUrl(items, customerNote);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: { xs: '100vw', sm: 420 },
          maxWidth: '100%',
          backgroundColor: theme.palette.background.paper,
          display: 'flex',
          flexDirection: 'column',
          borderLeft: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[4],
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ShoppingBagOutlinedIcon sx={{ color: theme.palette.primary.main }} />
          <Typography variant="h6" sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600 }}>
            Your Gift Bag ({items.length})
          </Typography>
        </Box>
        <IconButton onClick={handleClose} aria-label="Close cart drawer">
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      {/* Cart Items List */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2.5 }}>
        {items.length === 0 ? (
          <EmptyState
            title="Your bag is empty"
            description="Explore our personalized gifts collection and add your favorite items to your bag."
            actionText="Browse Gifts"
            onAction={() => {
              handleClose();
            }}
          />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {items.map((item) => (
              <Box
                key={item._id}
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: '14px',
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(74,33,24,0.02)',
                }}
              >
                {/* Thumbnail */}
                <Box
                  component={Link}
                  to={`/product/${item.slug}`}
                  onClick={handleClose}
                  sx={{
                    width: 76,
                    height: 76,
                    borderRadius: '10px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    backgroundColor: isDark ? '#231613' : '#FDF7EE',
                    display: 'block',
                  }}
                >
                  <img
                    src={optimizeImage(item.image, 160)}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>

                {/* Details */}
                <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    component={Link}
                    to={`/product/${item.slug}`}
                    onClick={handleClose}
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: theme.palette.text.primary,
                      textDecoration: 'none',
                      whiteSpace: 'normal',
                      overflow: 'hidden',
                      mb: 0.5,
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: '"Fraunces", serif',
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                      fontSize: '0.9375rem',
                      mb: 1,
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

                  {/* Quantity Stepper & Remove */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: '8px',
                        border: `1px solid ${theme.palette.divider}`,
                        backgroundColor: theme.palette.background.paper,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() =>
                          dispatch(cartActions.updateQuantity({ id: item._id, quantity: item.quantity - 1 }))
                        }
                        disabled={item.quantity <= appConstants.minOrderQty}
                        sx={{ p: 0.5, color: theme.palette.text.secondary }}
                      >
                        <RemoveRoundedIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                      <Typography sx={{ px: 1.25, fontSize: '0.8125rem', fontWeight: 600 }}>
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() =>
                          dispatch(cartActions.updateQuantity({ id: item._id, quantity: item.quantity + 1 }))
                        }
                        sx={{ p: 0.5, color: theme.palette.text.secondary }}
                      >
                        <AddRoundedIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography
                          sx={{
                            fontFamily: '"Fraunces", serif',
                            fontWeight: 700,
                            fontSize: '0.9375rem',
                            color: theme.palette.text.primary,
                            lineHeight: 1.1,
                          }}
                        >
                          {formatCurrency(item.price * item.quantity)}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: theme.palette.text.secondary, fontSize: '0.6875rem' }}
                        >
                          {item.quantity} × {formatCurrency(item.price)}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => dispatch(cartActions.removeFromCart(item._id))}
                        sx={{ color: theme.palette.text.secondary, '&:hover': { color: '#D32F2F' } }}
                        aria-label="Remove item"
                      >
                        <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Footer with WhatsApp Checkout */}
      {items.length > 0 && (
        <Box
          sx={{
            p: 2.5,
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          {/* Optional Note */}
          <TextField
            fullWidth
            size="small"
            placeholder="Add special customization notes or dates..."
            value={customerNote}
            onChange={(e) => setCustomerNote(e.target.value)}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                fontSize: '0.8125rem',
              },
            }}
          />

          {/* Subtotal */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Subtotal (Packaging & Taxes incl.)
            </Typography>
            <Typography
              sx={{
                fontFamily: '"Fraunces", serif',
                fontWeight: 700,
                fontSize: '1.25rem',
                color: theme.palette.text.primary,
              }}
            >
              {formatCurrency(subtotal)}
            </Typography>
          </Box>

          {/* WhatsApp Order Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleWhatsAppCheckout}
            icon={<WhatsAppIcon sx={{ fontSize: 20 }} />}
            sx={{
              backgroundColor: '#25D366',
              height: 48,
              fontSize: '0.9375rem',
              fontWeight: 700,
              '&:hover': {
                backgroundColor: '#1EBE5D',
              },
            }}
          >
            Order on WhatsApp
          </Button>

          <Box sx={{ mt: 1.5, textAlign: 'center' }}>
            <Typography
              component={Link}
              to="/cart"
              onClick={handleClose}
              sx={{
                fontSize: '0.8125rem',
                color: theme.palette.text.secondary,
                textDecoration: 'underline',
                '&:hover': { color: theme.palette.primary.main },
              }}
            >
              View Full Cart Page
            </Typography>
          </Box>
        </Box>
      )}
    </Drawer>
  );
}
