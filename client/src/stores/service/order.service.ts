import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQueryWithAuth } from "../baseQueryToken";
import { IReqOrder, IResOrder, paramsGetListOrder } from "@/types/order.type";

interface IGetResponsive {
  data: IResOrder[];
  totalPage: number;
  amountOrder: number;
}

export const orderApi = createApi({
  reducerPath: "order",
  tagTypes: ["Order"],
  baseQuery: baseQueryWithAuth,
  endpoints: (build) => ({
    getListOrderUser: build.query<
      IGetResponsive,
      { id: string; params: paramsGetListOrder }
    >({
      query: ({ id, params }) => ({
        url: "order/getOrderUser/" + id,
        method: "GET",
        params: { ...params },
      }),
      serializeQueryArgs: ({ queryArgs }) => {
        const { params } = queryArgs;
        const { limit, status, search } = params;
        return { limit, status, search };
      },

      merge: (currentCache, newItems) => {
        currentCache.data.push(...newItems.data);
      },

      forceRefetch({ currentArg, previousArg }) {
        return (
          currentArg?.params.activePage !== previousArg?.params.activePage ||
          currentArg?.params.search !== previousArg?.params.search
        );
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Order" as const,
                id: _id,
              })),
              { type: "Order", id: "LOAD_MORE_ORDER_USER" },
            ]
          : [{ type: "Order", id: "LOAD_MORE_ORDER_USER" }],
    }),
    getAmountOrderUser: build.query<
      { amountOrder: number },
      { id: string; statusOrder: string }
    >({
      query: ({ id, statusOrder }) => ({
        url: "order/getAmountOrderUser/" + id,
        method: "GET",
        params: { statusOrder },
      }),
      providesTags: (result, error, data) => [{ type: "Order", id: data.id }],
    }),
    createOrder: build.mutation<
      { message: string; orderId: string },
      IReqOrder
    >({
      query: (body) => ({
        url: "order/create",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetListOrderUserQuery,
  useGetAmountOrderUserQuery,
} = orderApi;
