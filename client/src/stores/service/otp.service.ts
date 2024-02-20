import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const otpAPi = createApi({
  reducerPath: "otp",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api/otp/" }),
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

export const { useSendEmailMutation, useVerifyEmailMutation } = otpAPi;
