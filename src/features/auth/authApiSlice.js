import { createApi } from '@reduxjs/toolkit/query/react';
import { apiSliceInterceptor } from '../../store/redux/apiSliceInterceptor';

const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: apiSliceInterceptor.baseQueryWithInterceptor,
  tagTypes: ['AUTH', 'USER_ME'],
  endpoints: (qb) => ({
    login: qb.mutation({
      query: (payload) => ({
        url: '/auth/login',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['AUTH', 'USER_ME'],
    }),
    logout: qb.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['AUTH', 'USER_ME'],
    }),
    getMe: qb.query({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
        hideLoading: true,
        hideErrorToast: true,
      }),
      providesTags: ['USER_ME'],
    }),
  }),
});

export const authApiReducer = authApi.reducer;

export const authApiAction = {
  middleware: authApi.middleware,
  reducerPath: authApi.reducerPath,
  login: authApi.useLoginMutation,
  useLoginMutation: authApi.useLoginMutation,
  logout: authApi.useLogoutMutation,
  useLogoutMutation: authApi.useLogoutMutation,
  getMe: authApi.useGetMeQuery,
  useGetMeQuery: authApi.useGetMeQuery,
  useLazyGetMeQuery: authApi.useLazyGetMeQuery,
};
