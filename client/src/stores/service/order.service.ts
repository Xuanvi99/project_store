import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQueryWithAuth } from "../baseQueryToken";
import { IReqOrder, IResOrder, paramsGetListOrder } from "@/types/order.type";

interface IGetResponsive {
  data: IResOrder[];
  totalPage: number;
  amountOrder: number;
}

type reqCancelledOrder = {
  reasonCanceled: string;
  canceller: string;
};

export const orderApi = createApi({
  reducerPath: "order",
  tagTypes: ["Orders"],
  baseQuery: baseQueryWithAuth,
  endpoints: (build) => ({
    getListOrderUser: build.query<
      IGetResponsive,
      { userId: string; params: paramsGetListOrder }
    >({
      query: ({ userId, params }) => ({
        url: "order/getOrderUser/" + userId,
        method: "GET",
        params: { ...params },
      }),
      keepUnusedDataFor: 0,
      serializeQueryArgs: ({ queryArgs }) => {
        const { userId, params } = queryArgs;
        const { limit, status, search } = params;
        return `order/getOrderUser/${userId}?limit=${limit}&search=${status}&status=${search}`;
      },

      merge: (currentCache, newItems, { arg }) => {
        console.log("arg: ", arg);
        console.log("currentCache: ", currentCache.data.length);
        console.log("newItems", newItems.data);
        const { activePage, status } = arg.params;
        const currentActivePage = Math.ceil(currentCache.data.length / 4);
        const deleteCount =
          status === "pending"
            ? newItems.data.length + 1
            : newItems.data.length;
        if (currentActivePage >= activePage) {
          if (newItems.data.length > 0) {
            currentCache.data.splice(
              4 * (activePage - 1),
              deleteCount,
              ...newItems.data
            );
          } else {
            currentCache.data = [];
          }
        } else {
          currentCache.data.push(...newItems.data);
        }
      },

      forceRefetch({ currentArg, previousArg }) {
        // console.log("currentArg: ", currentArg);
        // console.log("previousArg: ", previousArg);
        return currentArg?.params.activePage !== previousArg?.params.activePage;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ codeOrder }) => ({
                type: "Orders" as const,
                id: codeOrder,
              })),
              { type: "Orders", id: "ORDER_LOAD_MORE" },
            ]
          : [{ type: "Orders", id: "ORDER_LOAD_MORE" }],
    }),
    getAmountOrderUser: build.query<
      { amountOrder: number },
      { userId: string; statusOrder: string }
    >({
      query: ({ userId, statusOrder }) => ({
        url: "order/getAmountOrderUser/" + userId,
        method: "GET",
        params: { statusOrder },
      }),
      providesTags: (result, error, data) => [
        { type: "Orders", id: data.userId },
        { type: "Orders", id: data.statusOrder },
      ],
    }),
    getOrderDetail: build.query<{ data: IResOrder }, string>({
      query: (codeOrder) => ({
        url: "order/getDetailOrder/" + codeOrder,
        method: "get",
      }),
      providesTags: (result, error, codeOrder) => [
        {
          type: "Orders",
          id: codeOrder,
        },
      ],
    }),
    createOrder: build.mutation<
      { message: string; codeOrder: string; orderId: string },
      IReqOrder
    >({
      query: (body) => ({
        url: "order/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Orders"],
    }),

    EditCancelledOrder: build.mutation<
      { message: string; orderId: string },
      { codeOrder: string; body: reqCancelledOrder }
    >({
      query: ({ codeOrder, body }) => ({
        url: "order/cancelled/" + codeOrder,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, data) => [
        { type: "Orders", id: data.codeOrder },
        { type: "Orders", id: "pending" },
      ],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetListOrderUserQuery,
  useGetAmountOrderUserQuery,
  useEditCancelledOrderMutation,
  useLazyGetAmountOrderUserQuery,
  useLazyGetOrderDetailQuery,
} = orderApi;
