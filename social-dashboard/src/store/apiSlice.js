import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const socialApi = createApi({
  reducerPath: 'socialApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://fakestoreapi.com/' }),
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => 'products?limit=10',
      transformResponse: (response) => response.map(post => ({
        id: post.id,
        title: post.title,
        body: post.description, // <--- IMPORTANT: Map description to body
        userId: post.id,         // FakeStore doesn't have userId, so we use ID
      }))
    }),
    getUser: builder.query({
      query: (id) => `users/${id}`,
    }),
  }),
});

export const { useGetPostsQuery, useGetUserQuery } = socialApi;