import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const otpApi = createApi({
  reducerPath: "otp",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_DOMAIN_SERVER + "/api/otp/",
  }),
  endpoints: (build) => ({
    sendEmail: build.mutation<{ message: string }, { email: string }>({
      query: (body) => ({
        url: "sendEmail",
        method: "POST",
        body: { ...body },
      }),
    }),
    verifyEmail: build.mutation<
      { expired: boolean },
      { email: string; code: string }
    >({
      query: (body) => ({
        url: "verifyEmail",
        method: "POST",
        body: { ...body },
      }),
    }),
  }),
});

export const { useSendEmailMutation, useVerifyEmailMutation } = otpApi;
