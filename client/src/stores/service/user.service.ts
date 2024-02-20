import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IUser } from "../../types/userType";

export const userAPi = createApi({
  reducerPath: "user",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api/user/" }),
  endpoints: (build) => ({
    //generic type query<type Responsive, type argument>
    getListUser: build.query<IUser[], void>({
      query: () => ({ url: "getListUser" }),
    }),
    checkUser: build.mutation<
      { isCheckUser: boolean },
      { phoneOrEmail: string }
    >({
      query: (body) => ({
        url: "checkUser",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetListUserQuery, useCheckUserMutation } = userAPi;
