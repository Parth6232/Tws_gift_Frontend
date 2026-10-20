import React from 'react';
import { Box, Typography, IconButton, useTheme, Tooltip } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PriceTag from './PriceTag';
import Badge from './Badge';
import { optimizeImage, getSrcSet } from '../utils/imageUrl';
import { wishlistActions } from '../features/wishlist/wishlistSlice';
import { cartActions } from '../features/cart/cartSlice';
import { generateProductWhatsAppUrl } from '../utils/helper';
import { appConstants } from '../constant/appConstants';

export default function ProductCard({ product, sx = {} }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === 'dark';

  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const isWishlisted = wishlistItems.some((item) => item._id === product?._id);

  if (!product) return null;

  const {
    _id,
    title,
    slug,
    price,
    comparePrice,
    images = [],
    category,
    soldOut = false,
    freeShipping = false,
    isNewArrival = false,
    isBestSeller = false,
    isPremium = false,
  } = product;

  const imageUrl = images?.[0]?.url || '/assets/logo.png';

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(wishlistActions.toggleWishlist(product));
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut) return;
    dispatch(cartActions.addToCart({ ...product, quantity: appConstants.minOrderQty }));
  };

  const handleWhatsAppInquiry = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = generateProductWhatsAppUrl(product, 'I would like to inquire about this product availability.');
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Box
      component={motion.div}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      sx={{
        borderRadius: '20px',
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: isDark
          ? '0 6px 20px rgba(0, 0, 0, 0.35)'
          : '0 8px 30px rgba(74, 33, 24, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          borderColor: isDark ? 'rgba(242, 117, 143, 0.4)' : 'rgba(217, 69, 107, 0.3)',
          boxShadow: isDark
            ? '0 12px 32px rgba(0, 0, 0, 0.5)'
            : '0 14px 36px rgba(74, 33, 24, 0.09)',
        },
        ...sx,
      }}
    >
      {/* Product Image Container */}
      <Box
        component={Link}
        to={`/product/${slug}`}
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          overflow: 'hidden',
          backgroundColor: '#FFFFFF',
          display: 'block',
          textDecoration: 'none',
        }}
      >
        <Box
          component="img"
          src={optimizeImage(imageUrl, 400)}
          srcSet={getSrcSet(imageUrl)}
          sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
          alt={title}
          loading="lazy"
          decoding="async"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            transition: 'transform 0.4s cubic-bezier(0.2, 0, 0.2, 1)',
            filter: soldOut ? 'grayscale(40%)' : 'none',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
          onError={(e) => {
            if (!e.target.dataset.fallback) {
              e.target.dataset.fallback = '1';
              const plain = (imageUrl || '').split('?')[0];
              if (e.target.src !== plain) { e.target.src = plain; return; }
            }
            e.target.src = '/assets/tws-logo-mark.png';
          }}
        />

        {/* Hanging Gift-Tag Style Badge (Top-Left) */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.75,
            zIndex: 2,
          }}
        >
          {soldOut ? (
            <Badge label="Sold Out" variant="soldOut" size="small" />
          ) : (
            <>
              {isBestSeller && <Badge label="Best Seller" variant="bestSeller" size="small" />}
              {isNewArrival && <Badge label="New" variant="new" size="small" />}
              {isPremium && <Badge label="Premium" variant="premium" size="small" />}
              {freeShipping && !isBestSeller && !isNewArrival && (
                <Badge label="Free Shipping" variant="freeShipping" size="small" />
              )}
            </>
          )}
        </Box>

        {/* Wishlist Button (Top-Right) with Heart Micro-interaction */}
        <Tooltip title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}>
          <IconButton
            onClick={handleToggleWishlist}
            aria-label="Wishlist toggle"
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: isDark ? 'rgba(28, 18, 16, 0.75)' : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(4px)',
              border: `1px solid ${theme.palette.divider}`,
              color: isWishlisted ? theme.palette.primary.main : theme.palette.text.secondary,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              zIndex: 2,
              '&:hover': {
                transform: 'scale(1.15)',
                backgroundColor: isDark ? '#2A1B17' : '#FFFFFF',
                color: theme.palette.primary.main,
              },
            }}
          >
            <motion.div
              animate={{ scale: isWishlisted ? [1, 1.25, 1] : 1 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {isWishlisted ? (
                <FavoriteRoundedIcon sx={{ fontSize: 20, color: theme.palette.primary.main }} />
              ) : (
                <FavoriteBorderRoundedIcon sx={{ fontSize: 20 }} />
              )}
            </motion.div>
          </IconButton>
        </Tooltip>
      </Box>

      {/* Product Content Details */}
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Category */}
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: theme.palette.primary.main,
            mb: 0.5,
            fontSize: '0.6875rem',
          }}
        >
          {category?.name || 'Personalized Gift'}
        </Typography>

        {/* Title */}
        <Typography
          component={Link}
          to={`/product/${slug}`}
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 600,
            fontSize: '0.9375rem',
            color: theme.palette.text.primary,
            lineHeight: 1.35,
            textDecoration: 'none',
            mb: 1.25,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            transition: 'color 0.15s ease',
            '&:hover': {
              color: theme.palette.primary.main,
            },
          }}
        >
          {title}
        </Typography>

        {/* Price Tag & Quick Action */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
            mt: 'auto',
            pt: 1,
            borderTop: `1px dashed ${theme.palette.divider}`,
          }}
        >
          <PriceTag price={price} comparePrice={comparePrice} size="medium" />

          {soldOut ? (
            <Tooltip title="Inquire on WhatsApp">
              <IconButton
                onClick={handleWhatsAppInquiry}
                size="small"
                aria-label="Notify via WhatsApp"
                sx={{
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  '&:hover': {
                    backgroundColor: '#1EBE5D',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <WhatsAppIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Add to Bag">
              <IconButton
                onClick={handleAddToCart}
                size="small"
                aria-label="Add to cart"
                sx={{
                  backgroundColor: isDark ? 'rgba(242, 117, 143, 0.15)' : '#FDF0F3',
                  color: theme.palette.primary.main,
                  border: `1px solid ${isDark ? 'rgba(242, 117, 143, 0.3)' : '#F9D5DA'}`,
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                    color: '#FFFFFF',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <ShoppingBagOutlinedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
    </Box>
  );
}
