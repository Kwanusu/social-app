import { configureStore } from "@reduxjs/toolkit";
import { socialApi } from "./apiSlice";

export const store = configureStore({
    reducer: {
        [socialApi.reducerPath]: socialApi.reducer,
    },
    //api middleware to enable caching, invalidation and polling
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(socialApi.middleware),
});