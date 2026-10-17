import React from 'react';
import { Box, Container, Typography, useTheme } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import SectionHeading from '../../common/SectionHeading';
import ProductCard from '../../common/ProductCard';
import EmptyState from '../../common/EmptyState';
import Button from '../../common/Button';
import { wishlistActions } from './wishlistSlice';
import { cartActions } from '../cart/cartSlice';

export default function WishlistContainer() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const items = useSelector((state) => state.wishlist?.items || []);

  const handleMoveAllToCart = () => {
    items.forEach((item) => {
      if (!item.soldOut) {
        dispatch(cartActions.addToCart({ ...item, quantity: 1 }));
      }
    });
    dispatch(wishlistActions.clearWishlist());
  };

  return (
    <Box sx={{ py: { xs: 4, md: 8 } }}>
      <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 } }}>
        <SectionHeading
          eyebrow="Saved Memories"
          title="Your Wishlist"
          description="A personal gallery of favorite gifts you have your heart set on."
        />

        {items.length === 0 ? (
          <EmptyState
            title="Your wishlist is empty"
            description="Explore our collections and tap the heart icon on any gift to save it for later."
            actionText="Discover Gifts"
            onAction={() => (window.location.href = '/shop')}
          />
        ) : (
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 4,
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                You have saved <strong>{items.length}</strong> items
              </Typography>

              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' } }}>
                <Button variant="contained" size="small" onClick={handleMoveAllToCart} sx={{ flex: { xs: 1, sm: 'none' } }}>
                  Move All to Bag
                </Button>
                <Button
                  variant="white"
                  size="small"
                  onClick={() => dispatch(wishlistActions.clearWishlist())}
                  sx={{ color: '#D32F2F', flex: { xs: 1, sm: 'none' } }}
                >
                  Clear Wishlist
                </Button>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)',
                },
                gap: 3,
              }}
            >
              {items.map((prod) => (
                <ProductCard key={prod._id || prod.slug} product={prod} />
              ))}
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}
