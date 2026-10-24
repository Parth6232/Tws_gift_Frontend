import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Divider,
  useTheme,
  Chip,
  Tooltip,
} from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';
import PriceTag from '../../common/PriceTag';
import Badge from '../../common/Badge';
import Button from '../../common/Button';
import Textfield from '../../common/Textfield';
import ProductShelf from '../home/component/ProductShelf';
import { DetailSkeleton } from '../../common/Skeleton';
import { productApiAction } from './productApiSlice';
import { cartActions } from '../cart/cartSlice';
import { wishlistActions } from '../wishlist/wishlistSlice';
import { toastActions } from '../../store/redux/slices/toastSlice';
import { optimizeImage, getSrcSet } from '../../utils/imageUrl';
import { formatCurrency, generateProductWhatsAppUrl } from '../../utils/helper';
import { appConstants } from '../../constant/appConstants';

const MIN_QTY = appConstants.minOrderQty;

export default function ProductDetailContainer() {
  const { slug } = useParams();
  const theme = useTheme();
  const dispatch = useDispatch();
  const isDark = theme.palette.mode === 'dark';

  const { data: product, isLoading, error } = productApiAction.useGetProductBySlugQuery(slug);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(MIN_QTY);
  const [qtyInput, setQtyInput] = useState(String(MIN_QTY));
  const [personalizationNote, setPersonalizationNote] = useState('');

  useEffect(() => {
    setQtyInput(String(quantity));
  }, [quantity]);

  const handleQtyInputChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setQtyInput(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed >= MIN_QTY) {
      setQuantity(parsed);
    }
  };

  const handleQtyInputBlur = () => {
    const parsed = parseInt(qtyInput, 10);
    if (isNaN(parsed) || parsed < MIN_QTY) {
      setQuantity(MIN_QTY);
      setQtyInput(String(MIN_QTY));
    } else {
      setQuantity(parsed);
      setQtyInput(String(parsed));
    }
  };

  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const isWishlisted = wishlistItems.some((item) => item._id === product?._id);

  // Related products from same category
  const { data: relatedData } = productApiAction.useGetProductsQuery(
    product?.category?.slug ? { category: product.category.slug, limit: 4 } : { limit: 4 },
    { skip: !product }
  );

  const relatedProducts = (relatedData?.items || []).filter((p) => p._id !== product?._id);

  // SEO: Update document title and meta description
  useEffect(() => {
    if (product) {
      document.title = `${product.title} — TWS Gifts | Personalized & Corporate Gifting`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          product.description?.slice(0, 160) ||
          `Personalize ${product.title} with custom photos, engraving, and gift-ready box packaging at TWS Gifts.`
        );
      }
    }
  }, [product]);

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 6, px: { xs: 3, md: 6 } }}>
        <DetailSkeleton />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontFamily: '"Fraunces", serif', mb: 2 }}>
          Product Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          This product might be sold out or unavailable.
        </Typography>
        <Button component={Link} to="/shop" variant="contained">
          Browse All Gifts
        </Button>
      </Container>
    );
  }

  const {
    _id,
    title,
    description,
    price,
    comparePrice,
    images = [],
    category,
    tags = [],
    soldOut = false,
    freeShipping = false,
    isNewArrival = false,
    isBestSeller = false,
    isPremium = false,
  } = product;

  const currentImage = images[activeImageIndex]?.url || images[0]?.url || '/assets/tws-logo-mark.png';

  const handleAddToCart = () => {
    if (soldOut) return;
    dispatch(
      cartActions.addToCart({
        ...product,
        quantity,
        personalizationNote,
      })
    );
  };

  const handleOrderOnWhatsApp = () => {
    const url = generateProductWhatsAppUrl(product, personalizationNote, quantity);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} | TWS Gifts`,
          text: `Check out this personalized gift on TWS Gifts!`,
          url: window.location.href,
        });
      } catch {
        // user cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      dispatch(
        toastActions.setToastData({
          message: 'Product link copied to clipboard!',
          variant: 'success',
        })
      );
    }
  };

  return (
    <Box sx={{ py: { xs: 3, md: 6 }, pb: { xs: '96px', md: 6 }, overflowX: 'clip' }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 6 } }}>
        {/* Breadcrumb */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4, flexWrap: 'wrap' }}>
          <Typography
            component={Link}
            to="/"
            variant="caption"
            sx={{ color: theme.palette.text.secondary, textDecoration: 'none', '&:hover': { color: theme.palette.primary.main } }}
          >
            Home
          </Typography>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
            /
          </Typography>
          <Typography
            component={Link}
            to="/shop"
            variant="caption"
            sx={{ color: theme.palette.text.secondary, textDecoration: 'none', '&:hover': { color: theme.palette.primary.main } }}
          >
            Shop
          </Typography>
          {category && (
            <>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                /
              </Typography>
              <Typography
                component={Link}
                to={`/shop?category=${category.slug}`}
                variant="caption"
                sx={{ color: theme.palette.text.secondary, textDecoration: 'none', '&:hover': { color: theme.palette.primary.main } }}
              >
                {category.name}
              </Typography>
            </>
          )}
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
            /
          </Typography>
          <Typography variant="caption" sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>

        {/* Product Main Section */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' },
            gap: { xs: 4, md: 7 },
            mb: 8,
          }}
        >
          {/* Left Column: Image Gallery */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            {/* Primary Main Image with Hover Zoom */}
            <Box
              sx={{
                width: '100%',
                aspectRatio: '1 / 1',
                maxHeight: { xs: 'min(calc(100vw - 32px), 480px)', md: 'none' },
                borderRadius: '24px',
                overflow: 'hidden',
                backgroundColor: '#FFFFFF',
                border: `1px solid ${theme.palette.divider}`,
                position: 'relative',
                boxShadow: theme.shadows[2],
                mx: 'auto',
              }}
            >
              <Box
                component="img"
                src={optimizeImage(currentImage, 800)}
                srcSet={getSrcSet(currentImage)}
                sizes="(max-width: 900px) 100vw, 50vw"
                alt={title}
                onError={(e) => {
                  if (!e.target.dataset.fallback) {
                    e.target.dataset.fallback = '1';
                    const plain = currentImage.split('?')[0];
                    if (e.target.src !== plain) { e.target.src = plain; return; }
                  }
                  e.target.src = '/assets/tws-logo-mark.png';
                }}
                sx={{
                  width: '100%',
                  height: '100%',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  transition: 'transform 0.4s ease',
                  '&:hover': {
                    transform: 'scale(1.08)',
                  },
                }}
              />

              {/* Badges on main image */}
              <Box sx={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 1 }}>
                {soldOut ? (
                  <Badge label="Sold Out" variant="soldOut" />
                ) : (
                  <>
                    {isBestSeller && <Badge label="Best Seller" variant="bestSeller" />}
                    {isNewArrival && <Badge label="New" variant="new" />}
                    {isPremium && <Badge label="Premium" variant="premium" />}
                  </>
                )}
              </Box>

              {/* Wishlist floating toggle */}
              <Tooltip title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}>
                <IconButton
                  onClick={() => dispatch(wishlistActions.toggleWishlist(product))}
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    backgroundColor: isDark ? 'rgba(28, 18, 16, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(4px)',
                    border: `1px solid ${theme.palette.divider}`,
                    color: isWishlisted ? theme.palette.primary.main : theme.palette.text.secondary,
                    '&:hover': {
                      backgroundColor: isDark ? '#2A1B17' : '#FFFFFF',
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  {isWishlisted ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
                </IconButton>
              </Tooltip>
            </Box>

            {/* Thumbnails Strip */}
            {images.length > 1 && (
              <Box
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  overflowX: 'auto',
                  py: 1,
                  scrollSnapType: 'x mandatory',
                  scrollbarWidth: 'none',
                  '&::-webkit-scrollbar': { display: 'none' },
                  minWidth: 0,
                  maxWidth: '100%',
                }}
              >
                {images.map((img, idx) => {
                  const isSelected = idx === activeImageIndex;
                  return (
                    <Box
                      key={img.publicId || idx}
                      onClick={() => setActiveImageIndex(idx)}
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: '14px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: isSelected
                          ? `2px solid ${theme.palette.primary.main}`
                          : `1px solid ${theme.palette.divider}`,
                        opacity: isSelected ? 1 : 0.7,
                        transition: 'all 0.2s ease',
                        flexShrink: 0,
                        scrollSnapAlign: 'start',
                        backgroundColor: isDark ? '#231613' : '#FDF7EE',
                        '&:hover': { opacity: 1 },
                      }}
                    >
                      <img
                        src={optimizeImage(img.url, 160)}
                        alt={`Thumbnail ${idx + 1}`}
                        onError={(e) => {
                          if (!e.target.dataset.fallback) {
                            e.target.dataset.fallback = '1';
                            const plain = (img.url || '').split('?')[0];
                            if (e.target.src !== plain) { e.target.src = plain; return; }
                          }
                          e.target.src = '/assets/tws-logo-mark.png';
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>

          {/* Right Column: Details & Actions */}
          <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            {/* Category */}
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: theme.palette.primary.main,
                mb: 1,
              }}
            >
              {category?.name || 'Personalized Gift'}
            </Typography>

            {/* Title */}
            <Typography
              variant="h1"
              sx={{
                fontFamily: '"Fraunces", serif',
                fontWeight: 600,
                fontSize: { xs: '1.75rem', sm: '2.35rem', md: '2.75rem' },
                lineHeight: 1.2,
                color: theme.palette.text.primary,
                letterSpacing: '-0.02em',
                mb: 2,
                overflowWrap: 'anywhere',
                wordBreak: 'break-word',
              }}
            >
              {title}
            </Typography>

            {/* Price & Discount */}
            <Box sx={{ mb: 3 }}>
              <PriceTag price={price} comparePrice={comparePrice} size="large" />
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mt: 0.5, display: 'block' }}>
                Per piece • Inclusive of all taxes & complimentary gift-ready ribbon packaging
              </Typography>
            </Box>

            <Divider sx={{ mb: 3, borderColor: theme.palette.divider }} />

            {/* Description */}
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                lineHeight: 1.7,
                mb: 3,
                fontSize: '0.96rem',
                overflowWrap: 'anywhere',
                wordBreak: 'break-word',
              }}
            >
              {description}
            </Typography>

            {/* Personalization Instructions Input */}
            <Box sx={{ mb: 3 }}>
              <Textfield
                label="Personalization Details (Optional)"
                placeholder="Enter names, anniversary date (e.g. 12.10.2024), Spotify song, or special note..."
                multiline
                rows={2}
                value={personalizationNote}
                onChange={(e) => setPersonalizationNote(e.target.value)}
                helperText="You can also share high-resolution photos and details on WhatsApp after placing the order."
              />
            </Box>

            {/* Quantity Stepper & Actions */}
            {!soldOut && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                    Quantity
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                    }}
                  >
                    Minimum order: {MIN_QTY} pieces
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    borderRadius: '12px',
                    border: `1.5px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.background.paper,
                    height: 48,
                  }}
                >
                  <IconButton
                    onClick={() => setQuantity((q) => Math.max(MIN_QTY, q - 1))}
                    disabled={quantity <= MIN_QTY}
                    sx={{ p: 1, color: theme.palette.text.secondary }}
                    aria-label="Decrease quantity"
                  >
                    <RemoveRoundedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                  <Box
                    component="input"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={qtyInput}
                    onChange={handleQtyInputChange}
                    onBlur={handleQtyInputBlur}
                    aria-label="Quantity"
                    sx={{
                      width: 56,
                      textAlign: 'center',
                      border: 'none',
                      outline: 'none',
                      backgroundColor: 'transparent',
                      fontWeight: 700,
                      fontSize: '0.9375rem',
                      color: theme.palette.text.primary,
                      p: 0,
                    }}
                  />
                  <IconButton
                    onClick={() => setQuantity((q) => q + 1)}
                    sx={{ p: 1, color: theme.palette.text.secondary }}
                    aria-label="Increase quantity"
                  >
                    <AddRoundedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>

                {/* Live total line */}
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" sx={{ display: 'block', color: theme.palette.text.secondary, fontWeight: 500 }}>
                    {quantity} pcs × {formatCurrency(price)} ={' '}
                    <Typography component="span" sx={{ fontWeight: 700, color: theme.palette.primary.main, fontSize: '0.85rem' }}>
                      {formatCurrency(quantity * price)}
                    </Typography>
                  </Typography>
                  {parseInt(qtyInput, 10) < MIN_QTY && (
                    <Typography variant="caption" sx={{ display: 'block', color: theme.palette.error.main, mt: 0.25, fontWeight: 600 }}>
                      Minimum {MIN_QTY} pieces required
                    </Typography>
                  )}
                </Box>
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap', width: '100%' }}>

              {soldOut ? (
                <Button
                  variant="white"
                  onClick={handleOrderOnWhatsApp}
                  icon={<WhatsAppIcon sx={{ color: '#25D366' }} />}
                  sx={{ width: { xs: '100%', sm: 'auto' }, flex: { sm: 1 }, height: 48 }}
                >
                  Notify via WhatsApp
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleAddToCart}
                  icon={<ShoppingBagOutlinedIcon />}
                  sx={{ width: { xs: '100%', sm: 'auto' }, flex: { sm: 1 }, height: 48, minWidth: { sm: 160 } }}
                >
                  Add to Bag
                </Button>
              )}

              <Button
                variant="white"
                onClick={handleOrderOnWhatsApp}
                icon={<WhatsAppIcon sx={{ color: '#25D366' }} />}
                sx={{ height: 48, width: { xs: '100%', sm: 'auto' } }}
              >
                Order on WhatsApp
              </Button>

              <Tooltip title="Share gift">
                <IconButton
                  onClick={handleShare}
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    border: `1.5px solid ${theme.palette.divider}`,
                    color: theme.palette.text.secondary,
                    '&:hover': { borderColor: theme.palette.primary.main, color: theme.palette.primary.main },
                  }}
                >
                  <ShareRoundedIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Feature Highlights */}
            <Box
              sx={{
                p: 2.5,
                borderRadius: '16px',
                backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#FBF6EE',
                border: `1px solid ${theme.palette.divider}`,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(3, minmax(0, 1fr))', sm: 'repeat(3, 1fr)' },
                gap: { xs: 1, sm: 2 },
                textAlign: 'center',
                mb: 3,
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                <LocalShippingOutlinedIcon sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  Free Shipping
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                  Orders &gt; ₹999
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                <CardGiftcardOutlinedIcon sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  Gift Packaging
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                  With ribbon & tag
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                <VerifiedUserOutlinedIcon sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  Gift with Purpose
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                  1 gift = 1 stationery kit
                </Typography>
              </Box>
            </Box>

            {/* Tags */}
            {tags.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}>
                  Tags:
                </Typography>
                {tags.map((tag, idx) => (
                  <Chip key={idx} label={`#${tag}`} size="small" sx={{ fontSize: '0.75rem' }} />
                ))}
              </Box>
            )}
          </Box>
        </Box>

        {/* Related Products Shelf */}
        {relatedProducts.length > 0 && (
          <ProductShelf
            eyebrow="Complete The Moment"
            title="You May Also Cherish"
            description="Other thoughtful gifts from the same collection."
            products={relatedProducts}
          />
        )}
      </Container>

      {/* Mobile Sticky Add-to-Cart Bar */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          p: 1.5,
          px: 2,
          backgroundColor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
          boxShadow: '0 -4px 16px rgba(0,0,0,0.08)',
          zIndex: 999,
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
        }}
      >
        <Box sx={{ minWidth: 0, flexShrink: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: '0.7rem',
              display: 'block',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
            }}
          >
            Total for {quantity} pcs
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Fraunces", serif',
              fontWeight: 700,
              fontSize: '1.15rem',
              color: theme.palette.primary.main,
              lineHeight: 1.2,
            }}
          >
            {formatCurrency(price * quantity)}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: '0.6875rem',
              display: 'block',
              lineHeight: 1.1,
            }}
          >
            {formatCurrency(price)} / pc
          </Typography>
        </Box>

        {/* Stepper inside sticky bar */}
        {!soldOut && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: '8px',
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              flexShrink: 0,
            }}
          >
            <IconButton
              size="small"
              onClick={() => setQuantity((q) => Math.max(MIN_QTY, q - 1))}
              disabled={quantity <= MIN_QTY}
              sx={{ p: 0.5, color: theme.palette.text.secondary }}
              aria-label="Decrease quantity"
            >
              <RemoveRoundedIcon sx={{ fontSize: 14 }} />
            </IconButton>
            <Typography sx={{ px: 1, fontSize: '0.8125rem', fontWeight: 700 }}>
              {quantity}
            </Typography>
            <IconButton
              size="small"
              onClick={() => setQuantity((q) => q + 1)}
              sx={{ p: 0.5, color: theme.palette.text.secondary }}
              aria-label="Increase quantity"
            >
              <AddRoundedIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
          <Button
            variant="contained"
            size="small"
            onClick={handleAddToCart}
            disabled={soldOut}
            icon={<ShoppingBagOutlinedIcon sx={{ fontSize: 16 }} />}
            sx={{ px: 1.5, height: 40, fontSize: '0.8125rem', whiteSpace: 'nowrap' }}
          >
            {soldOut ? 'Sold Out' : 'Add to Bag'}
          </Button>

          <Button
            variant="white"
            size="small"
            onClick={handleOrderOnWhatsApp}
            icon={<WhatsAppIcon sx={{ color: '#25D366', fontSize: 18 }} />}
            sx={{ minWidth: 'auto', px: 1.25, height: 40 }}
            aria-label="Order on WhatsApp"
          />
        </Box>
      </Box>
    </Box>
  );
}
