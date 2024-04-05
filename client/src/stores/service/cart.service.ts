import { createApi } from "@reduxjs/toolkit/query/react";
import { ICart } from "../../types/commonType";
import { baseQueryWithAuth } from "../baseQueryToken";

type TArg = { id: string };

type TRes = { cart: ICart };

export const cartApi = createApi({
  reducerPath: "cart",
  tagTypes: ["Carts"],
  baseQuery: baseQueryWithAuth,
  endpoints: (build) => ({
    getCart: build.query<TRes, string>({
      query: (id) => ({
        url: `cart/${id}`,
        method: "GET",
      }),
    }),
    addCart: build.mutation<TRes, TArg>({
      query: () => ({
        url: "login",
        method: "POST",
      }),
    }),
    updateCart: build.mutation<{ message: string }, TArg>({
      query: () => ({
        url: "update_password",
        method: "POST",
      }),
    }),
    deleteCart: build.mutation<TRes, void>({
      query: () => ({
        url: "refreshToken",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddCartMutation,
  useUpdateCartMutation,
  useDeleteCartMutation,
} = cartApi;
