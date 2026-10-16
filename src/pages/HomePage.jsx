import React from 'react';
import HomeContainer from '../features/home/HomeContainer';
import PageTransition from '../common/PageTransition';

export default function HomePage() {
  return (
    <PageTransition>
      <HomeContainer />
    </PageTransition>
  );
}
