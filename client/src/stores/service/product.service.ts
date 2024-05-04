import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../baseQueryToken";
import { IProductRes } from "@/types/product.type";

type paramsListProduct = {
  activePage: number | 1;
  limit: number | 10;
  search: string;
};

type paramsListSale = {
  activePage: number | 1;
  limit: number | 10;
  is_sale: "flashSale" | "sale";
};

export const productApi = createApi({
  reducerPath: "product",
  tagTypes: ["Product", "ProductSale"],
  baseQuery: baseQueryWithAuth,
  endpoints: (build) => ({
    getListProduct: build.query<
      { data: IProductRes[]; totalPage: number },
      paramsListProduct
    >({
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
    getLisSale: build.query<
      { data: IProductRes[]; totalPage: number },
      paramsListSale
    >({
      query: (params) => ({
        url: "product/listSale",
        method: "GET",
        params: { ...params },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({
                type: "ProductSale" as const,
                id: _id,
              })),
              { type: "ProductSale", id: "LIST" },
            ]
          : [{ type: "ProductSale", id: "LIST" }],
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
  useGetLisSaleQuery,
} = productApi;
