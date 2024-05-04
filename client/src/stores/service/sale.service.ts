import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQueryWithAuth } from "../baseQueryToken";
import { ISale } from "@/types/product.type";

type TParams = {
  activePage: number | 1;
  limit: number | 10;
  status: "flashSale" | "sale";
};

export const saleApi = createApi({
  reducerPath: "sale",
  baseQuery: baseQueryWithAuth,
  endpoints: (build) => ({
    getListSale: build.query<{ data: ISale; totalPage: number }, TParams>({
      query: (params) => ({
        url: "sale/listSale",
        method: "GET",
        params: { ...params },
      }),
    }),
  }),
});

export const { useGetListSaleQuery } = saleApi;
