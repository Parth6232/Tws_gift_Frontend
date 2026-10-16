import { createApi } from '@reduxjs/toolkit/query/react';
import { apiSliceInterceptor } from '../apiSliceInterceptor';

const commonApi = createApi({
  reducerPath: 'commonApi',
  baseQuery: apiSliceInterceptor.baseQueryWithInterceptor,
  tagTypes: ['CATEGORIES', 'COMMON'],
  endpoints: (qb) => ({
    getCategories: qb.query({
      query: () => ({
        url: '/categories',
        method: 'GET',
      }),
      providesTags: ['CATEGORIES'],
    }),
    checkHealth: qb.query({
      query: () => ({
        url: '/health',
        method: 'GET',
        hideLoading: true,
      }),
    }),
  }),
});

export const commonApiReducer = commonApi.reducer;

export const commonApiAction = {
  middleware: commonApi.middleware,
  reducerPath: commonApi.reducerPath,
  getCategories: commonApi.useGetCategoriesQuery,
  useGetCategoriesQuery: commonApi.useGetCategoriesQuery,
  checkHealth: commonApi.useCheckHealthQuery,
};
