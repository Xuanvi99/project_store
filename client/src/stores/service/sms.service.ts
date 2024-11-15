import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export type TReqSms = {
  messages: [{ destinations: [{ to: string }]; from: string; text: string }];
};

export const smsOtpApi = createApi({
  reducerPath: "smsOtpApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "",
    prepareHeaders: (headers) => {
      headers.set(
        "authorization",
        `App ${import.meta.env.VITE_API_KEY_INFOBIP}`
      );
      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");

      return headers;
    },
  }),

  endpoints: (build) => ({
    sendSmsOTP: build.mutation<void, TReqSms>({
      query: (raw) => ({
        url: "https://z1wnz2.api.infobip.com/sms/2/text/advanced",
        method: "POST",
        body: JSON.stringify(raw),
      }),
    }),
  }),
});

export const { useSendSmsOTPMutation } = smsOtpApi;
