import { createApi } from '@reduxjs/toolkit/query/react';
import { apiSliceInterceptor } from '../../store/redux/apiSliceInterceptor';

const userAndPermissionApi = createApi({
  reducerPath: 'userAndPermissionApi',
  baseQuery: apiSliceInterceptor.baseQueryWithInterceptor,
  tagTypes: ['USERS', 'TEAM'],
  endpoints: (qb) => ({
    getUsers: qb.query({
      query: () => ({
        url: '/users',
        method: 'GET',
      }),
      providesTags: ['USERS'],
    }),
    createUser: qb.mutation({
      query: (payload) => ({
        url: '/users',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['USERS', 'TEAM'],
    }),
    updatePermissions: qb.mutation({
      query: ({ id, permissions }) => ({
        url: `/users/${id}/permissions`,
        method: 'PATCH',
        body: { permissions },
      }),
      invalidatesTags: ['USERS', 'TEAM'],
    }),
    setStatus: qb.mutation({
      query: ({ id, isActive }) => ({
        url: `/users/${id}/status`,
        method: 'PATCH',
        body: { isActive },
      }),
      invalidatesTags: ['USERS', 'TEAM'],
    }),
  }),
});

export const userAndPermissionApiReducer = userAndPermissionApi.reducer;

export const userAndPermissionApiAction = {
  middleware: userAndPermissionApi.middleware,
  reducerPath: userAndPermissionApi.reducerPath,
  getUsers: userAndPermissionApi.useGetUsersQuery,
  useGetUsersQuery: userAndPermissionApi.useGetUsersQuery,
  createUser: userAndPermissionApi.useCreateUserMutation,
  useCreateUserMutation: userAndPermissionApi.useCreateUserMutation,
  updatePermissions: userAndPermissionApi.useUpdatePermissionsMutation,
  useUpdatePermissionsMutation: userAndPermissionApi.useUpdatePermissionsMutation,
  setStatus: userAndPermissionApi.useSetStatusMutation,
  useSetStatusMutation: userAndPermissionApi.useSetStatusMutation,
};
