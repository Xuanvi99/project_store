import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IUser } from "../../types/userType";

type TAuth = { phoneOrEmail: string; password: string; code?: string };

type TInfoUser = { user: IUser; accessToken: string };

export const authAPi = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api/auth/" }),

  endpoints: (build) => ({
    //generic type query<type Responsive, type argument>
    register: build.mutation<TInfoUser, TAuth>({
      query: ({ phoneOrEmail, password }) => ({
        url: "register",
        method: "POST",
        body: { phone: phoneOrEmail, password },
        credentials: "include",
      }),
    }),
    login: build.mutation<TInfoUser, TAuth>({
      query: ({ phoneOrEmail, password }) => ({
        url: "login",
        method: "POST",
        body: { phoneOrEmail, password },
        credentials: "include",
      }),
    }),
    updatePassword: build.mutation<{ message: string }, TAuth>({
      query: ({ phoneOrEmail, password, code }) => ({
        url: "update_password",
        method: "POST",
        body: { phoneOrEmail, password, code },
      }),
    }),
    refreshToken: build.mutation<TInfoUser, void>({
      query: () => ({
        url: "refreshToken",
        method: "POST",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useUpdatePasswordMutation,
  useRefreshTokenMutation,
} = authAPi;
