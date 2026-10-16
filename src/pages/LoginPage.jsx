import React from 'react';
import LoginContainer from '../features/auth/LoginContainer';
import PageTransition from '../common/PageTransition';

export default function LoginPage() {
  return (
    <PageTransition>
      <LoginContainer />
    </PageTransition>
  );
}
