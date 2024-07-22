import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../baseQueryToken";
import {
  IProductRes,
  paramsFilterProduct,
  paramsListProduct,
  productItem,
} from "@/types/product.type";

interface IResponsive {
  listProduct: IProductRes[];
  totalPage: number;
}

interface IResponsiveFilter extends IResponsive {
  amount_filter: number;
  result_search: IProductRes[];
}

interface IResProductDetail {
  data: IProductRes;
  listProductItem: productItem[];
}

type request<T> = T;

export const productApi = createApi({
  reducerPath: "product",
  tagTypes: ["Product", "ProductItem"],
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
              ...result.listProduct.map(({ _id }) => ({
                type: "Product" as const,
                id: _id,
              })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),
    getListProductFilter: build.query<
      IResponsiveFilter,
      request<paramsFilterProduct>
    >({
      query: (params) => ({
        url: "product/filter",
        method: "GET",
        params: { ...params },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.listProduct.map(({ _id }) => ({
                type: "Product" as const,
                id: _id,
              })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),
    getProductLoadMoreData: build.query<
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
        currentCache.listProduct.push(...newItems.listProduct);
      },
      //Refetch when the page arg changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.activePage !== previousArg?.activePage;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.listProduct.map(({ _id }) => ({
                type: "Product" as const,
                id: _id,
              })),
              { type: "Product", id: "LOAD_MORE" },
            ]
          : [{ type: "Product", id: "LOAD_MORE" }],
    }),
    getOneProduct: build.query<IResProductDetail, string>({
      query: (id) => ({ url: "product/" + id }),
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
    getProductItem: build.query<
      { data: productItem },
      { productId: string; size: string }
    >({
      query: (params) => ({
        url: "productItem",
        method: "GET",
        params: { ...params },
      }),
    }),
  }),
});

export const {
  useAddProductMutation,
  useCheckNameMutation,
  useGetListProductQuery,
  useGetOneProductQuery,
  useGetProductLoadMoreDataQuery,
  useGetProductItemQuery,
  useGetListProductFilterQuery,
} = productApi;
