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
      { id: string; params: paramsGetListOrder }
    >({
      query: ({ id, params }) => ({
        url: "order/getOrderUser/" + id,
        method: "GET",
        params: { ...params },
      }),
      keepUnusedDataFor: 0,
      serializeQueryArgs: ({ queryArgs }) => {
        const { id, params } = queryArgs;
        const { limit, status, search } = params;
        return `order/getOrderUser/${id}?limit=${limit}&search=${status}&status=${search}`;
      },

      merge: (currentCache, newItems, { arg }) => {
        // console.log("arg: ", arg);
        // console.log("currentCache: ", currentCache.data.length);
        // console.log("newItems", newItems.data);
        const { activePage, status } = arg.params;
        const currentActivePage = Math.ceil(currentCache.data.length / 4);
        const deleteCount =
          status === "pending"
            ? newItems.data.length + 1
            : newItems.data.length;
        if (currentActivePage >= activePage) {
          currentCache.data.splice(
            4 * (activePage - 1),
            deleteCount,
            ...newItems.data
          );
        } else {
          currentCache.data.push(...newItems.data);
        }

        // console.log(currentCache.data);
      },

      forceRefetch({ currentArg, previousArg }) {
        // console.log("currentArg: ", currentArg);
        // console.log("previousArg: ", previousArg);
        return currentArg?.params.activePage !== previousArg?.params.activePage;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Orders" as const,
                id: _id,
              })),
              { type: "Orders", id: "ORDER_LOAD_MORE" },
            ]
          : [{ type: "Orders", id: "ORDER_LOAD_MORE" }],
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
      providesTags: (result, error, data) => [
        { type: "Orders", id: data.id },
        { type: "Orders", id: data.statusOrder },
      ],
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
      invalidatesTags: ["Orders"],
    }),
    EditCancelledOrder: build.mutation<
      { message: string; orderId: string },
      { id: string; body: reqCancelledOrder }
    >({
      query: ({ id, body }) => ({
        url: "order/cancelled/" + id,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, data) => [
        { type: "Orders", id: data.id },
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
} = orderApi;
