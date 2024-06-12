import { TAuthGoogle } from "@/types/authGoogle.type";
import { IUser } from "@/types/user.type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

type TResLogin = { user: IUser; accessToken: string };

export const authGoogleApi = createApi({
  reducerPath: "authGoogle",
  baseQuery: fetchBaseQuery({
    baseUrl: "",
  }),
  endpoints: (build) => ({
    getInfoAuthGoogle: build.query<TAuthGoogle, string>({
      query: (token) => ({
        url: "https://www.googleapis.com/oauth2/v3/userinfo",
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }),
    }),
    loginAuthGoogle: build.mutation<TResLogin, TAuthGoogle>({
      query: (body) => ({
        url: "http://localhost:3000/api/auth/loginGoogle",
        method: "POST",
        body,
        credentials: "include",
      }),
    }),
  }),
});

export const { useLazyGetInfoAuthGoogleQuery, useLoginAuthGoogleMutation } =
  authGoogleApi;
