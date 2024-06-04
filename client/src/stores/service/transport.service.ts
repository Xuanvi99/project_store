import {
  resShippingFee,
  resTimeShipping,
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
  }),
});

export const {
  usePostShippingFeeMutation,
  useLazyGetProvinceQuery,
  usePostDistrictMutation,
  usePostWardMutation,
  usePostTimeShippingMutation,
} = transportApi;
