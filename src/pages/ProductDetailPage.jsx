import React from 'react';
import ProductDetailContainer from '../features/product/ProductDetailContainer';
import PageTransition from '../common/PageTransition';

export default function ProductDetailPage() {
  return (
    <PageTransition>
      <ProductDetailContainer />
    </PageTransition>
  );
}
