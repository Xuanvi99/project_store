import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../baseQueryToken";
import {
  IParamsFilterProductDashboard,
  IProductRes,
  TParamsFilterProduct,
  TParamsListProduct,
  productItem,
  TResStatisticsProduct,
  IResProductDeleted,
} from "@/types/product.type";

interface IResponsive<T> {
  listProduct: T[];
  totalPage: number;
  amountProductFound: number;
}

interface IResponsiveFilter extends IResponsive<IProductRes> {
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
    getListProduct: build.query<
      IResponsive<IProductRes>,
      request<TParamsListProduct>
    >({
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
    getProductLoadMoreData: build.query<
      IResponsiveFilter,
      request<TParamsFilterProduct>
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
    getListProductFilter: build.query<
      IResponsiveFilter,
      request<TParamsFilterProduct>
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
    getListProductFilterDashboard: build.query<
      IResponsiveFilter,
      request<IParamsFilterProductDashboard>
    >({
      query: (params) => ({
        url: "product/dashboard/filter",
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
    getListProductDeleted: build.query<
      IResponsive<IResProductDeleted>,
      request<TParamsListProduct>
    >({
      query: (params) => ({
        url: "product/dashboard/deleted",
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
      providesTags: (result, error, data) => [
        { type: "Product", id: data.productId },
      ],
    }),
    getStatisticsProduct: build.query<TResStatisticsProduct, void>({
      query: () => ({
        url: "product/statistics",
        method: "GET",
      }),
      providesTags: [{ type: "Product" }],
    }),
    deleteOneProduct: build.mutation<
      { message: string },
      { productId: string; userId: string }
    >({
      query: ({ productId, userId }) => ({
        url: `product/deleteOne/${productId}`,
        method: "DELETE",
        body: { userId },
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    //delete multiple product
    deleteMultipleProduct: build.mutation<
      { message: string },
      { listProductId: string[]; userId: string }
    >({
      query: (body) => ({
        url: `product/deleteMultiple`,
        method: "DELETE",
        body,
      }),
      invalidatesTags: [{ type: "Product" }],
    }),
    // khôi phục sản phẩm
    restoreOneProduct: build.mutation<{ message: string }, string>({
      query: (productId) => ({
        url: `product/restoreOne/${productId}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, productId) => [
        { type: "Product", id: productId },
      ],
    }),

    restoreMultipleProduct: build.mutation<
      { message: string },
      { listProductId: string[] }
    >({
      query: (body) => ({
        url: `product/restoreMultiple`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Product" }],
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
  useGetListProductFilterDashboardQuery,
  useGetListProductDeletedQuery,
  useDeleteOneProductMutation,
  useDeleteMultipleProductMutation,
  useRestoreOneProductMutation,
  useRestoreMultipleProductMutation,
  useGetStatisticsProductQuery,
} = productApi;
