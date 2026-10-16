import React from 'react';
import CartContainer from '../features/cart/CartContainer';
import PageTransition from '../common/PageTransition';

export default function CartPage() {
  return (
    <PageTransition>
      <CartContainer />
    </PageTransition>
  );
}
