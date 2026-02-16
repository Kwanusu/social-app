import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

export const socialApi = createApi({
    reducerPath: 'socialApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com/'}),
    endpoints: (builder) => ({
        getPosts: builder.query({
            query: () => 'posts?_limit=10'
        }),
        // fetch user details for the profile
        getUser: builder.query({
            query: (id) => `users/${id}`
        }),
    }),
});
export const { useGetPostsQuery, useGetUserQuery} = socialApi