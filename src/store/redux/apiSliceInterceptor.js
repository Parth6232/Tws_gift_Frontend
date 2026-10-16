import { fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import { toastActions } from './slices/toastSlice';
import { appConstants } from '../../constant/appConstants';

// Counter to track concurrent active API calls
let activeApiCalls = 0;

const apiSliceInterceptor = {};

// fetchBaseQuery with credentials include (for httpOnly cookie) and baseUrl
apiSliceInterceptor.baseQuery = fetchBaseQuery({
  baseUrl: appConstants.apiBaseURL,
  credentials: 'include',
});

apiSliceInterceptor.baseQueryWithInterceptor = async (args, api, extraOptions) => {
  // Increment active call counter unless explicitly hidden
  if (!args?.hideLoading) {
    activeApiCalls += 1;
    if (activeApiCalls === 1) {
      api.dispatch(toastActions.setIsLoading(true));
    }
  }

  try {
    const result = await apiSliceInterceptor.baseQuery(args, api, extraOptions);

    if (result.error) {
      const status = result.error.status || result.error.originalStatus;
      let toastMessage = 'Something went wrong';

      if (status === 401) {
        // httpOnly cookie expired or unauthorized
        api.dispatch(toastActions.resetProfileData());
        // If on admin route, redirect to /admin/login
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login';
        }
      }

      if (result?.error?.data?.message) {
        toastMessage = result.error.data.message;
      } else if (result?.error?.message) {
        toastMessage = result.error.message;
      }

      // Do not show noisy toast for normal 401 on /auth/me during initial hydration or rate limit handled by chatbot
      const isAuthMeCheck = typeof args === 'string' ? args.includes('/auth/me') : args?.url?.includes('/auth/me');
      const isChatEndpoint = typeof args === 'string' ? args.includes('/chat') : args?.url?.includes('/chat');

      if (!args?.hideErrorToast && !isAuthMeCheck && !isChatEndpoint) {
        api.dispatch(
          toastActions.setToastData({
            message: toastMessage,
            variant: 'error',
          })
        );
      }
    } else {
      // Auto success toast for write operations (POST, PUT, DELETE, PATCH) if not suppressed
      const method = args?.method?.toUpperCase?.();
      if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method) && !args?.hideSuccessToast) {
        const msg = result?.data?.message || result?.data?.data?.message;
        if (msg) {
          api.dispatch(
            toastActions.setToastData({
              message: msg,
              variant: 'success',
            })
          );
        }
      }
    }

    return result;
  } catch (error) {
    api.dispatch(
      toastActions.setToastData({
        message: error?.message || 'Network error occurred',
        variant: 'error',
      })
    );
    return { error };
  } finally {
    if (!args?.hideLoading) {
      activeApiCalls -= 1;
      if (activeApiCalls <= 0) {
        activeApiCalls = 0;
        api.dispatch(toastActions.setIsLoading(false));
      }
    }
  }
};

apiSliceInterceptor.baseQueryWithRetry = retry(apiSliceInterceptor.baseQueryWithInterceptor, {
  maxRetries: 2,
});

export { apiSliceInterceptor };
