import React, { Suspense, useEffect } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import AppRoutes from './router/AppRoutes';
import { toastActions } from './store/redux/slices/toastSlice';
import { authApiAction } from './features/auth/authApiSlice';
import Loader from './common/Loader';

export default function App() {
  const dispatch = useDispatch();
  const toast = useSelector((state) => state.toast);

  // Hydrate user on application start via /auth/me
  const { data: meUser } = authApiAction.useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (meUser) {
      dispatch(toastActions.setProfileData(meUser));
    }
  }, [meUser, dispatch]);

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') return;
    dispatch(toastActions.resetToastData());
  };

  return (
    <Suspense fallback={<Loader loading position="fixed" size="md" message="Wrapping your experience..." />}>
      <AppRoutes />

      {/* Global Snackbar Toasts */}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={toast.open}
        autoHideDuration={4500}
        onClose={handleCloseToast}
        sx={{ zIndex: 999999 }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.variant === 'error' ? 'error' : toast.variant === 'success' ? 'success' : 'info'}
          variant="filled"
          sx={{
            width: '100%',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            fontWeight: 500,
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Suspense>
  );
}
