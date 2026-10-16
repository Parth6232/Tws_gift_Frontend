import { createApi } from '@reduxjs/toolkit/query/react';
import { apiSliceInterceptor } from '../../store/redux/apiSliceInterceptor';

const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: apiSliceInterceptor.baseQueryWithInterceptor,
  tagTypes: ['CATEGORIES'],
  endpoints: (qb) => ({
    getCategories: qb.query({
      query: () => ({
        url: '/categories',
        method: 'GET',
      }),
      providesTags: ['CATEGORIES'],
    }),
    createCategory: qb.mutation({
      query: (payload) => ({
        url: '/categories',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['CATEGORIES'],
    }),
    updateCategory: qb.mutation({
      query: ({ id, ...payload }) => ({
        url: `/categories/${id}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['CATEGORIES'],
    }),
    deleteCategory: qb.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CATEGORIES'],
    }),
  }),
});

export const categoryApiReducer = categoryApi.reducer;

export const categoryApiAction = {
  middleware: categoryApi.middleware,
  reducerPath: categoryApi.reducerPath,
  getCategories: categoryApi.useGetCategoriesQuery,
  useGetCategoriesQuery: categoryApi.useGetCategoriesQuery,
  createCategory: categoryApi.useCreateCategoryMutation,
  useCreateCategoryMutation: categoryApi.useCreateCategoryMutation,
  updateCategory: categoryApi.useUpdateCategoryMutation,
  useUpdateCategoryMutation: categoryApi.useUpdateCategoryMutation,
  deleteCategory: categoryApi.useDeleteCategoryMutation,
  useDeleteCategoryMutation: categoryApi.useDeleteCategoryMutation,
};
