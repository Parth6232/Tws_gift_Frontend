import React from 'react';
import ProductFormContainer from '../features/productManagement/ProductFormContainer';
import PageTransition from '../common/PageTransition';

export default function ProductFormPage() {
  return (
    <PageTransition>
      <ProductFormContainer />
    </PageTransition>
  );
}
