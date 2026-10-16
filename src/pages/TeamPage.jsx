import React from 'react';
import TeamContainer from '../features/userAndPermission/TeamContainer';
import PageTransition from '../common/PageTransition';

export default function TeamPage() {
  return (
    <PageTransition>
      <TeamContainer />
    </PageTransition>
  );
}
