import { createApi } from '@reduxjs/toolkit/query/react';
import { apiSliceInterceptor } from '../../store/redux/apiSliceInterceptor';

const productManagementApi = createApi({
  reducerPath: 'productManagementApi',
  baseQuery: apiSliceInterceptor.baseQueryWithInterceptor,
  tagTypes: ['MY_PRODUCTS', 'PRODUCTS'],
  endpoints: (qb) => ({
    getMyProducts: qb.query({
      query: () => ({
        url: '/products/mine/all',
        method: 'GET',
      }),
      providesTags: ['MY_PRODUCTS'],
    }),
    createProduct: qb.mutation({
      query: (formData) => ({
        url: '/products',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['MY_PRODUCTS', 'PRODUCTS'],
    }),
    updateProduct: qb.mutation({
      query: ({ id, formData }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['MY_PRODUCTS', 'PRODUCTS'],
    }),
    deleteProduct: qb.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MY_PRODUCTS', 'PRODUCTS'],
    }),
  }),
});

export const productManagementApiReducer = productManagementApi.reducer;

export const productManagementApiAction = {
  middleware: productManagementApi.middleware,
  reducerPath: productManagementApi.reducerPath,
  getMyProducts: productManagementApi.useGetMyProductsQuery,
  useGetMyProductsQuery: productManagementApi.useGetMyProductsQuery,
  useLazyGetMyProductsQuery: productManagementApi.useLazyGetMyProductsQuery,
  createProduct: productManagementApi.useCreateProductMutation,
  useCreateProductMutation: productManagementApi.useCreateProductMutation,
  updateProduct: productManagementApi.useUpdateProductMutation,
  useUpdateProductMutation: productManagementApi.useUpdateProductMutation,
  deleteProduct: productManagementApi.useDeleteProductMutation,
  useDeleteProductMutation: productManagementApi.useDeleteProductMutation,
};
