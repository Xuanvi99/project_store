import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../baseQueryToken";
import {
  IProductRes,
  paramsFilterProduct,
  paramsListProduct,
  paramsListSale,
} from "@/types/product.type";

interface IResponsive {
  data: IProductRes[];
  totalPage: number;
}

interface IResponsiveFilter extends IResponsive {
  result_filter: number;
  result_search: IProductRes[];
}

type request<T> = T;

export const productApi = createApi({
  reducerPath: "product",
  tagTypes: ["Product"],
  baseQuery: baseQueryWithAuth,
  endpoints: (build) => ({
    getListProduct: build.query<IResponsive, request<paramsListProduct>>({
      query: (params) => ({
        url: "product",
        method: "GET",
        params: { ...params },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Product" as const,
                id: _id,
              })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),
    getListSale: build.query<IResponsive, request<paramsListSale>>({
      query: (params) => ({
        url: "product/listSale",
        method: "GET",
        params: { ...params },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Product" as const,
                id: _id,
              })),
              { type: "Product", id: "LIST_SALE" },
            ]
          : [{ type: "Product", id: "LIST_SALE" }],
    }),
    getLoadMoreData: build.query<
      IResponsiveFilter,
      request<paramsFilterProduct>
    >({
      query: (params) => ({
        url: "product/filter",
        method: "GET",
        params: { ...params },
      }),
      serializeQueryArgs: ({ queryArgs }) => {
        const { search, sortBy, order, min_price, max_price } = queryArgs;
        return { search, sortBy, order, min_price, max_price };
      },
      // Always merge incoming data to the cache entry
      merge: (currentCache, newItems) => {
        currentCache.data.push(...newItems.data);
      },
      //Refetch when the page arg changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.activePage !== previousArg?.activePage;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Product" as const,
                id: _id,
              })),
              { type: "Product", id: "LOAD_MORE" },
            ]
          : [{ type: "Product", id: "LOAD_MORE" }],
    }),
    getOneProduct: build.query<{ data: IProductRes }, string>({
      query: (slugOrId) => ({ url: "product/" + slugOrId }),
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
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

export const {
  useAddProductMutation,
  useCheckNameMutation,
  useGetListProductQuery,
  useGetOneProductQuery,
  useGetListSaleQuery,
  useGetLoadMoreDataQuery,
} = productApi;
