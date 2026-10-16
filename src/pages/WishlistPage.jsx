import React from 'react';
import WishlistContainer from '../features/wishlist/WishlistContainer';
import PageTransition from '../common/PageTransition';

export default function WishlistPage() {
  return (
    <PageTransition>
      <WishlistContainer />
    </PageTransition>
  );
}
