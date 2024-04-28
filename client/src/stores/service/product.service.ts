import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../baseQueryToken";

export const productApi = createApi({
  reducerPath: "product",
  tagTypes: ["Product"],
  baseQuery: baseQueryWithAuth,
  endpoints: (build) => ({
    addProduct: build.mutation<{ message: string }, FormData>({
      query: (body) => ({
        url: "product",
        method: "POST",
        body,
      }),
    }),
    checkName: build.mutation<{ message: string }, { name: string }>({
      query: (body) => ({
        url: "product/checkName",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useAddProductMutation, useCheckNameMutation } = productApi;
