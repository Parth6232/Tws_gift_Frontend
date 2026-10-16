import { createApi } from '@reduxjs/toolkit/query/react';
import { apiSliceInterceptor } from '../../store/redux/apiSliceInterceptor';

const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: apiSliceInterceptor.baseQueryWithInterceptor,
  tagTypes: ['DASHBOARD_STATS', 'DASHBOARD_TEAM', 'DASHBOARD_ACTIVITY', 'USER_PRODUCTS'],
  endpoints: (qb) => ({
    getStats: qb.query({
      query: () => ({
        url: '/dashboard/stats',
        method: 'GET',
      }),
      providesTags: ['DASHBOARD_STATS'],
    }),
    getTeam: qb.query({
      query: () => ({
        url: '/dashboard/team',
        method: 'GET',
      }),
      providesTags: ['DASHBOARD_TEAM'],
    }),
    getActivity: qb.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value);
          }
        });
        return {
          url: `/dashboard/activity?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['DASHBOARD_ACTIVITY'],
    }),
    getUserProducts: qb.query({
      query: ({ id, limit = 50 }) => ({
        url: `/dashboard/users/${id}/products?limit=${limit}`,
        method: 'GET',
      }),
      providesTags: (result, error, { id }) => [{ type: 'USER_PRODUCTS', id }],
    }),
  }),
});

export const dashboardApiReducer = dashboardApi.reducer;

export const dashboardApiAction = {
  middleware: dashboardApi.middleware,
  reducerPath: dashboardApi.reducerPath,
  getStats: dashboardApi.useGetStatsQuery,
  useGetStatsQuery: dashboardApi.useGetStatsQuery,
  getTeam: dashboardApi.useGetTeamQuery,
  useGetTeamQuery: dashboardApi.useGetTeamQuery,
  getActivity: dashboardApi.useGetActivityQuery,
  useGetActivityQuery: dashboardApi.useGetActivityQuery,
  getUserProducts: dashboardApi.useGetUserProductsQuery,
  useGetUserProductsQuery: dashboardApi.useGetUserProductsQuery,
  useLazyGetUserProductsQuery: dashboardApi.useLazyGetUserProductsQuery,
};
