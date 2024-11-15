import { IUser } from "@/types/user.type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type TArg = { phoneOrEmail: string; password: string; code?: string };

type TRes = { user: IUser; accessToken: string };

export const authApi = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_DOMAIN_SERVER + "/api/auth/",
    credentials: "include",
  }),
  endpoints: (build) => ({
    register: build.mutation<TRes, TArg>({
      query: ({ phoneOrEmail, password }) => ({
        url: "register",
        method: "POST",
        body: { phone: phoneOrEmail, password },
      }),
    }),
    login: build.mutation<TRes, TArg>({
      query: ({ phoneOrEmail, password }) => ({
        url: "login",
        method: "POST",
        body: { phoneOrEmail, password },
      }),
    }),
    updatePassword: build.mutation<{ message: string }, TArg>({
      query: ({ phoneOrEmail, password, code }) => ({
        url: "update_password",
        method: "POST",
        body: { phoneOrEmail, password, code },
      }),
    }),
    refreshToken: build.mutation<TRes, void>({
      query: () => ({
        url: "refreshToken",
        method: "POST",
      }),
    }),
    logOutAuth: build.mutation<{ message: string }, void>({
      query: () => ({
        url: "logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useUpdatePasswordMutation,
  useRefreshTokenMutation,
  useLogOutAuthMutation,
} = authApi;
