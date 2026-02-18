// src/store/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const socialApi = createApi({
  reducerPath: 'socialApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com/' }),
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => 'posts?_limit=10',
    }),
    getUser: builder.query({
      query: (id) => `users/${id}`,
    }),
  }),
});

// 🚨 CHECK THESE NAMES CAREFULLY 🚨
export const { useGetPostsQuery, useGetUserQuery } = socialApi;