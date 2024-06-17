import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../baseQueryToken";
import { ICart, ICartItem } from "@/types/cart.type";
import { IProductRes } from "@/types/product.type";

type TArg = { id: string; productId: string; size: string; quantity: number };

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
      providesTags: (result, error, id) => [{ type: "Carts", id }],
    }),
    addToCart: build.mutation<
      { message: string; cartItem: ICartItem<IProductRes> },
      TArg
    >({
      query: ({ id, ...body }) => ({
        url: `cart/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, data) => [
        { type: "Carts", id: data.id },
      ],
    }),
    repurchaseProductToCart: build.mutation<
      { message: string; listCartItem: ICartItem<IProductRes>[] },
      { id: string; listProductToCart: Omit<ICartItem<string>, "_id">[] }
    >({
      query: ({ id, listProductToCart }) => ({
        url: `cart/repurchase/${id}`,
        method: "POST",
        body: { listProductToCart },
      }),
      invalidatesTags: (result, error, data) => [
        { type: "Carts", id: data.id },
      ],
    }),
    updateCart: build.mutation<{ message: string }, TArg>({
      query: ({ id, ...body }) => ({
        url: `cart/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, data) => [
        { type: "Carts", id: data.id },
      ],
    }),
    deleteCartOne: build.mutation<{ message: string }, Omit<TArg, "quantity">>({
      query: ({ id, ...body }) => ({
        url: `cart/${id}`,
        method: "DELETE",
        body,
      }),
      invalidatesTags: (result, error, data) => [
        { type: "Carts", id: data.id },
      ],
    }),
    deleteCartMultiple: build.mutation<
      { message: string },
      { id: string; listIdProduct: string[] }
    >({
      query: ({ id, ...body }) => ({
        url: `cart/deleteMultiple/${id}`,
        method: "DELETE",
        body,
      }),
      invalidatesTags: (result, error, data) => [
        { type: "Carts", id: data.id },
      ],
    }),
    deleteCartAll: build.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `cart/deleteALl/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Carts", id }],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartMutation,
  useDeleteCartOneMutation,
  useDeleteCartMultipleMutation,
  useDeleteCartAllMutation,
  useRepurchaseProductToCartMutation,
} = cartApi;
