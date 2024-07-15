import {
  reqCreateOrder,
  resCreateOrder,
  resServiceShip,
  resShippingFee,
  resTimeShipping,
  serviceShip,
  shippingFee,
  timeShipping,
} from "@/types/transport.type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

type responsive<T> = { code: number; message: string; data: T };

type province = {
  ProvinceID: number;
  ProvinceName: string;
  NameExtension: string[];
};

type district = {
  DistrictID: number;
  DistrictName: string;
};

type ward = {
  WardCode: string;
  WardName: string;
};

export const transportApi = createApi({
  reducerPath: "transport",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://dev-online-gateway.ghn.vn/shiip/public-api/",
    prepareHeaders: (headers) => {
      headers.set("token", import.meta.env.VITE_TOKEN_GHN_API);
      headers.set("ShopID", import.meta.env.VITE_SHOP_ID);
      return headers;
    },
  }),
  endpoints: (build) => ({
    postShippingFee: build.mutation<responsive<resShippingFee>, shippingFee>({
      query: (body) => ({
        url: "v2/shipping-order/fee",
        method: "POST",
        body,
      }),
    }),
    postServiceShip: build.mutation<responsive<resServiceShip[]>, serviceShip>({
      query: (body) => ({
        url: "v2/shipping-order/available-services",
        method: "POST",
        body,
      }),
    }),
    postTimeShipping: build.mutation<responsive<resTimeShipping>, timeShipping>(
      {
        query: (body) => ({
          url: "v2/shipping-order/leadtime",
          method: "POST",
          body,
        }),
      }
    ),
    getProvince: build.query<responsive<province[]>, void>({
      query: () => ({
        url: "master-data/province",
        method: "GET",
      }),
    }),
    postDistrict: build.mutation<
      responsive<district[]>,
      { province_id: number }
    >({
      query: (body) => ({
        url: "master-data/district",
        method: "POST",
        body,
      }),
    }),
    postWard: build.mutation<responsive<ward[]>, { district_id: number }>({
      query: (body) => ({
        url: "master-data/ward",
        method: "POST",
        body,
      }),
    }),
    postCreateOrder: build.mutation<responsive<resCreateOrder>, reqCreateOrder>(
      {
        query: (body) => ({
          url: "v2/shipping-order/create",
          method: "POST",
          body,
        }),
      }
    ),
    canceledOrderTransport: build.mutation<
      responsive<
        {
          order_code: string;
          result: boolean;
          message: string;
        }[]
      >,
      { order_codes: string[] }
    >({
      query: (body) => ({
        url: "v2/switch-status/cancel",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  usePostShippingFeeMutation,
  useLazyGetProvinceQuery,
  usePostDistrictMutation,
  usePostWardMutation,
  usePostTimeShippingMutation,
  usePostServiceShipMutation,
  usePostCreateOrderMutation,
  useCanceledOrderTransportMutation,
} = transportApi;
