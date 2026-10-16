import { createApi } from '@reduxjs/toolkit/query/react';
import { apiSliceInterceptor } from '../../store/redux/apiSliceInterceptor';

const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: apiSliceInterceptor.baseQueryWithInterceptor,
  tagTypes: ['PRODUCTS', 'PRODUCT_DETAIL'],
  endpoints: (qb) => ({
    getProducts: qb.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value);
          }
        });
        return {
          url: `/products?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ _id }) => ({ type: 'PRODUCTS', id: _id })),
              { type: 'PRODUCTS', id: 'LIST' },
            ]
          : [{ type: 'PRODUCTS', id: 'LIST' }],
    }),
    getProductBySlug: qb.query({
      query: (slug) => ({
        url: `/products/${slug}`,
        method: 'GET',
      }),
      providesTags: (result, error, slug) => [{ type: 'PRODUCT_DETAIL', id: slug }],
    }),
  }),
});

export const productApiReducer = productApi.reducer;

export const productApiAction = {
  middleware: productApi.middleware,
  reducerPath: productApi.reducerPath,
  getProducts: productApi.useGetProductsQuery,
  useGetProductsQuery: productApi.useGetProductsQuery,
  useLazyGetProductsQuery: productApi.useLazyGetProductsQuery,
  getProductBySlug: productApi.useGetProductBySlugQuery,
  useGetProductBySlugQuery: productApi.useGetProductBySlugQuery,
};
