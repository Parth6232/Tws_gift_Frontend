import React from 'react';
import ShopContainer from '../features/shop/ShopContainer';
import PageTransition from '../common/PageTransition';

export default function ShopPage() {
  return (
    <PageTransition>
      <ShopContainer />
    </PageTransition>
  );
}
