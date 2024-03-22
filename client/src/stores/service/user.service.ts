import { createApi } from "@reduxjs/toolkit/query/react";
import { IUser } from "../../types/commonType";
import { baseQueryWithReauth } from "../../utils/baseQueryToken";

type TArg = {
  [Property in keyof Omit<
    IUser,
    "id" | "role" | "avatarDefault"
  >]?: IUser[Property];
};

export const userApi = createApi({
  reducerPath: "user",
  tagTypes: ["Users"],
  baseQuery: baseQueryWithReauth,
  endpoints: (build) => ({
    getListUser: build.query<IUser[], { page: string | "1"; search: string }>({
      query: ({ page, search }) => ({
        url: "user/getListUser",
        params: {
          page,
          search,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "Users" as const,
                id: _id,
              })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),
    getProfile: build.query<IUser, string>({
      query: (id) => ({ url: `user/${id}` }),
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),
    addUser: build.mutation<{ message: string }, TArg>({
      query: (body) => ({
        url: "user",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
    updateUser: build.mutation<
      { message: string; user: IUser },
      { body: TArg; id: string }
    >({
      query: ({ body, id }) => ({
        url: `user/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, data) => [
        { type: "Users", id: data.id },
      ],
    }),
    deleteUser: build.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Users", id }],
    }),
    blockedUser: build.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `user/${id}`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Users", id }],
    }),
    checkUser: build.mutation<
      { isCheckUser: boolean },
      { phoneOrEmail: string }
    >({
      query: (body) => ({
        url: "user/checkUser",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetListUserQuery,
  useGetProfileQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useCheckUserMutation,
} = userApi;
