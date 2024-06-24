import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQueryWithAuth } from "../baseQueryToken";
import { IResOrder } from "@/types/order.type";

type TReqCreatePayment = {
  totalPricePayment: number;
  bankCode: string | null;
  language: string;
  codeOrder: string;
};

export type TResVnpay = { RspCode: string; Message: string; data: IResOrder };

export const vnpayApi = createApi({
  reducerPath: "vnpay",
  baseQuery: baseQueryWithAuth,
  endpoints: (build) => ({
    createPayment: build.mutation<{ vnpUrl: string }, TReqCreatePayment>({
      query: (body) => ({
        url: "vnpay/createPayment",
        method: "POST",
        body,
      }),
    }),
    vnPayIpn: build.query<
      TResVnpay,
      { codeOrder: string | undefined; params: string }
    >({
      query: ({ codeOrder, params }) => ({
        url: `vnpay/vnpay_ipn/${codeOrder}` + params,
        method: "GET",
      }),
    }),
  }),
});

export const { useCreatePaymentMutation, useVnPayIpnQuery } = vnpayApi;
