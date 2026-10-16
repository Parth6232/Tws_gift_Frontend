import React from 'react';
import CategoryContainer from '../features/categoryManagement/CategoryContainer';
import PageTransition from '../common/PageTransition';

export default function CategoryPage() {
  return (
    <PageTransition>
      <CategoryContainer />
    </PageTransition>
  );
}
