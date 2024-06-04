import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQueryWithAuth } from "../baseQueryToken";

type TReqCreatePayment = {
  totalPriceOrder: number;
  bankCode: string | null;
  language: string;
};

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
    vnPayIpn: build.query<{ vnpUrl: string }, string>({
      query: (params) => ({
        url: "vnpay/vnpay_ipn" + params,
        method: "GET",
      }),
    }),
  }),
});

export const { useCreatePaymentMutation, useVnPayIpnQuery } = vnpayApi;
