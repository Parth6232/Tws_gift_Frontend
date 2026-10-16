import React from 'react';
import DashboardContainer from '../features/dashboard/DashboardContainer';
import PageTransition from '../common/PageTransition';

export default function DashboardPage() {
  return (
    <PageTransition>
      <DashboardContainer />
    </PageTransition>
  );
}
