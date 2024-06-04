import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQueryWithAuth } from "../baseQueryToken";

export const orderApi = createApi({
  reducerPath: "order",
  baseQuery: baseQueryWithAuth,
  endpoints: (build) => ({
    createOrder: build.mutation<{ totalPage: number }, string>({
      query: (body) => ({
        url: "order/create",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreateOrderMutation } = orderApi;
