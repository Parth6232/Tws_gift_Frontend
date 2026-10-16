import { createApi } from '@reduxjs/toolkit/query/react';
import { apiSliceInterceptor } from '../../store/redux/apiSliceInterceptor';

const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: apiSliceInterceptor.baseQueryWithInterceptor,
  tagTypes: ['CHAT'],
  endpoints: (qb) => ({
    sendMessage: qb.mutation({
      query: (payload) => ({
        url: '/chat',
        method: 'POST',
        body: payload,
        hideLoading: true, // Do not trigger global fullscreen loader for chatbot
        hideSuccessToast: true,
        hideErrorToast: true, // Handle error in chat UI bubble
      }),
    }),
  }),
});

export const chatApiReducer = chatApi.reducer;

export const chatApiAction = {
  middleware: chatApi.middleware,
  reducerPath: chatApi.reducerPath,
  sendMessage: chatApi.useSendMessageMutation,
  useSendMessageMutation: chatApi.useSendMessageMutation,
};
