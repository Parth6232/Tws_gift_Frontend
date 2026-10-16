import React from 'react';
import ProductListContainer from '../features/productManagement/ProductListContainer';
import PageTransition from '../common/PageTransition';

export default function ProductListPage() {
  return (
    <PageTransition>
      <ProductListContainer />
    </PageTransition>
  );
}
