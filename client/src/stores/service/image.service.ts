import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../baseQueryToken";

export const imageApi = createApi({
  reducerPath: "image",
  baseQuery: baseQueryWithAuth,
  endpoints: (build) => ({
    removeWithUrl: build.mutation<{ message: string }, { imageUrl: string }>({
      query: (body) => ({
        url: "image/removeWithUrl",
        method: "DELETE",
        body: { ...body },
      }),
    }),
  }),
});

export const { useRemoveWithUrlMutation } = imageApi;
