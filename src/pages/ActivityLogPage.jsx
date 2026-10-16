import React from 'react';
import ActivityLogContainer from '../features/activity/ActivityLogContainer';
import PageTransition from '../common/PageTransition';

export default function ActivityLogPage() {
  return (
    <PageTransition>
      <ActivityLogContainer />
    </PageTransition>
  );
}
